import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

const SECRET = process.env.JWT_SECRET || 'ecoardace-secret-hackaton-2026'

export interface AuthRequest extends Request {
  userId?: number
  roleId?: number
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Sesión expirada', code: 'NO_AUTH' })
    return
  }

  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, SECRET) as { userId: number; roleId: number }
    req.userId = decoded.userId
    req.roleId = decoded.roleId
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido', code: 'INVALID_TOKEN' })
  }
}

export function requirePermiso(permisoNombre: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Sesión expirada', code: 'NO_AUTH' })
      return
    }

    try {
      const token = header.split(' ')[1]
      const decoded = jwt.verify(token, SECRET) as { userId: number; roleId: number }
      req.userId = decoded.userId
      req.roleId = decoded.roleId

      const permiso = await prisma.permiso.findFirst({
        where: { nombre: permisoNombre, roleId: req.roleId },
      })

      if (!permiso) {
        res.status(403).json({ error: 'Acceso denegado', code: 'FORBIDDEN' })
        return
      }

      next()
    } catch {
      res.status(401).json({ error: 'Token inválido', code: 'INVALID_TOKEN' })
    }
  }
}
