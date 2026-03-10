import 'dotenv/config'
import http from 'http'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import { BusinessEventEngine } from './engine/eventEngine.js'
import { createApiRouter } from './routes/api.js'

const PORT = Number(process.env.PORT || 4000)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/opspulse'
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*'

const app = express()
app.use(cors({ origin: CLIENT_ORIGIN === '*' ? true : CLIENT_ORIGIN }))
app.use(express.json())

const engine = new BusinessEventEngine()
app.use('/api', createApiRouter(engine))

app.get('/health', (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
})

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: CLIENT_ORIGIN === '*' ? true : CLIENT_ORIGIN },
})

io.on('connection', (socket) => {
  const snapshot = engine.snapshot()
  socket.emit('updatedMetrics', { metrics: snapshot.metrics, prediction: snapshot.prediction })
  socket.emit('updatedStressScore', {
    stressScore: snapshot.stressScore,
    stressFactors: snapshot.stressFactors,
  })
  socket.emit('alerts', snapshot.alerts.slice(0, 20))

  snapshot.events.slice(0, 20).reverse().forEach((event) => socket.emit('newEvent', event))
})

engine.on('event', ({ event, metrics, stressScore, stressFactors, alerts, prediction }) => {
  io.emit('newEvent', event)
  io.emit('updatedMetrics', { metrics, prediction })
  io.emit('updatedStressScore', { stressScore, stressFactors })
  io.emit('alerts', alerts.slice(0, 20))
})

async function start() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('[server] MongoDB connected')
  } catch (error) {
    console.warn('[server] MongoDB unavailable, running in stream-only mode:', error.message)
  }

  engine.start()

  server.listen(PORT, () => {
    console.log(`[server] OpsPulse backend running on http://localhost:${PORT}`)
  })
}

start()
