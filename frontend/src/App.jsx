import { useEffect, useMemo, useState } from 'react'
import io from 'socket.io-client'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function App() {
  const [connecting, setConnecting] = useState(true)
  const [status, setStatus] = useState('')
  const [balance, setBalance] = useState(100)
  const [spinResult, setSpinResult] = useState(null)
  const [spinning, setSpinning] = useState(false)

  const socket = useMemo(() => io(API_BASE, { transports: ['websocket'] }), [])

  useEffect(() => {
    socket.on('connect', () => {
      setStatus('Connected to game server ✅')
      setConnecting(false)
    })
    socket.on('disconnect', () => {
      setStatus('Disconnected ❌')
      setConnecting(false)
    })
    socket.on('spin:result', ({ outcome, delta }) => {
      setSpinResult({ outcome, delta })
      setBalance((b) => b + delta)
      setSpinning(false)
    })
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('spin:result')
      socket.close()
    }
  }, [socket])

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    setSpinResult(null)
    socket.emit('spin:play', { bet: 5 })
  }

  const pingBackend = async () => {
    try {
      const res = await axios.get(API_BASE + '/api/health')
      alert('Backend says: ' + res.data.status)
    } catch (e) {
      alert('Backend not reachable')
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">⭐ StarWinCasino (Free Starter)</h1>
        <button className="btn" onClick={pingBackend}>Check Backend</button>
      </header>

      <div className="grid gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Connection</h2>
          <p className="opacity-80">{connecting ? 'Connecting…' : status}</p>
          <p className="mt-2 text-sm opacity-70">API: {API_BASE}</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">🎰 Spin Wheel (Demo)</h2>
          <p className="opacity-80 mb-4">Balance: <b>{balance}</b> Star tokens</p>
          <button className="btn" onClick={spin} disabled={spinning}>
            {spinning ? 'Spinning…' : 'Spin (Bet 5)'}
          </button>
          {spinResult && (
            <p className="mt-4">
              Result: <b>{spinResult.outcome}</b> ({spinResult.delta > 0 ? '+' : ''}{spinResult.delta})
            </p>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Next Steps</h2>
          <ul className="list-disc ml-5 opacity-90">
            <li>Add login (Firebase Auth)</li>
            <li>Wire tokens to Firestore</li>
            <li>Add Teen Patti / Ludo rooms</li>
            <li>Connect crypto payments (NowPayments)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
