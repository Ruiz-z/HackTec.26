import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { requirePermiso, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/basureros
router.get('/', async (_req: Request, res: Response) => {
  try {
    const basureros = await prisma.basurero.findMany({
      orderBy: { codigo: 'asc' },
      include: {
        scans: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { user: { select: { nombre: true } } },
        },
      },
    })

    const enriched = basureros.map(b => {
      const ultimoScan = b.scans[0]
      return {
        ...b,
        ultimoEvento: ultimoScan ? {
          usuario: ultimoScan.user?.nombre ?? 'Anonimo',
          tipo: ultimoScan.tipo,
          hace: tiempoRelativo(ultimoScan.createdAt),
        } : null,
        scans: undefined,
      }
    })

    res.json(enriched)
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

// GET /api/basureros/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const basurero = await prisma.basurero.findUnique({
      where: { id },
      include: {
        scans: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: { user: { select: { nombre: true } } },
        },
      },
    })
    if (!basurero) { res.status(404).json({ error: 'No encontrado' }); return }
    res.json(basurero)
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

// PATCH /api/basureros/:id/nivel — ESP32 actualiza nivel
router.patch('/:id/nivel', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const { nivelActual, bateria } = req.body
    const nivel = Number(nivelActual)
    const estado = nivel >= 95 ? 'lleno' : nivel >= 75 ? 'alerta' : 'disponible'

    const basurero = await prisma.basurero.update({
      where: { id },
      data: { nivelActual: nivel, estado, ...(bateria !== undefined && { bateria: Number(bateria) }) },
    })
    res.json(basurero)
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

// PATCH /api/basureros/codigo/:codigo/nivel — por código (B1, B2...)
router.patch('/codigo/:codigo/nivel', async (req: Request, res: Response) => {
  try {
    const { nivelActual, bateria } = req.body
    const nivel = Number(nivelActual)
    const estado = nivel >= 95 ? 'lleno' : nivel >= 75 ? 'alerta' : 'disponible'

    const basurero = await prisma.basurero.update({
      where: { codigo: req.params.codigo },
      data: { nivelActual: nivel, estado, ...(bateria && { bateria: Number(bateria) }) },
    })
    res.json(basurero)
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

// POST /api/basureros — solo admin
router.post('/', requirePermiso('crear_basurero'), async (req: AuthRequest, res: Response) => {
  try {
    const { codigo, nombre, ubicacion, lat, lng, tiposAcepta } = req.body
    const basurero = await prisma.basurero.create({ data: { codigo, nombre, ubicacion, lat, lng, tiposAcepta } })
    res.status(201).json(basurero)
  } catch (error: any) {
    if (error.code === 'P2002') { res.status(409).json({ error: 'Codigo ya existe' }); return }
    res.status(500).json({ error: 'Error interno' })
  }
})

function tiempoRelativo(fecha: Date): string {
  const diff = Date.now() - fecha.getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1)  return 'ahora'
  if (min < 60) return `hace ${min} min`
  const hrs = Math.floor(min / 60)
  if (hrs < 24) return `hace ${hrs} h`
  return `hace ${Math.floor(hrs / 24)} dias`
}

export default router
