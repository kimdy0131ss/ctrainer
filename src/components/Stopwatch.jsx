import { useState, useRef, useEffect } from 'react'

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const startRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (running) {
      startRef.current = Date.now() - elapsed
      const tick = () => {
        setElapsed(Date.now() - startRef.current)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      cancelAnimationFrame(rafRef.current)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [running])

  function reset() {
    setRunning(false)
    setElapsed(0)
    setLaps([])
  }

  function lap() {
    setLaps(prev => [...prev, elapsed])
  }

  function format(ms) {
    const min = String(Math.floor(ms / 60000)).padStart(2, '0')
    const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')
    const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, '0')
    return `${min}:${sec}.${cs}`
  }

  return (
    <div className="feature-card">
      <h2>스톱워치</h2>
      <div className="stopwatch-display">{format(elapsed)}</div>
      <div className="stopwatch-btns">
        <button className="btn-primary" onClick={() => setRunning(r => !r)}>
          {running ? '정지' : '시작'}
        </button>
        <button className="btn-secondary" onClick={lap} disabled={!running}>랩</button>
        <button className="btn-secondary" onClick={reset}>초기화</button>
      </div>
      {laps.length > 0 && (
        <ul className="lap-list">
          {laps.map((t, i) => (
            <li key={i} className="lap-item">
              <span className="lap-num">랩 {i + 1}</span>
              <span className="lap-time">{format(t)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
