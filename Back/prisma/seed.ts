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
    { titulo: 'Primer Reciclaje',     descripcion: 'Recicla tu primer residuo',                tipo: 'cantidad',     meta: 1,  xpRecompensa: 50,  ptsRecompensa: 2,  icono: '🌱' },
    { titulo: 'Eco Activo',           descripcion: 'Recicla 10 residuos en total',              tipo: 'cantidad',     meta: 10, xpRecompensa: 100, ptsRecompensa: 4,  icono: '♻️' },
    { titulo: 'Maestro del Plástico', descripcion: 'Recicla 5 residuos de plástico',            tipo: 'tipo_residuo', meta: 5,  xpRecompensa: 150, ptsRecompensa: 6,  icono: '🥤' },
    { titulo: 'Explorador Urbano',    descripcion: 'Usa 3 basureros diferentes en la ruta',     tipo: 'explorar',     meta: 3,  xpRecompensa: 200, ptsRecompensa: 8,  icono: '🗺️' },
    { titulo: 'Reciclador Dedicado',  descripcion: 'Recicla 25 residuos en total',              tipo: 'cantidad',     meta: 25, xpRecompensa: 300, ptsRecompensa: 12, icono: '🏆' },
    { titulo: 'Rey del Plastico',     descripcion: 'Recicla 5 residuos de plastico',              tipo: 'tipo_residuo', meta: 5,  xpRecompensa: 150, ptsRecompensa: 6,  icono: '🥤' },
  ]
	await prisma.progresoReto.deleteMany()
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

	// Recompensas
	await prisma.canje.deleteMany()
	await prisma.recompensa.deleteMany()
  await prisma.recompensa.createMany({
    data: [
      // === Físicos ===
      { titulo: 'Boleto de Transporte Público', descripcion: 'Un viaje gratis integrado en tu tarjeta de transporte urbano.', categoria: 'Digital', costo: 150, imagen: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop&auto=format', icono: '🎫', nivelMinimo: 1 },
      { titulo: 'Llavero Ecológico', descripcion: 'Llavero de madera reciclada con el logo de EcoArcade.', categoria: 'Físico', costo: 200, imagen: 'https://unsplash.com/photos/y5N2HDwagVw/download?force=true&w=400', icono: '🔑', nivelMinimo: 1 },
      { titulo: 'Bolsa de Tela Reutilizable', descripcion: 'Bolsa plegable de algodón orgánico para tus compras.', categoria: 'Físico', costo: 250, imagen: 'https://images.unsplash.com/photo-1616627561959-696f29da7b11?w=400&h=300&fit=crop&auto=format', icono: '🛍️', nivelMinimo: 1 },
      { titulo: 'Sticker Pack EcoArcade', descripcion: 'Set de 10 stickers con diseños exclusivos de la comunidad.', categoria: 'Físico', costo: 300, imagen: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=400&h=300&fit=crop&auto=format', icono: '🎨', nivelMinimo: 2 },
      { titulo: 'Bono de Café Orgánico Gratis', descripcion: 'Cupón digital válido por un café mediano en establecimientos locales participantes.', categoria: 'Digital', costo: 350, imagen: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&auto=format', icono: '☕', nivelMinimo: 3 },
      { titulo: 'Taza Térmica Reutilizable', descripcion: 'Taza de bambú con tapón hermético, ideal para llevar tu café a cualquier lado.', categoria: 'Físico', costo: 400, imagen: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=400&h=300&fit=crop&auto=format', icono: '🍵', nivelMinimo: 3 },
      { titulo: 'Gorra EcoArcade', descripcion: 'Gorra unisex de algodón reciclado con diseño bordado.', categoria: 'Físico', costo: 500, imagen: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=300&fit=crop&auto=format', icono: '🧢', nivelMinimo: 4 },
      { titulo: 'Set de Popotes de Acero', descripcion: '4 popotes reutilizables con cepillo de limpieza incluido.', categoria: 'Físico', costo: 550, imagen: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop&auto=format', icono: '🥤', nivelMinimo: 4 },
      { titulo: 'Botella de Agua Reutilizable', descripcion: 'Botella de acero inoxidable de 750ml, libre de BPA.', categoria: 'Físico', costo: 650, imagen: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop&auto=format', icono: '💧', nivelMinimo: 5 },
      { titulo: 'Playera EcoArcade', descripcion: 'Playera de algodón orgánico con serigrafía ecológica.', categoria: 'Físico', costo: 700, imagen: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=300&fit=crop&auto=format', icono: '👕', nivelMinimo: 5 },
      { titulo: 'Suscripción 1 Mes a Curso de Jardinería', descripcion: 'Acceso completo a curso online de huertos urbanos y compostaje.', categoria: 'Digital', costo: 750, imagen: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop&auto=format', icono: '🌱', nivelMinimo: 5 },
      { titulo: 'Kit de Compostaje Casero', descripcion: 'Compostera de 10L con lombrices rojas californianas e instructivo.', categoria: 'Físico', costo: 800, imagen: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop&auto=format', icono: '♻️', nivelMinimo: 6 },
      { titulo: 'Descuento 20% en Tienda Eco', descripcion: 'Cupón de descuento válido en tienda de productos sustentables.', categoria: 'Digital', costo: 850, imagen: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop&auto=format', icono: '🏷️', nivelMinimo: 6 },
      { titulo: 'Mochila de Material Reciclado', descripcion: 'Mochila elaborada con PET reciclado, resistente al agua.', categoria: 'Físico', costo: 950, imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&auto=format', icono: '🎒', nivelMinimo: 7 },
      { titulo: 'Termo de Acero Inoxidable', descripcion: 'Mantén tus bebidas frías o calientes y elimina el uso de botellas de plástico.', categoria: 'Físico', costo: 1200, imagen: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop&auto=format', icono: '🧊', nivelMinimo: 9 },
      { titulo: 'Lunch Box Ecológica', descripcion: 'Lonchera de acero inoxidable con compartimentos, libre de plástico.', categoria: 'Físico', costo: 1400, imagen: 'https://images.unsplash.com/photo-1608198093002-ad4e005484c7?w=400&h=300&fit=crop&auto=format', icono: '🍱', nivelMinimo: 10 },
      { titulo: 'Suscripción 3 Meses a Servicio de Streaming', descripcion: 'Código canjeable por 3 meses gratis en plataforma de streaming.', categoria: 'Digital', costo: 1500, imagen: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe70?w=400&h=300&fit=crop&auto=format', icono: '🎬', nivelMinimo: 11 },
      { titulo: 'Audífonos Recargables', descripcion: 'Audífonos inalámbricos con estuche de carga solar.', categoria: 'Físico', costo: 1800, imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format', icono: '🎧', nivelMinimo: 12 },
      { titulo: 'Panel Solar Portátil 20W', descripcion: 'Cargador solar plegable para dispositivos móviles.', categoria: 'Físico', costo: 4000, imagen: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop&auto=format', icono: '☀️', nivelMinimo: 13 },
      { titulo: 'Bicicleta Plegable Urbana', descripcion: 'Bici de aluminio reciclado con 6 velocidades, ideal para la ciudad.', categoria: 'Físico', costo: 5000, imagen: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop&auto=format', icono: '🚲', nivelMinimo: 15 },
    ],
  })
  console.log('✅ Recompensas listas')

  // Tips educativos
  await prisma.tip.deleteMany()
  await prisma.tip.createMany({
    data: [
      // Plástico
      { categoria: 'reciclable', tipo: 'plastico', contenido: 'Una botella de plástico tarda 450 años en degradarse en la naturaleza.' },
      { categoria: 'reciclable', tipo: 'plastico', contenido: 'Reciclar 1 kg de plástico ahorra 2 kg de CO₂ respecto a producirlo desde cero.' },
      { categoria: 'reciclable', tipo: 'plastico', contenido: 'Solo el 9% del plástico producido en el mundo ha sido reciclado alguna vez.' },
      { categoria: 'reciclable', tipo: 'plastico', contenido: 'El plástico llega al océano y se fragmenta en microplásticos que ingieren los peces.' },
      { categoria: 'reciclable', tipo: 'plastico', contenido: 'Con 25 botellas PET recicladas se puede fabricar una sudadera de polar.' },
      // Papel
      { categoria: 'reciclable', tipo: 'papel', contenido: 'Reciclar una tonelada de papel salva 17 árboles y 26,000 litros de agua.' },
      { categoria: 'reciclable', tipo: 'papel', contenido: 'El papel reciclado consume 60% menos energía que fabricarlo desde fibra virgen.' },
      { categoria: 'reciclable', tipo: 'papel', contenido: 'Cada mexicano consume en promedio 54 kg de papel al año.' },
      { categoria: 'reciclable', tipo: 'papel', contenido: 'Las fibras de papel pueden reciclarse hasta 6 veces antes de volverse demasiado cortas.' },
      { categoria: 'reciclable', tipo: 'papel', contenido: 'Reciclar papel evita la tala de millones de árboles y reduce la contaminación del agua.' },
      // Aluminio
      { categoria: 'reciclable', tipo: 'aluminio', contenido: 'Reciclar aluminio consume 95% menos energía que producirlo desde bauxita.' },
      { categoria: 'reciclable', tipo: 'aluminio', contenido: 'Una lata de aluminio reciclada puede volver a ser una lata en tan solo 60 días.' },
      { categoria: 'reciclable', tipo: 'aluminio', contenido: 'El aluminio es reciclable al 100% y sin límite de veces.' },
      { categoria: 'reciclable', tipo: 'aluminio', contenido: 'En México se generan más de 90,000 toneladas de aluminio al año, gran parte termina en basureros.' },
      { categoria: 'reciclable', tipo: 'aluminio', contenido: 'Reciclar 1 kg de aluminio evita emitir 9 kg de CO₂ a la atmósfera.' },
    ],
  })
  console.log('✅ Tips educativos listos')

  console.log('\n🎉 Seed completo! EcoArcade listo.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
