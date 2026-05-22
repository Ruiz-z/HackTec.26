import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import classifyRouter  from './routes/classify'
import usersRouter     from './routes/users'
import statsRouter     from './routes/stats'
import esp32Router     from './routes/esp32'
import basurerosRouter from './routes/basureros'
import retosRouter     from './routes/retos'
import authRouter      from './routes/auth'
import scanRouter      from './routes/scan'
import binsRouter      from './routes/bins'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ extended: true }))

app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
  next()
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'EcoArcade Backend', version: '2.0.0', timestamp: new Date().toISOString() })
})

app.use('/api/v1/classify',  classifyRouter)
app.use('/api/v1/users',     usersRouter)
app.use('/api/v1/stats',     statsRouter)
app.use('/api/v1/esp32',     esp32Router)
app.use('/api/v1/basureros', basurerosRouter)
app.use('/api/v1/retos',     retosRouter)
app.use('/api/v1/auth',      authRouter)
app.use('/api/v1/scan',      scanRouter)
app.use('/api/v1/bins',      binsRouter)

app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }))

app.listen(PORT, () => {
  console.log(`Back API funcionando correctamente: http://localhost:${PORT}`)
})
