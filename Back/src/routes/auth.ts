import { Router, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
const SECRET = process.env.JWT_SECRET || 'ecoardace-secret-hackaton-2026'

// POST /api/v1/auth/login
// Body: { email, password }
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña requeridos' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: { permisos: true },
        },
      },
    })
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' })
      return
    }

    const valido = await bcrypt.compare(password, user.password)
    if (!valido) {
      res.status(401).json({ error: 'Credenciales inválidas' })
      return
    }

    const token = jwt.sign({ userId: user.id, roleId: user.roleId }, SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: {
          id: user.role.id,
          nombre: user.role.nombre,
        },
        permisos: user.role.permisos.map(p => p.nombre),
        nivel: user.nivel,
        xp: user.xp,
      },
    })
  } catch (error) {
    console.error('Error en /auth/login:', error)
    res.status(500).json({ error: 'Error interno' })
  }
})

// GET /api/v1/auth/me
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        role: {
          include: { permisos: true },
        },
      },
    })
    if (!user) {
      res.status(401).json({ error: 'Usuario no encontrado', code: 'NO_AUTH' })
      return
    }

    res.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: {
          id: user.role.id,
          nombre: user.role.nombre,
        },
        permisos: user.role.permisos.map(p => p.nombre),
        nivel: user.nivel,
        xp: user.xp,
      },
    })
  } catch (error) {
    console.error('Error en /auth/me:', error)
    res.status(500).json({ error: 'Error interno' })
  }
})

export default router
