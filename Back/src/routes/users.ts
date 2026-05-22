import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/users/ranking
router.get('/ranking', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 10,
      select: {
        id: true, nombre: true, puntos: true, xp: true,
        nivel: true, nivelNum: true,
        _count: { select: { scans: true } },
      },
    })
    res.json(users)
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

// GET /api/users/rfid/:rfid
router.get('/rfid/:rfid', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { rfid: req.params.rfid },
      include: { scans: { orderBy: { createdAt: 'desc' }, take: 5 } },
    })
    if (!user) { res.status(404).json({ error: 'Usuario no encontrado' }); return }
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

// GET /api/users/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const user = await prisma.user.findUnique({
      where: { id },
      include: { scans: { orderBy: { createdAt: 'desc' }, take: 20 } },
    })
    if (!user) { res.status(404).json({ error: 'No encontrado' }); return }
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

// POST /api/users
router.post('/', async (req: Request, res: Response) => {
  try {
    const { rfid, nombre, email, password } = req.body
    if (!rfid || !nombre || !email || !password) { res.status(400).json({ error: 'rfid, nombre, email y password requeridos' }); return }
    const hash = await bcrypt.hash(password, 10)
    const userRole = await prisma.role.findUnique({ where: { nombre: 'user' } })
    if (!userRole) { res.status(500).json({ error: 'Rol user no encontrado' }); return }
    const user = await prisma.user.create({ data: { rfid, nombre, email, password: hash, roleId: userRole.id } })
    res.status(201).json(user)
  } catch (error: any) {
    if (error.code === 'P2002') { res.status(409).json({ error: 'RFID o email ya registrado' }); return }
    res.status(500).json({ error: 'Error interno' })
  }
})

export default router
