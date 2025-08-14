import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 4000
const ORIGIN = process.env.CORS_ORIGIN || '*'

const app = express()
app.use(cors({ origin: ORIGIN }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'OK', time: new Date().toISOString() })
})

// In-memory balances (demo only)
const balances = new Map()

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: ORIGIN, methods: ['GET','POST'] }
})

io.on('connection', (socket) => {
  const id = socket.id
  if (!balances.has(id)) balances.set(id, 100)

  socket.on('spin:play', ({ bet = 5 } = {}) => {
    const bal = balances.get(id) ?? 100
    if (bal < bet) {
      socket.emit('spin:result', { outcome: 'Insufficient balance', delta: 0 })
      return
    }
    // Simple odds: 45% lose, 40% small win (+5), 10% big win (+20), 5% jackpot (+50)
    const r = Math.random()
    let delta = -bet
    let outcome = 'Lose'
    if (r > 0.55 && r <= 0.95) { delta = +5; outcome = 'Small Win' }
    else if (r > 0.95 && r <= 0.99) { delta = +20; outcome = 'Big Win' }
    else if (r > 0.99) { delta = +50; outcome = 'JACKPOT!' }

    const newBal = bal + delta
    balances.set(id, newBal)
    socket.emit('spin:result', { outcome, delta })
  })

  socket.on('disconnect', () => {
    balances.delete(id)
  })
})

server.listen(PORT, () => {
  console.log(`StarWinCasino backend running on :${PORT}`)
})
