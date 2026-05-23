export interface NivelInfo {
  nombre: string
  num: number
  multiplier: number
}

const NIVELES: { minXp: number; nombre: string; num: number; multiplier: number }[] = [
  { minXp: 2000, nombre: 'Maestro Eco',     num: 15, multiplier: 1.5 },
  { minXp: 1200, nombre: 'Reciclador Pro',  num: 12, multiplier: 1.4 },
  { minXp: 700,  nombre: 'Eco Guardian',    num: 9,  multiplier: 1.3 },
  { minXp: 300,  nombre: 'Eco Aprendiz',    num: 6,  multiplier: 1.2 },
  { minXp: 100,  nombre: 'Eco Novato',      num: 3,  multiplier: 1.1 },
]

export function calcularNivel(xp: number): NivelInfo {
  for (const n of NIVELES) {
    if (xp >= n.minXp) return { nombre: n.nombre, num: n.num, multiplier: n.multiplier }
  }
  return { nombre: 'Eco Principiante', num: 1, multiplier: 1.0 }
}

export const MATERIAL_REWARDS: Record<string, { pts: number; xp: number }> = {
  plastico: { pts: 8,  xp: 12 },
  papel:    { pts: 10, xp: 15 },
  aluminio: { pts: 12, xp: 18 },
  error:    { pts: 0,  xp: 0  },
}

export function calcularRecompensa(
  tipo: string,
  xpActual: number,
): { ptsGanados: number; xpGanados: number; nivel: NivelInfo } {
  const base = MATERIAL_REWARDS[tipo] || MATERIAL_REWARDS.error
  const nivel = calcularNivel(xpActual)
  const ptsGanados = Math.round(base.pts * nivel.multiplier)
  const xpGanados = Math.round(base.xp * nivel.multiplier)
  return { ptsGanados, xpGanados, nivel }
}
