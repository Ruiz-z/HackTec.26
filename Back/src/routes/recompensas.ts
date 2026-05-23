import { Router, Response } from 'express'
import prisma from '../lib/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/recompensas
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const recompensas = await prisma.recompensa.findMany({
      where: { disponible: true },
      orderBy: { costo: 'asc' },
    })
    res.json(recompensas)
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

// GET /api/recompensas/mis-canjes
router.get('/mis-canjes', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const canjes = await prisma.canje.findMany({
      where: { userId: req.userId },
      include: { recompensa: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(canjes)
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

// POST /api/recompensas/canjear/:id
router.post('/canjear/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const recompensaId = Number(req.params.id)
    const userId = req.userId!

    const recompensa = await prisma.recompensa.findUnique({ where: { id: recompensaId } })
    if (!recompensa || !recompensa.disponible) {
      res.status(404).json({ error: 'Recompensa no encontrada o no disponible' })
      return
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      res.status(400).json({ error: 'Usuario no encontrado' })
      return
    }
    if (user.puntos < recompensa.costo) {
      res.status(400).json({ error: 'Puntos insuficientes' })
      return
    }
    if (user.nivelNum < recompensa.nivelMinimo) {
      res.status(400).json({ error: `Nivel mínimo requerido: ${recompensa.nivelMinimo}` })
      return
    }

    const [canje] = await prisma.$transaction([
      prisma.canje.create({
        data: { userId, recompensaId },
        include: { recompensa: true },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { puntos: { decrement: recompensa.costo } },
      }),
    ])

    res.status(201).json(canje)
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

export default router
