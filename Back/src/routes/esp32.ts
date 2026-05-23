import { Router, Request, Response } from 'express'

const router = Router()

// POST /api/esp32/comando
router.post('/comando', async (req: Request, res: Response) => {
  try {
    if (!process.env.ESP32_DOOR_URL) {
      res.json({ ok: true, modo: 'sin-esp32' }); return
    }
    const { tipo } = req.body
    if (tipo === 'abrir') {
      await fetch(`${process.env.ESP32_DOOR_URL}/leido`, { signal: AbortSignal.timeout(5000) })
      await new Promise(r => setTimeout(r, 3000))
    } else if (tipo && process.env.ESP32_SORTER_URL) {
      await fetch(`${process.env.ESP32_SORTER_URL}/${tipo}`, { signal: AbortSignal.timeout(5000) })
    }
    res.json({ ok: true, modo: 'real' })
  } catch {
    res.json({ ok: true, modo: 'demo', mensaje: 'ESP32 no disponible' })
  }
})

// GET /api/esp32/health
router.get('/health', async (_req: Request, res: Response) => {
  if (!process.env.ESP32_DOOR_URL) { res.json({ online: false, razon: 'ESP32_DOOR_URL no configurado' }); return }
  try {
    const response = await fetch(`${process.env.ESP32_DOOR_URL}/leido`, { method: 'HEAD', signal: AbortSignal.timeout(2000) })
    res.json({ online: response.ok || response.status === 405, puerta: process.env.ESP32_DOOR_URL, clasificador: process.env.ESP32_SORTER_URL || 'no configurado' })
  } catch {
    res.json({ online: false, puerta: process.env.ESP32_DOOR_URL })
  }
})

export default router
