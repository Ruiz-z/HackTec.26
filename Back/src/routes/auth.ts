import { Router, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import prisma from '../lib/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { sendPasswordReset } from '../lib/email'

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

// POST /api/v1/auth/forgot-password
// Body: { email }
router.post('/forgot-password', async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body
    if (!email) {
      res.status(400).json({ error: 'Email requerido' })
      return
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.json({ message: 'Si el email existe, recibirás un enlace de recuperación' })
      return
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 3600000) // 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    })

    await sendPasswordReset(email, token)

    res.json({ message: 'Si el email existe, recibirás un enlace de recuperación' })
  } catch (error) {
    console.error('Error en /auth/forgot-password:', error)
    res.status(500).json({ error: 'Error interno' })
  }
})

// POST /api/v1/auth/reset-password
// Body: { token, password }
router.post('/reset-password', async (req: AuthRequest, res: Response) => {
  try {
    const { token, password } = req.body
    if (!token || !password) {
      res.status(400).json({ error: 'Token y nueva contraseña requeridos' })
      return
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    })
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      res.status(400).json({ error: 'Token inválido o expirado' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    res.json({ message: 'Contraseña restablecida correctamente' })
  } catch (error) {
    console.error('Error en /auth/reset-password:', error)
    res.status(500).json({ error: 'Error interno' })
  }
})

export default router
