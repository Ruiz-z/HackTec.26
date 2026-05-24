# EcoArcade — Frontend

Frontend gamificado de reciclaje EcoArcade. Aplicación Next.js 15 con Tailwind CSS, animaciones Framer Motion, y autenticación JWT.

## Stack

- **Framework:** Next.js 15.5 (App Router)
- **UI:** Tailwind CSS 3.4 + lucide-react (iconos)
- **Animaciones:** Framer Motion 12
- **Lenguaje:** TypeScript 5.7
- **Package manager:** pnpm 9.12.0

## Requisitos

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Backend EcoArcade corriendo en `http://localhost:3001`

## Inicio rápido

```bash
pnpm install
pnpm dev
```

Servidor en `http://localhost:3000`. El backend debe estar corriendo en `http://localhost:3001`.

## Comandos

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo (hot-reload) |
| `pnpm build` | Build de producción + typecheck |
| `pnpm start` | Ejecutar build de producción |
| `pnpm lint` | Linter Next.js |

## Rutas

### Dashboard (con Sidebar)

| Ruta | Descripción | API |
|------|-------------|-----|
| `/home` | Resumen del usuario (nivel, XP, puntos, progreso) | `useAuth()` |
| `/escaneo` | Clasificador de residuos con cámara en vivo | `POST /classify` |
| `/ruta` | Mapa de basureros disponibles | `GET /basureros` |
| `/ranking` | Top 10 por XP acumulado | `GET /users/ranking` |
| `/retos` | Retos activos con progreso | `GET /retos/usuario/:userId` |
| `/recompensas` | Catálogo de recompensas y canje | `GET /recompensas`, `POST /canjear/:id` |
| `/admin` | Panel de administración | `GET /stats/admin` |
| `/insights` | Estadísticas globales e impacto ambiental | `GET /stats`, `GET /stats/impacto` |
| `/juego` | Minijuego educativo | — |

### Standalone (sin sidebar)

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page (redirect a `/login`) |
| `/login` | Inicio de sesión |
| `/forgot-password` | Recuperación de contraseña |
| `/reset-password` | Resetear contraseña con token |

## Estructura

```
Front/
├── app/
│   ├── layout.tsx               # Root layout (Inter font + AuthProvider)
│   ├── globals.css              # Tailwind directives
│   ├── page.tsx                 # Landing (redirect → /login)
│   ├── (dashboard)/
│   │   ├── layout.tsx           # Dashboard layout (Sidebar wrapper)
│   │   ├── home/page.tsx
│   │   ├── escaneo/page.tsx
│   │   ├── ruta/page.tsx
│   │   ├── ranking/page.tsx
│   │   ├── retos/page.tsx
│   │   ├── recompensas/page.tsx
│   │   ├── admin/page.tsx
│   │   ├── insights/page.tsx
│   │   └── juego/page.tsx
│   ├── login/page.tsx
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx
├── components/
│   ├── Sidebar.tsx              # Navegación lateral
│   ├── CardBase.tsx             # Sistema de cards reutilizables
│   ├── HeaderVista.tsx          # Encabezado de página con XP
│   ├── escaneo/
│   │   ├── ModalTipScan.tsx     # Modal post-clasificación
│   │   ├── VisorCamara.tsx      # Cámara placeholder (demo)
│   │   └── VisorCamaraReal.tsx  # Cámara real con html5-qrcode
│   ├── retos/
│   │   └── CardReto.tsx         # Card de reto con progreso
│   ├── insights/
│   │   └── SimuladorClasificacion.tsx
│   └── ruta/
│       └── MapaBasureros.tsx    # Mapa de basureros
├── lib/
│   ├── api.ts                   # Cliente API (14 métodos)
│   └── auth-context.tsx         # AuthProvider + useAuth + refreshUser
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Auth Context

El `AuthProvider` envuelve la app y expone via `useAuth()`:

```ts
const { user, token, loading, login, logout, refreshUser } = useAuth()
```

- `user`: `{ id, nombre, email, nivel, nivelNum, xp, puntos, rol, permisos }`
- `token`: JWT almacenado en localStorage
- `refreshUser()`: re-fetch de `GET /me` (útil después de clasificar o canjear)

## API Client

Todas las llamadas al backend pasan por `lib/api.ts`. Base URL: `http://localhost:3001/api/v1`.

## Notas

- Las imágenes de recompensas usan Unsplash con fallback visual (gradiente + emoji)
- Las páginas del dashboard se recargan al enfocar la pestaña (evento `focus`)
- El balance de puntos se actualiza automáticamente tras canjear (`refreshUser()`)
- XP y nivel se refrescan tras cada clasificación exitosa
