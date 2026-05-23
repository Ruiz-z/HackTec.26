import { Router } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/v1/tips?tipo=plastico
router.get('/', async (req, res) => {
  const { tipo, categoria } = req.query
  const where: any = {}
  if (tipo) where.tipo = tipo
  if (categoria) where.categoria = categoria

  const tips = await prisma.tip.findMany({ where })
  res.json(tips)
})

// GET /api/v1/tips/random?tipo=plastico
router.get('/random', async (req, res) => {
  const { tipo } = req.query
  const where: any = {}
  if (tipo) where.tipo = tipo

  const count = await prisma.tip.count({ where })
  if (count === 0) return res.status(404).json({ error: 'No hay tips disponibles' })

  const skip = Math.floor(Math.random() * count)
  const tip = await prisma.tip.findFirst({ where, skip })
  res.json(tip)
})

export default router
