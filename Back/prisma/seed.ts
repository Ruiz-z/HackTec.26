import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding EcoArcade...')

  const hash = await bcrypt.hash('demo123', 10)

  // Roles
  const roleAdmin = await prisma.role.upsert({
    where: { nombre: 'admin' },
    update: {},
    create: { nombre: 'admin', descripcion: 'Acceso total al sistema' },
  })
  const roleUser = await prisma.role.upsert({
    where: { nombre: 'user' },
    update: {},
    create: { nombre: 'user', descripcion: 'Usuario regular' },
  })
  console.log('✅ Roles listos')

  // Permisos admin
  const adminPermisos = ['ver_admin_panel', 'crear_basurero', 'crear_reto']
  for (const nombre of adminPermisos) {
    const exists = await prisma.permiso.findFirst({ where: { nombre, roleId: roleAdmin.id } })
    if (!exists) await prisma.permiso.create({ data: { nombre, descripcion: null, roleId: roleAdmin.id } })
  }

  // Permisos user
  const userPermisos = ['depositar', 'escanear_qr', 'ver_ranking']
  for (const nombre of userPermisos) {
    const exists = await prisma.permiso.findFirst({ where: { nombre, roleId: roleUser.id } })
    if (!exists) await prisma.permiso.create({ data: { nombre, descripcion: null, roleId: roleUser.id } })
  }
  console.log('✅ Permisos listos')

  // Usuarios
  const usuarios = [
    { rfid: 'DEMO001', email: 'mauro@eco.com',     nombre: 'Mauro',  roleId: roleAdmin.id, puntos: 450, xp: 2340, nivel: 'Reciclador Pro',  nivelNum: 12 },
    { rfid: 'DEMO002', email: 'ana@eco.com',       nombre: 'Ana',    roleId: roleUser.id,  puntos: 320, xp: 1800, nivel: 'Eco Guardián',     nivelNum: 9  },
    { rfid: 'DEMO003', email: 'luis@eco.com',      nombre: 'Luis',   roleId: roleUser.id,  puntos: 180, xp: 950,  nivel: 'Eco Aprendiz',     nivelNum: 6  },
    { rfid: 'DEMO004', email: 'sara@eco.com',      nombre: 'Sara',   roleId: roleUser.id,  puntos: 90,  xp: 420,  nivel: 'Eco Novato',       nivelNum: 3  },
    { rfid: 'DEMO005', email: 'carlos@eco.com',    nombre: 'Carlos', roleId: roleUser.id,  puntos: 60,  xp: 280,  nivel: 'Eco Principiante', nivelNum: 1  },
  ]
  for (const u of usuarios) {
    await prisma.user.upsert({
      where: { rfid: u.rfid },
      update: { ...u, password: hash },
      create: { ...u, password: hash },
    })
  }
  console.log('✅ Usuarios listos')

  // Basureros
  const basureros = [
    { codigo: 'B1', nombre: 'Parque Central',  ubicacion: 'Parque Central, Monterrey',      nivelActual: 42, estado: 'disponible', bateria: 85, online: true,  lat: 25.6714, lng: -100.3089 },
    { codigo: 'B2', nombre: 'Av. Garza Sada',  ubicacion: 'Av. Garza Sada 2501, Monterrey', nivelActual: 77, estado: 'alerta',     bateria: 62, online: true,  lat: 25.6511, lng: -100.2896 },
    { codigo: 'B3', nombre: 'Metro Garza',     ubicacion: 'Metro Garza, Monterrey',          nivelActual: 98, estado: 'lleno',      bateria: 91, online: true,  lat: 25.6598, lng: -100.3102 },
    { codigo: 'B4', nombre: 'Plaza Sésamo',    ubicacion: 'Plaza Sésamo, San Pedro',         nivelActual: 30, estado: 'disponible', bateria: 78, online: true,  lat: 25.6502, lng: -100.3367 },
    { codigo: 'B5', nombre: 'Escuela Tec',     ubicacion: 'ITESM Campus Monterrey',          nivelActual: 18, estado: 'disponible', bateria: 44, online: true,  lat: 25.6516, lng: -100.2894 },
    { codigo: 'B6', nombre: 'Centro Rec.',     ubicacion: 'Centro de Reciclaje Municipal',   nivelActual: 5,  estado: 'disponible', bateria: 97, online: true,  lat: 25.6760, lng: -100.3196 },
  ]
  for (const b of basureros) {
    await prisma.basurero.upsert({ where: { codigo: b.codigo }, update: b, create: b })
  }
  console.log('✅ Basureros listos')

  const retos = [
    { titulo: 'Primer Reciclaje',     descripcion: 'Recicla tu primer residuo',                tipo: 'cantidad',     meta: 1,  xpRecompensa: 50,  icono: '🌱' },
    { titulo: 'Eco Activo',           descripcion: 'Recicla 10 residuos en total',              tipo: 'cantidad',     meta: 10, xpRecompensa: 100, icono: '♻️' },
    { titulo: 'Maestro del Plástico', descripcion: 'Recicla 5 residuos de plástico',            tipo: 'tipo_residuo', meta: 5,  xpRecompensa: 150, icono: '🥤' },
    { titulo: 'Explorador Urbano',    descripcion: 'Usa 3 basureros diferentes en la ruta',     tipo: 'explorar',     meta: 3,  xpRecompensa: 200, icono: '🗺️' },
    { titulo: 'Reciclador Dedicado',  descripcion: 'Recicla 25 residuos en total',              tipo: 'cantidad',     meta: 25, xpRecompensa: 300, icono: '🏆' },
    { titulo: 'Rey del Vidrio',       descripcion: 'Recicla 5 residuos de vidrio',              tipo: 'tipo_residuo', meta: 5,  xpRecompensa: 150, icono: '🍾' },
  ]
  await prisma.reto.deleteMany()
  await prisma.reto.createMany({ data: retos })
  console.log('✅ Retos listos')

  const user1 = await prisma.user.findUnique({ where: { rfid: 'DEMO001' } })
  const user2 = await prisma.user.findUnique({ where: { rfid: 'DEMO002' } })
  const b3    = await prisma.basurero.findUnique({ where: { codigo: 'B3' } })
  const b2    = await prisma.basurero.findUnique({ where: { codigo: 'B2' } })
  const b1    = await prisma.basurero.findUnique({ where: { codigo: 'B1' } })
  const b5    = await prisma.basurero.findUnique({ where: { codigo: 'B5' } })

  await prisma.scan.createMany({
    data: [
      { objeto: 'Botella de plástico', categoria: 'reciclable', tipo: 'plastico', tip: 'Tarda 450 años en degradarse',         comoReciclar: 'Enjuaga y deposita en contenedor amarillo',   puntos: 10, xpGanado: 15, confianza: 95, errorTipo: false, userId: user1!.id, basureroId: b3!.id },
      { objeto: 'Cartón de leche',     categoria: 'reciclable', tipo: 'carton',   tip: 'Reciclar cartón salva 17 árboles/ton', comoReciclar: 'Aplana y deposita en contenedor azul',        puntos: 10, xpGanado: 15, confianza: 92, errorTipo: false, userId: user2!.id, basureroId: b2!.id },
      { objeto: 'Cáscara orgánica',    categoria: 'organico',   tipo: 'organico', tip: 'Los orgánicos son 50% de la basura',   comoReciclar: 'Deposita en contenedor verde para composta',  puntos: 10, xpGanado: 15, confianza: 98, errorTipo: false, userId: user1!.id, basureroId: b1!.id },
      { objeto: 'Lata de aluminio',    categoria: 'reciclable', tipo: 'metal',    tip: 'Reciclar aluminio usa 95% menos energía', comoReciclar: 'Aplasta y deposita en contenedor amarillo', puntos: 10, xpGanado: 15, confianza: 97, errorTipo: false, userId: user2!.id, basureroId: b5!.id },
    ],
  })
  console.log('✅ Scans de ejemplo listos')
  console.log('\n🎉 Seed completo! EcoArcade listo.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
