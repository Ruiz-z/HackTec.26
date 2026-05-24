# ♻️ EcoArcade

Gamified recycling app. Smart bins (ESP32 + sensors), waste classification via Claude Vision AI, XP/level system with rewards.

## ¿Qué es EcoArcade?

EcoArcade es una plataforma gamificada de reciclaje que convierte la separación de residuos en una experiencia interactiva. Los usuarios depositan sus residuos en **basureros inteligentes equipados con ESP32**, el sistema **fotografía y clasifica automáticamente** el material usando **Claude Vision AI** (plástico, papel o aluminio), y otorga **puntos y experiencia (XP)** en tiempo real.

### Cómo funciona

1. **Registro** — El usuario se registra vía app o RFID
2. **Depósito** — Escanea el QR del basurero, deposita el residuo
3. **Clasificación IA** — Una foto del residuo se envía a Claude Vision API → identifica el material
4. **Recompensa** — El usuario gana puntos (canjeables por premios) y XP (sube de nivel)
5. **Progreso** — Retos semanales, ranking global, estadísticas de impacto ambiental

### Sistema de gamificación

- **6 niveles** (Principiante → Maestro Eco) con multiplicador de puntaje
- **Retos** progresivos (reciclar X residuos, explorar basureros, reciclar materiales específicos)
- **Tienda de recompensas** con 20 premios físicos y digitales (150 – 5000 pts)
- **Ranking** competitivo top 10

### Hardware

Los basureros inteligentes usan **ESP32** con sensores de nivel de llenado y compuerta automatizada. El sistema se comunica con ellos via HTTP para abrir compuertas y activar el clasificador según el material detectado.

### Stack técnico

| Capa | Tecnología |
|---|---|
| Backend | Node.js 20 + Express + TypeScript |
| Base de datos | Prisma ORM + SQLite |
| Frontend | Next.js 15 + Tailwind CSS + Framer Motion |
| IA | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Hardware | ESP32 (HTTP), sensores ultrasónicos |
| Auth | JWT + bcrypt + Resend (emails) |

> Proyecto desarrollado para **HackTec.26** — solución que combina tecnología, educación ambiental y gamificación para aumentar la tasa de reciclaje en comunidades urbanas.

## Diseño

El diseño de la interfaz fue creado en **Stitch**, una herramienta de diseño colaborativo. Las maquetas se utilizaron como base para desarrollar el frontend de EcoArcade, sirviendo como guía visual para la estructura de cada pantalla, paleta de colores, tipografía, y componentes.

> *(Las capturas fueron exportadas desde Stitch y están organizadas por pantalla a continuación)*

### Pantalla de inicio de sesión
![Login](URL_DE_TU_IMAGEN)

### Home / Dashboard
![Home](URL_DE_TU_IMAGEN)

### Clasificador de residuos
![Escaneo](URL_DE_TU_IMAGEN)

### Ruta de basureros
![Ruta](URL_DE_TU_IMAGEN)

### Retos activos
![Retos](URL_DE_TU_IMAGEN)

### Tienda de recompensas
![Recompensas](URL_DE_TU_IMAGEN)

### Ranking global
![Ranking](URL_DE_TU_IMAGEN)

### Insights / Estadísticas
![Insights](URL_DE_TU_IMAGEN)

### Administración
![Admin](URL_DE_TU_IMAGEN)

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
