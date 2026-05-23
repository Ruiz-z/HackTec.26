import { Router, Request, Response } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import prisma from '../lib/prisma'
import { classifyImage, classifyOffline } from '../lib/claude'

const router = Router()

// POST /api/v1/bins/deposit
// Body: { image?: string, botId: string, offlineKeyword?: string }
router.post('/deposit', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { image, botId, offlineKeyword } = req.body
    const userId = req.userId!

    if (!botId) {
      res.status(400).json({ error: 'botId requerido' })
      return
    }
    if (!image && !offlineKeyword) {
      res.status(400).json({ error: 'Se requiere imagen (base64) o offlineKeyword' })
      return
    }

    const basurero = await prisma.basurero.findUnique({ where: { codigo: botId } })
    if (!basurero) {
      res.status(404).json({ error: 'Basurero no encontrado' })
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

    const tiposAceptados = basurero.tiposAcepta.split(',')
    const mismatch = !tiposAceptados.includes(result.tipo)

    const esError = result.categoria === 'error'
    const xpGanado = esError ? 0 : 15

    if (esError) {
      const scan = await prisma.scan.create({
        data: {
          objeto: result.objeto,
          categoria: result.categoria,
          tipo: result.tipo,
          tip: result.tip,
          comoReciclar: result.comoReciclar,
          puntos: 0,
          xpGanado: 0,
          confianza: modoOffline ? 0 : result.confianza,
          errorTipo: true,
          userId,
          basureroId: basurero.id,
        },
      })
      res.status(422).json({
        error: 'Residuo no admitido. Solo clasificamos plastico, metal y aluminio.',
        code: 'MATERIAL_NOT_ALLOWED',
        tipoDetectado: result.tipo,
        scanId: scan.id,
      })
      return
    }

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
        errorTipo: mismatch,
        userId,
        basureroId: basurero.id,
      },
    })

    if (mismatch) {
      const nuevoNivel = Math.min(100, basurero.nivelActual + 1)
      const estado = nuevoNivel >= 95 ? 'lleno' : nuevoNivel >= 75 ? 'alerta' : 'disponible'
      await prisma.basurero.update({ where: { id: basurero.id }, data: { nivelActual: nuevoNivel, estado } })

      res.status(422).json({
        error: 'Tipo de residuo no aceptado',
        code: 'TYPE_MISMATCH',
        tipoDetectado: result.tipo,
        tiposAceptados,
        scanId: scan.id,
      })
      return
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { puntos: { increment: result.puntos }, xp: { increment: xpGanado } },
    })
    const nuevoNivel = calcularNivel(user.xp + xpGanado)
    if (nuevoNivel.nombre !== user.nivel) {
      await prisma.user.update({ where: { id: userId }, data: { nivel: nuevoNivel.nombre, nivelNum: nuevoNivel.num } })
    }

    if (basurero) {
      const nuevoNivelBas = Math.min(100, basurero.nivelActual + 3)
      const estado = nuevoNivelBas >= 95 ? 'lleno' : nuevoNivelBas >= 75 ? 'alerta' : 'disponible'
      await prisma.basurero.update({ where: { id: basurero.id }, data: { nivelActual: nuevoNivelBas, estado } })
    }

    enviarComandoESP32(result.tipo)

    res.json({
      ...result,
      scanId: scan.id,
      xpGanado,
      modo: modoOffline ? 'offline' : 'ai',
      usuario: { puntos: user.puntos, xp: user.xp },
    })
  } catch (error) {
    console.error('Error en /bins/deposit:', error)
    res.status(500).json({ error: 'Error interno' })
  }
})

function calcularNivel(xp: number): { nombre: string; num: number } {
  if (xp >= 2000) return { nombre: 'Maestro Eco', num: 15 }
  if (xp >= 1200) return { nombre: 'Reciclador Pro', num: 12 }
  if (xp >= 700) return { nombre: 'Eco Guardian', num: 9 }
  if (xp >= 300) return { nombre: 'Eco Aprendiz', num: 6 }
  if (xp >= 100) return { nombre: 'Eco Novato', num: 3 }
  return { nombre: 'Eco Principiante', num: 1 }
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
