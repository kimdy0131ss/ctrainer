import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { path: '/', label: '홈' },
  { path: '/problems', label: '문제' },
  { path: '/visualizer', label: '시각화' },
  { path: '/leaderboard', label: '랭킹' },
  { path: '/teacher', label: '교사' },
]

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" stroke="url(#hexGrad)" strokeWidth="1.5" fill="none"/>
            <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="url(#hexFill)" opacity="0.4"/>
            <circle cx="14" cy="14" r="2.5" fill="url(#hexGrad)"/>
            <defs>
              <linearGradient id="hexGrad" x1="3" y1="2" x2="25" y2="26" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2dd4bf"/>
                <stop offset="100%" stopColor="#a78bfa"/>
              </linearGradient>
              <linearGradient id="hexFill" x1="3" y1="2" x2="25" y2="26" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2dd4bf"/>
                <stop offset="100%" stopColor="#a78bfa"/>
              </linearGradient>
            </defs>
          </svg>
          <span className={styles.logoText}>hexjudge</span>
        </Link>

        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.link} ${location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path)) ? styles.active : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <Link to="/profile/me" className={styles.profileBtn}>
            <div className={styles.avatar}>
              <span>A</span>
            </div>
          </Link>
          <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
    </header>
  )
}
