import { useState } from 'react'

function randomHex() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')
}

function generatePalette() {
  return Array.from({ length: 5 }, randomHex)
}

function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

export default function ColorPalette() {
  const [palette, setPalette] = useState(generatePalette)
  const [copied, setCopied] = useState(null)
  const [locked, setLocked] = useState([false, false, false, false, false])

  function regenerate() {
    setPalette(prev => prev.map((c, i) => locked[i] ? c : randomHex()))
  }

  function toggleLock(i) {
    setLocked(prev => prev.map((l, idx) => idx === i ? !l : l))
  }

  function copyColor(hex, i) {
    navigator.clipboard.writeText(hex)
    setCopied(i)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="feature-card">
      <h2>색상 팔레트 생성기</h2>
      <p className="feature-desc">자물쇠를 클릭해 색상을 고정할 수 있어요</p>
      <div className="palette">
        {palette.map((color, i) => (
          <div key={i} className="color-swatch" style={{ background: color }}>
            <button
              className="lock-btn"
              style={{ color: isLight(color) ? '#000' : '#fff' }}
              onClick={() => toggleLock(i)}
              title={locked[i] ? '고정 해제' : '고정'}
            >
              {locked[i] ? '🔒' : '🔓'}
            </button>
            <button
              className="copy-btn"
              style={{ color: isLight(color) ? '#000' : '#fff' }}
              onClick={() => copyColor(color, i)}
            >
              {copied === i ? '✓' : color.toUpperCase()}
            </button>
          </div>
        ))}
      </div>
      <button className="btn-primary" onClick={regenerate} style={{ marginTop: '16px' }}>
        새 팔레트 생성
      </button>
    </div>
  )
}
