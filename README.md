# ♻️ EcoArcade

Gamified recycling app. Smart bins (ESP32 + sensors), waste classification via Claude Vision AI, XP/level system with rewards.

## Project structure

```
EcoArcade/
├── Back/     → Express API + Prisma + SQLite
├── Front/    → Next.js 15 + Tailwind CSS
├── AGENTS.md → Instrucciones para agente opencode
└── README.md
```

## How to run

Each subproject has its own README with full setup instructions:

- **[Back/README.md](./Back/README.md)** — backend API setup, environment variables, Docker, seed data, API endpoints, points/XP system
- **[Front/README.md](./Front/README.md)** — frontend setup, pages, components, auth context

Quick start:

```bash
# 1. Backend (terminal 1)
cd Back
pnpm install
cp .env.example .env    # fill ANTHROPIC_API_KEY
pnpm db:migrate
pnpm db:seed
pnpm dev                # → http://localhost:3001

# 2. Frontend (terminal 2)
cd Front
pnpm install
pnpm dev                # → http://localhost:3000
```

Login with `mauro@eco.com` / `demo123`.

## Contributors

| | |
|---|---|
| **Ruiz-z** (Mauro Ruiz) | Developer — arquitectura, lógica de negocio, integración ESP32, sistemas de gamificación |
| **Claude** (Anthropic) | AI assistant — generación de código, refactorización, debugging, y soporte en tiempo real durante el desarrollo |
| **Oz Agent** (OpenCode) | AI agent — ejecución autónoma de tareas repetitivas, refactors masivos, y commits rápidos para optimizar tiempos de entrega |

> Claude y Oz Agent se utilizaron como herramientas de apoyo para lluvia de ideas, generación de boilerplate, debugging acelerado, y ejecución de commits frecuentes durante el sprint, permitiendo iterar rápido y mantener el ritmo de desarrollo dentro del hackathon.
