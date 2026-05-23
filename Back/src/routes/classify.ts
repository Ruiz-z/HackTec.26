import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { classifyImage, classifyOffline } from '../lib/claude'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { calcularRecompensa, calcularNivel } from '../lib/nivel'

const router = Router()

// POST /api/classify
// Body: { image?: string (base64), userId?: number, basureroId?: number, offlineKeyword?: string }
router.post('/', async (req: Request, res: Response) => {
  try {
    const { image, userId, basureroId, offlineKeyword } = req.body

    if (!image && !offlineKeyword) {
      res.status(400).json({ error: 'Se requiere imagen (base64) o offlineKeyword' })
      return
    }

    let result
    let modoOffline = false

    if (image) {
      try {
        result = await classifyImage(image)
      } catch (err) {
        console.warn('Claude API falló:', (err as Error).message)
        if (offlineKeyword) {
          result = classifyOffline(offlineKeyword)
          modoOffline = true
        } else {
          res.status(503).json({
            error: 'Clasificación IA no disponible. Intenta con una keyword offline o verifica ANTHROPIC_API_KEY.',
            code: 'AI_UNAVAILABLE',
          })
          return
        }
      }
    } else {
      result = classifyOffline(offlineKeyword!)
      modoOffline = true
    }

    const esError = result.categoria === 'error'
    const { ptsGanados, xpGanados, nivel: nivelInfo } = esError
      ? { ptsGanados: 0, xpGanados: 0, nivel: { nombre: 'Eco Principiante', num: 1, multiplier: 1 } }
      : await (async () => {
          const user = userId ? await prisma.user.findUnique({ where: { id: userId }, select: { xp: true } }) : null
          return calcularRecompensa(result.tipo, user?.xp || 0)
        })()

    const scan = await prisma.scan.create({
      data: {
        objeto: result.objeto,
        categoria: result.categoria,
        tipo: result.tipo,
        tip: result.tip,
        comoReciclar: result.comoReciclar,
        puntos: ptsGanados,
        xpGanado: xpGanados,
        confianza: modoOffline ? 0 : result.confianza,
        userId: userId || null,
        basureroId: basureroId || null,
      },
    })

    let usuarioActualizado: { puntos: number; xp: number } | null = null
    if (userId && !esError) {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { puntos: { increment: ptsGanados }, xp: { increment: xpGanados } },
      })
      if (nivelInfo.nombre !== user.nivel) {
        await prisma.user.update({
          where: { id: userId },
          data: { nivel: nivelInfo.nombre, nivelNum: nivelInfo.num },
        })
      }
      usuarioActualizado = user
      await actualizarRetos(userId, result.tipo, basureroId)
    }

    if (basureroId && !esError) {
      const basurero = await prisma.basurero.findUnique({ where: { id: basureroId } })
      if (basurero) {
        const nuevoNivel = Math.min(100, basurero.nivelActual + 3)
        const estado = nuevoNivel >= 95 ? 'lleno' : nuevoNivel >= 75 ? 'alerta' : 'disponible'
        await prisma.basurero.update({ where: { id: basureroId }, data: { nivelActual: nuevoNivel, estado } })
      }
    }

    if (!esError) enviarComandoESP32(result.tipo)

    res.json({
      ...result,
      scanId: scan.id,
      xpGanado: xpGanados,
      modo: modoOffline ? 'offline' : 'ai',
      error: esError ? 'Residuo no admitido. Solo clasificamos plastico, papel y aluminio.' : undefined,
      usuario: usuarioActualizado
        ? { puntos: usuarioActualizado.puntos, xp: usuarioActualizado.xp }
        : null,
    })
  } catch (error) {
    console.error('Error en /classify:', error)
    res.status(500).json({ error: 'Error interno al clasificar' })
  }
})

// GET /api/classify/recientes
router.get('/recientes', async (_req: Request, res: Response) => {
  try {
    const scans = await prisma.scan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: { select: { nombre: true } },
        basurero: { select: { codigo: true, nombre: true } },
      },
    })
    res.json(scans)
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

async function actualizarRetos(userId: number, tipo: string, basureroId?: number) {
  try {
    const retos = await prisma.reto.findMany({ where: { activo: true } })
    for (const reto of retos) {
      let aplica = false
      if (reto.tipo === 'cantidad') aplica = true
      if (reto.tipo === 'tipo_residuo' && reto.descripcion.toLowerCase().includes(tipo)) aplica = true
      if (reto.tipo === 'explorar' && basureroId) aplica = true
      if (!aplica) continue

      const progreso = await prisma.progresoReto.upsert({
        where: { userId_retoId: { userId, retoId: reto.id } },
        update: { progreso: { increment: 1 } },
        create: { userId, retoId: reto.id, progreso: 1 },
      })

      if (!progreso.completado && progreso.progreso >= reto.meta) {
        await prisma.progresoReto.update({
          where: { id: progreso.id },
          data: { completado: true, completadoAt: new Date() },
        })
        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: { increment: reto.xpRecompensa },
            puntos: { increment: reto.ptsRecompensa },
          },
        })
      }
    }
  } catch (err) {
    console.error('Error actualizando retos:', err)
  }
}

const MAPA_TIPO_ESP32: Record<string, string> = {
  plastico: 'plastico',
  papel: 'papel',
  aluminio: 'aluminio',
}

async function enviarComandoESP32(tipo: string) {
  if (!process.env.ESP32_DOOR_URL || !process.env.ESP32_SORTER_URL) return
  const endpoint = MAPA_TIPO_ESP32[tipo] || tipo
  try {
    await fetch(`${process.env.ESP32_DOOR_URL}/leido`, { signal: AbortSignal.timeout(5000) })
    await new Promise(r => setTimeout(r, 3000))
    await fetch(`${process.env.ESP32_SORTER_URL}/${endpoint}`, { signal: AbortSignal.timeout(5000) })
    console.log(`ESP32: puerta abierta, clasificado como ${tipo} → ${endpoint}`)
  } catch {
    console.warn('ESP32 no disponible')
  }
}

export default router
