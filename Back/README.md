# EcoArcade — Backend

Backend del sistema de reciclaje gamificado EcoArcade. API REST para autenticación, clasificación de residuos por IA (Claude Vision), ranking, retos, sistema de recompensas, y monitoreo de basureros inteligentes ESP32.

## Stack

- **Runtime:** Node.js 20 + TypeScript
- **Framework:** Express
- **ORM:** Prisma + SQLite
- **AI:** Anthropic Claude API (`claude-sonnet-4-20250514`) con fallback offline
- **Auth:** JWT + bcryptjs (expira 7d)
- **Email:** Resend (para recuperación de contraseña)
- **Docker:** multi-stage, Alpine 3.20

## Requisitos

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- (Opcional) Docker + Docker Compose
- (Opcional) Cuenta Anthropic para API key
- (Opcional) Cuenta Resend para emails

## Variables de entorno

Copiar `.env.example` a `.env` y editar:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="cambiar-esto-en-produccion"
ANTHROPIC_API_KEY="sk-ant-..."           # Opcional, fallback offline sin esto
ESP32_DOOR_URL="http://172.20.10.3"      # Opcional, funciona en demo sin esto
ESP32_SORTER_URL="http://172.20.10.2"    # Opcional, funciona en demo sin esto
RESEND_API_KEY="re_..."                  # Opcional, sin esto no envía emails
FROM_EMAIL="noreply@ecoarcade.com"       # Remitente para correos
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

### Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /auth/login | No | Login email+password → JWT + user + permisos |
| GET | /auth/me | `requireAuth` | Verificar sesión |
| POST | /auth/forgot-password | No | Enviar email con link de recuperación |
| POST | /auth/reset-password | No | Resetear contraseña con token |
| POST | /classify | No | Clasificar imagen (base64) o keyword offline |
| GET | /classify/recientes | No | Últimas 20 clasificaciones |
| GET | /scan?botId=X | `requireAuth` | Validar QR de basurero |
| POST | /bins/deposit | `requireAuth` | Depositar residuo (valida tipo) |
| GET | /basureros | No | Todos los basureros con último evento |
| GET | /basureros/:id | No | Detalle + últimos 20 scans |
| PATCH | /basureros/:id/nivel | No | ESP32 actualiza nivel de llenado |
| PATCH | /basureros/codigo/:codigo/nivel | No | Idem por código (B1, B2…) |
| POST | /basureros | `crear_basurero` | Crear basurero (admin) |
| GET | /retos | No | Retos activos |
| GET | /retos/usuario/:userId | No | Retos + progreso del usuario |
| POST | /retos | `crear_reto` | Crear reto (admin) |
| GET | /users/ranking | No | Top 10 por XP |
| GET | /users/rfid/:rfid | No | Buscar usuario por RFID |
| GET | /users/:id | No | Perfil + últimos 20 scans |
| POST | /users | No | Registrar usuario |
| GET | /recompensas | No | Catálogo de recompensas disponibles |
| GET | /recompensas/mis-canjes | `requireAuth` | Historial de canjes del usuario |
| POST | /recompensas/canjear/:id | `requireAuth` | Canjear recompensa (descuenta puntos) |
| GET | /stats | No | Dashboard público (scans hoy, CO₂, ranking) |
| GET | /stats/admin | `ver_admin_panel` | Dashboard admin |
| GET | /stats/impacto | No | Resumen impacto ambiental |
| GET | /esp32/comando | No | Enviar comando al ESP32 |
| GET | /esp32/health | No | Health check del ESP32 |
| GET | /health | No | Health check |

### Sistema de puntos y XP

| Material | Puntos base | XP base |
|----------|------------|---------|
| ♻️ Plástico | 8 | 12 |
| 📄 Papel | 10 | 15 |
| 🥫 Aluminio | 12 | 18 |

Multiplicador según nivel del usuario (×1.0 → ×1.5). Configurable en `src/lib/nivel.ts`.

### Niveles

| Nivel | Nombre | Multiplicador | XP acumulado |
|-------|--------|--------------|--------------|
| 1 | Eco Principiante | ×1.0 | 0 |
| 2 | Novato | ×1.1 | 100 |
| 3 | Aprendiz | ×1.2 | 300 |
| 4 | Guardián | ×1.3 | 700 |
| 5 | Pro | ×1.4 | 1200 |
| 6 | Maestro Eco | ×1.5 | 2000 |

### Roles y permisos

- `admin`: `ver_admin_panel`, `crear_basurero`, `crear_reto`
- `user`: `depositar`, `escanear_qr`, `ver_ranking`

Middleware `requirePermiso('nombre')` chequea JWT + DB. Retorna 403 si falta.

## Estructura del proyecto

```
Back/
├── prisma/
│   ├── schema.prisma      # Modelos de datos (User, Basurero, Scan,
│   │                      #   Reto, ProgresoReto, Recompensa, Canje, Tip)
│   ├── seed.ts            # Datos demo (5 usuarios, 5 basureros,
│   │                      #   6 retos, 20 recompensas, tips educativos)
│   └── migrations/        # Migraciones SQLite
├── src/
│   ├── index.ts           # Entry point Express (puerto 3001, JSON 15mb)
│   ├── lib/
│   │   ├── prisma.ts      # Cliente Prisma singleton
│   │   ├── claude.ts      # Clasificación IA Claude + fallback offline
│   │   ├── nivel.ts       # calcularNivel() + MATERIAL_REWARDS compartido
│   │   └── email.ts       # Envío de emails via Resend
│   ├── middleware/
│   │   └── auth.ts        # requireAuth + requirePermiso
│   └── routes/
│       ├── auth.ts        # Login, registro, sesión, forgot/reset password
│       ├── scan.ts        # QR scan
│       ├── bins.ts        # Depósito de residuos
│       ├── classify.ts    # Clasificación de imágenes (IA + offline)
│       ├── users.ts       # Ranking, perfiles, RFID lookup
│       ├── basureros.ts   # CRUD basureros + nivel ESP32
│       ├── retos.ts       # Retos y progreso del usuario
│       ├── recompensas.ts # Canje de recompensas
│       ├── stats.ts       # Estadísticas públicas y admin
│       └── esp32.ts       # Proxy de comandos al ESP32
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

## ESP32

- **ESP32_DOOR_URL** (`172.20.10.3`): controla la puerta del basurero
- **ESP32_SORTER_URL** (`172.20.10.2`): clasificador/separador de residuos
- `MAPA_TIPO_ESP32` en `classify.ts` y `bins.ts` mapea `plastico → /plastico`, `papel → /papel`, `aluminio → /aluminio`
- Sin ESP32_URL el sistema funciona en modo demo

## Notas

- Express JSON limit: 15mb (para base64 de imágenes)
- `db:migrate` usa `--name init` — falla en segunda corrida. Usar `db:reset` para cambios de schema
- `classify` POST es **no autenticado** (a diferencia de `bins/deposit` que requiere auth)
- Si la API de Claude falla, `classifyOffline()` hace fallback por keywords
- `calcularNivel()` está en `src/lib/nivel.ts` (compartido entre classify.ts y bins.ts)
