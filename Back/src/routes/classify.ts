import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { classifyImage, classifyOffline } from '../lib/claude'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

const LED_MAP: Record<string, string> = {
  organico: 'verde',
  reciclable: 'azul',
  no_reciclable: 'rojo',
}

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
      } catch {
        console.warn('Claude API no disponible, modo offline')
        result = classifyOffline(offlineKeyword || 'residuo')
        modoOffline = true
      }
    } else {
      result = classifyOffline(offlineKeyword!)
      modoOffline = true
    }

    const xpGanado = result.categoria === 'no_reciclable' ? 5 : 15

    const scan = await prisma.scan.create({
      data: {
        objeto: result.objeto,
        categoria: result.categoria,
        tipo: result.tipo,
        tip: result.tip,
        comoReciclar: result.comoReciclar,
        puntos: result.puntos,
        xpGanado,
        confianza: modoOffline ? 0 : result.confianza,
        userId: userId || null,
        basureroId: basureroId || null,
      },
    })

    let usuarioActualizado: { puntos: number; xp: number } | null = null
    if (userId) {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { puntos: { increment: result.puntos }, xp: { increment: xpGanado } },
      })
      const nuevoNivel = calcularNivel(user.xp + xpGanado)
      if (nuevoNivel.nombre !== user.nivel) {
        await prisma.user.update({
          where: { id: userId },
          data: { nivel: nuevoNivel.nombre, nivelNum: nuevoNivel.num },
        })
      }
      usuarioActualizado = user
      await actualizarRetos(userId, result.tipo, basureroId)
    }

    if (basureroId) {
      const basurero = await prisma.basurero.findUnique({ where: { id: basureroId } })
      if (basurero) {
        const nuevoNivel = Math.min(100, basurero.nivelActual + 3)
        const estado = nuevoNivel >= 95 ? 'lleno' : nuevoNivel >= 75 ? 'alerta' : 'disponible'
        await prisma.basurero.update({ where: { id: basureroId }, data: { nivelActual: nuevoNivel, estado } })
      }
    }

    enviarComandoESP32(result.categoria, LED_MAP[result.categoria])

    res.json({
      ...result,
      scanId: scan.id,
      xpGanado,
      modo: modoOffline ? 'offline' : 'ai',
      usuario: usuarioActualizado
        ? { puntos: usuarioActualizado.puntos, xp: usuarioActualizado.xp + xpGanado }
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

function calcularNivel(xp: number): { nombre: string; num: number } {
  if (xp >= 2000) return { nombre: 'Maestro Eco',     num: 15 }
  if (xp >= 1200) return { nombre: 'Reciclador Pro',  num: 12 }
  if (xp >= 700)  return { nombre: 'Eco Guardian',    num: 9  }
  if (xp >= 300)  return { nombre: 'Eco Aprendiz',    num: 6  }
  if (xp >= 100)  return { nombre: 'Eco Novato',      num: 3  }
  return           { nombre: 'Eco Principiante',       num: 1  }
}

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
        await prisma.user.update({ where: { id: userId }, data: { xp: { increment: reto.xpRecompensa } } })
      }
    }
  } catch (err) {
    console.error('Error actualizando retos:', err)
  }
}

async function enviarComandoESP32(categoria: string, led: string) {
  if (!process.env.ESP32_URL) return
  try {
    await fetch(`${process.env.ESP32_URL}/comando`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria, led }),
      signal: AbortSignal.timeout(3000),
    })
  } catch {
    console.warn('ESP32 no disponible')
  }
}

export default router
