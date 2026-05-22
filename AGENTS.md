# HackTec.26 — Agent Instructions

## ⚠️ CRITICAL
- **NEVER** run `git commit`, `git push`, or any git push/commit command. The developer commits manually.

## Project: EcoArcade
Gamified recycling app. Smart bins (ESP32 + sensors), waste classification via Claude Vision API, XP/level system.

## Stack
- **Backend:** Node.js 20 + TypeScript + Express (all code in `Back/`)
- **DB:** Prisma ORM + SQLite
- **AI:** Claude API (`claude-sonnet-4-20250514`) for vision classification
- **Docker:** multi-stage build, dev + prod compose files
- **Package manager: pnpm** (never npm/yarn). Specified in `package.json` as `pnpm@9.12.0`.

## Repo structure
- `Back/` — Express app (entrypoint `src/index.ts`, routes in `src/routes/`, lib in `src/lib/`, Prisma schema in `prisma/`)
- `Front/` — empty placeholder
- No tests, no linter, no typecheck configured.

## Commands (order matters)
```bash
pnpm install               # install deps (run from Back/)
cp .env.example .env       # fill ANTHROPIC_API_KEY, ESP32_URL optional
pnpm db:migrate            # initial migrate: prisma migrate dev --name init
pnpm db:seed               # ts-node prisma/seed.ts
pnpm dev                   # ts-node-dev --respawn --transpile-only src/index.ts
pnpm build                 # tsc -> dist/
pnpm start                 # node dist/index.js
pnpm db:studio             # Prisma Studio GUI
pnpm db:reset              # drop + re-migrate + reseed (use this if schema changes)
```

### Docker (run from Back/)
```bash
pnpm docker:dev            # docker compose -f docker-compose.dev.yml up --build
pnpm docker:prod           # docker compose up --build
pnpm docker:logs           # docker compose logs -f
```

## Quirks & gotchas
- **ESP32 optional.** If `ESP32_URL` unset, system works in demo mode (no ESP32 calls).
- **Claude API fallback.** If API fails, `classifyOffline()` auto-fallbacks (keyword-based, lower confidence, `confianza: 0`).
- **SQLite:** `dev.db` created on migrate. Docker persists in `./data/` outside container.
- **Express JSON limit:** `15mb` (for base64 images).
- **`db:migrate` uses `--name init`** — will fail on second run (migration name `init` already exists). Use `db:reset` for schema changes.
- **`calcularNivel()` duplicated** in both `routes/classify.ts:118` and `routes/bins.ts:118` — refactor if modifying both.
- **`classify` POST is unauthenticated** — unlike `bins/deposit` which requires auth + middleware.
- **`seed.js`** is a stale compiled artifact; the real seed source is `seed.ts`.
- **Prisma binary targets** include `linux-musl-openssl-3.0.x` for Docker compatibility.

## Auth & RBAC
- JWT via `jsonwebtoken` + `bcryptjs`. Token expires in 7d.
- Middleware `auth.ts`: extracts `Authorization: Bearer <token>`, injects `req.userId` + `req.roleId`.
- `requirePermiso('nombre')` — checks JWT + DB permission. Returns `403 Forbidden` if missing.
- Demo users: `mauro@eco.com` (admin), `ana@eco.com` etc. Pass: `demo123`.
- Roles: `admin` (permisos: `ver_admin_panel`, `crear_basurero`, `crear_reto`), `user` (permisos: `depositar`, `escanear_qr`, `ver_ranking`).

## API endpoints

| Método | Ruta | Auth | Description |
|--------|------|------|-------------|
| POST | /api/v1/auth/login | No | Login → JWT + user with rol + permisos |
| GET | /api/v1/auth/me | `requireAuth` | Verify session |
| POST | /api/v1/classify | No | Classify image (base64) or offlineKeyword. Creates scan, updates user XP/bot level |
| GET | /api/v1/classify/recientes | No | Last 20 scans with user + basurero |
| GET | /api/v1/scan?botId=X | `requireAuth` | QR scan: validate user + bot existence |
| POST | /api/v1/bins/deposit | `requireAuth` | Deposit waste. 422 if type mismatch |
| GET | /api/v1/basureros | No | All bins with last event |
| GET | /api/v1/basureros/:id | No | Single bin with last 20 scans |
| PATCH | /api/v1/basureros/:id/nivel | No | ESP32 updates fill level |
| PATCH | /api/v1/basureros/codigo/:codigo/nivel | No | Same, by codigo (B1, B2...) |
| POST | /api/v1/basureros | `crear_basurero` | Create bin — admin only |
| GET | /api/v1/retos | No | Active challenges |
| GET | /api/v1/retos/usuario/:userId | No | Challenges with user progress |
| POST | /api/v1/retos | `crear_reto` | Create challenge — admin only |
| GET | /api/v1/users/ranking | No | Top 10 by XP |
| GET | /api/v1/users/rfid/:rfid | No | Lookup user by RFID |
| GET | /api/v1/users/:id | No | User with last 20 scans |
| POST | /api/v1/users | No | Register user (rfid, nombre, email, password) |
| GET | /api/v1/stats | No | Global stats (today scans, ranking, CO2 avoided) |
| GET | /api/v1/stats/admin | `ver_admin_panel` | Admin dashboard — admin only |
| GET | /api/v1/stats/impacto | No | Environmental impact summary |
| POST | /api/v1/esp32/comando | No | Proxy command to ESP32 |
| GET | /api/v1/esp32/health | No | ESP32 health check |
| GET | /health | No | App health check |
