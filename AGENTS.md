# HackTec.26 — Agent Instructions

## ⚠️ CRITICAL
- **NEVER** run `git commit`, `git push`, or any git commit/push command. The developer commits manually.

## Project: EcoArcade
Gamified recycling app. Smart bins (ESP32 + sensors), web app (Route/Ranking/Challenges/Admin views), waste classification via Claude Vision API, XP/level system.

## Stack
- **Backend:** Node.js 20 + TypeScript + Express (in `Back/`)
- **DB:** Prisma ORM + SQLite
- **AI:** Claude API (`claude-sonnet-4-20250514`) for vision classification
- **Docker:** multi-stage build, production + dev compose files
- **Package manager: pnpm** (never npm/yarn)

## Repo structure
- `Back/` — backend (Express app, all code lives here)
- `Front/` — frontend (empty placeholder)
- `README.md` — minimal title

## Key commands (order matters)
```bash
pnpm install                           # install deps
cp .env.example .env                   # then edit .env (ANTHROPIC_API_KEY, ESP32_URL)
pnpm db:migrate                        # create DB + schema
pnpm db:seed                           # load demo data
pnpm dev                               # start dev server (ts-node-dev --respawn)
pnpm build                             # tsc compile
pnpm start                             # run compiled dist/
pnpm db:studio                         # Prisma Studio GUI
pnpm db:reset                          # drop, re-migrate, reseed
```

### Docker
```bash
pnpm docker:dev                        # hot-reload dev container
pnpm docker:prod                       # production build
pnpm docker:logs                       # tail logs
```

## Quirks & gotchas
- **ESP32 is optional.** If `ESP32_URL` is unset in `.env`, the system works in demo mode.
- **Claude API fallback.** If the API call fails, `classifyOffline()` auto-fallbacks (keyword-based, lower confidence).
- **SQLite:** `dev.db` created on migrate. With Docker, persists in `./data/` outside container.
- **Express JSON limit:** `15mb` (for base64 images). Body size matters.
- All code in `Back/`, routes under `src/routes/`, lib under `src/lib/`, Prisma schema in `prisma/`.

## App entrypoint
`Back/src/index.ts` — Express app, mounts routers at `/api/v1/*`, health check at `GET /health`.

## Auth
- JWT via `jsonwebtoken` + `bcryptjs`. Token expira en 7d.
- Middleware `src/middleware/auth.ts` — extrae token del header `Authorization: Bearer <token>`, inyecta `req.userId` y `req.roleId`.
- Usuarios demo: `mauro@eco.com` (admin), `ana@eco.com` etc. Pass: `demo123`.

## RBAC (Role-Based Access Control)
- **Modelo `Role`** — admin (acceso total), user (regular).
- **Modelo `Permiso`** — asociado a un rol. Admin tiene `ver_admin_panel`, `crear_basurero`, `crear_reto`. User tiene `depositar`, `escanear_qr`, `ver_ranking`.
- **Middleware `requirePermiso('nombre')`** — verifica JWT + permiso en DB. Si no tiene → `403 Forbidden`.
- Login devuelve `rol: { id, nombre }` + `permisos: [...]`.

## Endpoints extra
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/v1/auth/login | No | Login email+password → JWT + user con rol + permisos |
| GET | /api/v1/auth/me | Sí | Verificar sesión, devuelve user + rol + permisos |
| GET | /api/v1/scan?botId=X | Sí | QR scan, 401 si no hay sesión, 200 con user+bot |
| POST | /api/v1/bins/deposit | Sí | Depositar residuo, 422 si mismatch de tipo |
| GET | /api/v1/stats/admin | `ver_admin_panel` | Panel admin — solo admin |
| POST | /api/v1/basureros | `crear_basurero` | Crear basurero — solo admin |
| POST | /api/v1/retos | `crear_reto` | Crear reto — solo admin |

## Full reference
Detailed file-by-file instructions live at:
`C:\Users\mauro\Downloads\OPENCODE_INSTRUCCIONES.md`
