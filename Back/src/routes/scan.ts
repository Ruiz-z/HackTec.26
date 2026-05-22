import { Router, Response } from 'express'
import prisma from '../lib/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/v1/scan?botId=X
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const botId = req.query.botId as string
    if (!botId) {
      res.status(400).json({ error: 'botId requerido' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        role: { select: { id: true, nombre: true } },
      },
    })
    if (!user) {
      res.status(401).json({ error: 'Usuario no encontrado', code: 'NO_AUTH' })
      return
    }

    const basurero = await prisma.basurero.findUnique({
      where: { codigo: botId },
      select: { id: true, codigo: true, nombre: true, ubicacion: true, tiposAcepta: true },
    })
    if (!basurero) {
      res.status(404).json({ error: 'Basurero no encontrado' })
      return
    }

    res.json({
      user: { id: user.id, nombre: user.nombre, nivel: user.nivel, xp: user.xp, rol: user.role },
      bot: { id: basurero.id, codigo: basurero.codigo, nombre: basurero.nombre, ubicacion: basurero.ubicacion, tiposAcepta: basurero.tiposAcepta },
    })
  } catch (error) {
    console.error('Error en /scan:', error)
    res.status(500).json({ error: 'Error interno' })
  }
})

export default router
