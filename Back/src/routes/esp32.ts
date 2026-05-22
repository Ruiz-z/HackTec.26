import { Router, Request, Response } from 'express'

const router = Router()

// POST /api/esp32/comando
router.post('/comando', async (req: Request, res: Response) => {
  try {
    if (!process.env.ESP32_URL) {
      res.json({ ok: true, modo: 'sin-esp32' }); return
    }
    const response = await fetch(`${process.env.ESP32_URL}/comando`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(3000),
    })
    res.json({ ok: true, esp32: await response.json() })
  } catch {
    res.json({ ok: true, modo: 'demo', mensaje: 'ESP32 no disponible' })
  }
})

// GET /api/esp32/health
router.get('/health', async (_req: Request, res: Response) => {
  if (!process.env.ESP32_URL) { res.json({ online: false, razon: 'ESP32_URL no configurado' }); return }
  try {
    const response = await fetch(`${process.env.ESP32_URL}/health`, { signal: AbortSignal.timeout(2000) })
    res.json({ online: response.ok, ip: process.env.ESP32_URL })
  } catch {
    res.json({ online: false, ip: process.env.ESP32_URL })
  }
})

export default router
