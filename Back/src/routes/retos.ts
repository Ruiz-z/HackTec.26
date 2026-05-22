import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { requirePermiso, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/retos
router.get('/', async (_req: Request, res: Response) => {
  try {
    const retos = await prisma.reto.findMany({ where: { activo: true }, orderBy: { xpRecompensa: 'desc' } })
    res.json(retos)
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

// GET /api/retos/usuario/:userId
router.get('/usuario/:userId', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId)
    const retos = await prisma.reto.findMany({
      where: { activo: true },
      include: { progresos: { where: { userId }, take: 1 } },
    })

    const retosConProgreso = retos.map(r => ({
      id: r.id, titulo: r.titulo, descripcion: r.descripcion,
      tipo: r.tipo, meta: r.meta, xpRecompensa: r.xpRecompensa, icono: r.icono,
      progreso: r.progresos[0]?.progreso ?? 0,
      completado: r.progresos[0]?.completado ?? false,
      completadoAt: r.progresos[0]?.completadoAt ?? null,
      porcentaje: Math.min(100, Math.round(((r.progresos[0]?.progreso ?? 0) / r.meta) * 100)),
    }))

    res.json(retosConProgreso)
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

// POST /api/retos — solo admin
router.post('/', requirePermiso('crear_reto'), async (req: AuthRequest, res: Response) => {
  try {
    const { titulo, descripcion, tipo, meta, xpRecompensa, icono } = req.body
    const reto = await prisma.reto.create({ data: { titulo, descripcion, tipo, meta, xpRecompensa, icono } })
    res.status(201).json(reto)
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

export default router
