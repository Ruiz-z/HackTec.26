import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { requirePermiso, AuthRequest } from '../middleware/auth'

const router = Router()

const CO2_MAP: Record<string, number> = {
  plastico: 0.5, papel: 0.2, aluminio: 0.4, error: 0.0,
}

// GET /api/stats
router.get('/', async (_req: Request, res: Response) => {
  try {
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0)

    const [totalHoy, totalGeneral, porCategoria, totalUsuarios, ranking, basurerosAlerta] =
      await Promise.all([
        prisma.scan.count({ where: { createdAt: { gte: hoy } } }),
        prisma.scan.count(),
        prisma.scan.groupBy({ by: ['categoria'], _count: { id: true }, where: { createdAt: { gte: hoy } } }),
        prisma.user.count(),
        prisma.user.findMany({
          orderBy: { xp: 'desc' }, take: 10,
          select: { id: true, nombre: true, puntos: true, xp: true, nivel: true, nivelNum: true, _count: { select: { scans: true } } },
        }),
        prisma.basurero.count({ where: { estado: { in: ['alerta', 'lleno'] } } }),
      ])

    const scansReciclables = await prisma.scan.findMany({
      where: { createdAt: { gte: hoy }, categoria: 'reciclable' },
      select: { tipo: true },
    })
    const co2Evitado = scansReciclables.reduce((acc, s) => acc + (CO2_MAP[s.tipo] ?? 0.3), 0)

    const scansPorHora = await prisma.$queryRaw<{ hora: number; total: number }[]>`
      SELECT CAST(strftime('%H', createdAt) AS INTEGER) as hora, COUNT(*) as total
      FROM Scan WHERE createdAt >= ${hoy.toISOString()}
      GROUP BY hora ORDER BY hora`

    const porTipo = await prisma.scan.groupBy({
      by: ['tipo'], _count: { id: true }, orderBy: { _count: { id: 'desc' } },
    })

    res.json({
      totalHoy, totalGeneral, totalUsuarios,
      co2Evitado: Math.round(co2Evitado * 100) / 100,
      basurerosAlerta,
      reciclables: porCategoria.find(c => c.categoria === 'reciclable')?._count.id ?? 0,
      errores:     porCategoria.find(c => c.categoria === 'error')?._count.id      ?? 0,
      porCategoria, porTipo, scansPorHora, ranking,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno' })
  }
})

// GET /api/stats/admin — solo admin
router.get('/admin', requirePermiso('ver_admin_panel'), async (_req: AuthRequest, res: Response) => {
  try {
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
    const semana = new Date(); semana.setDate(semana.getDate() - 7)

    const [totalScans, scansHoy, usuariosActivos, basureros, alertas, kgPorDia] = await Promise.all([
      prisma.scan.count(),
      prisma.scan.count({ where: { createdAt: { gte: hoy } } }),
      prisma.user.count({ where: { scans: { some: { createdAt: { gte: semana } } } } }),
      prisma.basurero.findMany({ orderBy: { codigo: 'asc' } }),
      prisma.basurero.findMany({
        where: { estado: { in: ['lleno', 'offline'] } },
        select: { codigo: true, nombre: true, estado: true, nivelActual: true },
      }),
      prisma.$queryRaw<{ dia: string; total: number }[]>`
        SELECT date(createdAt) as dia, COUNT(*) as total
        FROM Scan WHERE createdAt >= ${semana.toISOString()}
        GROUP BY dia ORDER BY dia`,
    ])

    const correctos = await prisma.scan.count({ where: { categoria: 'reciclable' } })
    const tasaClasificacion = totalScans > 0 ? Math.round((correctos / totalScans) * 100) : 0

    res.json({
      totalScans, scansHoy, usuariosActivos, tasaClasificacion,
      toneladasRecicladas: Math.round((correctos * 0.0003) * 100) / 100,
      basureros: basureros.map(b => ({ ...b, critico: b.estado === 'lleno' || b.bateria < 20 })),
      alertas,
      kgPorDia: kgPorDia.map(d => ({ ...d, kg: Number(d.total) * 0.3 })),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno' })
  }
})

// GET /api/stats/impacto
router.get('/impacto', async (_req: Request, res: Response) => {
  try {
    const todos = await prisma.scan.findMany({ select: { tipo: true, categoria: true } })
    const totalCO2 = todos.reduce((acc, s) => acc + (CO2_MAP[s.tipo] ?? 0), 0)
    const totalReciclables = todos.filter(s => s.categoria === 'reciclable').length

    res.json({
      totalScans: todos.length, totalReciclables,
      co2Total: Math.round(totalCO2 * 100) / 100,
      arbolesEquivalentes: Math.round(totalCO2 / 21),
      litrosAguaAhorrados: Math.round(totalReciclables * 2.5),
    })
  } catch {
    res.status(500).json({ error: 'Error interno' })
  }
})

export default router
