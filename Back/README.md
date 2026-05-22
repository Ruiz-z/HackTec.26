# EcoArcade — Backend

Backend del sistema de reciclaje gamificado EcoArcade. Proporciona API REST para autenticación, clasificación de residuos por IA (Claude Vision), ranking, retos, y monitoreo de basureros inteligentes ESP32.

## Stack

- **Runtime:** Node.js 20 + TypeScript
- **Framework:** Express
- **ORM:** Prisma + SQLite
- **AI:** Anthropic Claude API (`claude-sonnet-4-20250514`) con fallback offline
- **Auth:** JWT + bcryptjs
- **Docker:** multi-stage, Alpine 3.20

## Requisitos

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- (Opcional) Docker + Docker Compose
- (Opcional) Cuenta Anthropic para API key

## Variables de entorno

Copiar `.env.example` a `.env` y editar:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="cambiar-esto-en-produccion"
ANTHROPIC_API_KEY="sk-ant-..."        # Opcional, fallback offline sin esto
ESP32_URL="http://192.168.1.100"       # Opcional, funciona en demo sin esto
PORT=3001
```

## Inicio rápido (local)

```bash
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Servidor en `http://localhost:3001`.

## Docker

```bash
# Desarrollo (hot-reload)
pnpm docker:dev

# Producción
pnpm docker:prod

# Logs
pnpm docker:logs
```

Los comandos Docker están definidos en `package.json`.

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor con hot-reload (ts-node-dev) |
| `pnpm build` | Compilar TypeScript a `dist/` |
| `pnpm start` | Ejecutar `dist/index.js` |
| `pnpm db:migrate` | Crear/actualizar esquema SQLite |
| `pnpm db:seed` | Cargar datos demo |
| `pnpm db:studio` | Abrir Prisma Studio (GUI DB) |
| `pnpm db:reset` | Borrar DB, re-migrar, re-seed |

## Usuarios demo

| Email | Contraseña | Rol |
|-------|-----------|-----|
| mauro@eco.com | demo123 | admin |
| ana@eco.com | demo123 | user |
| luis@eco.com | demo123 | user |
| sara@eco.com | demo123 | user |
| carlos@eco.com | demo123 | user |

## API

Todas las rutas bajo `/api/v1/`. Autenticación via `Authorization: Bearer <token>`.

### Endpoints principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /auth/login | No | Login email+password |
| GET | /auth/me | Sí | Verificar sesión |
| GET | /scan?botId=X | Sí | Escanear QR de basurero |
| POST | /bins/deposit | Sí | Depositar residuo |
| POST | /classify | No | Clasificar imagen (IA) |
| GET | /classify/recientes | No | Últimas clasificaciones |
| GET | /users/ranking | No | Top 10 por XP |
| GET | /users/:id | No | Perfil + historial |
| GET | /basureros | No | Todos los basureros |
| GET | /basureros/:id | No | Detalle + últimos scans |
| POST | /basureros | `crear_basurero` | Crear basurero (admin) |
| GET | /retos | No | Retos activos |
| GET | /retos/usuario/:userId | No | Retos + progreso del usuario |
| POST | /retos | `crear_reto` | Crear reto (admin) |
| GET | /stats | No | Dashboard público |
| GET | /stats/admin | `ver_admin_panel` | Dashboard admin |
| GET | /stats/impacto | No | Impacto ambiental |
| GET | /health | No | Health check |
| GET | /esp32/health | No | Estado del ESP32 |

## Estructura del proyecto

```
Back/
├── prisma/
│   ├── schema.prisma      # Modelos de datos
│   ├── seed.ts            # Datos demo
│   └── migrations/        # Migraciones SQLite
├── src/
│   ├── index.ts           # Entry point Express
│   ├── lib/
│   │   ├── prisma.ts      # Cliente Prisma
│   │   └── claude.ts      # Clasificación IA + fallback
│   ├── middleware/
│   │   └── auth.ts        # requireAuth + requirePermiso
│   └── routes/
│       ├── auth.ts        # Login, sesión
│       ├── scan.ts        # QR scan
│       ├── bins.ts        # Depósito de residuos
│       ├── classify.ts    # Clasificación de imágenes
│       ├── users.ts       # Ranking, perfiles
│       ├── basureros.ts   # CRUD basureros
│       ├── retos.ts       # Retos y progreso
│       ├── stats.ts       # Estadísticas
│       └── esp32.ts       # Proxy ESP32
├── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
├── package.json
├── tsconfig.json
├── .env.example
└── .dockerignore
```

## Base de datos

SQLite local. Se puede inspeccionar con:

```bash
pnpm db:studio
```

O directamente con cualquier cliente SQLite en `prisma/dev.db`.
