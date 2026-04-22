import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { path: '/', label: '홈' },
  { path: '/problems', label: '문제' },
  { path: '/visualizer', label: '시각화' },
  { path: '/leaderboard', label: '랭킹' },
  { path: '/teacher', label: '교사' },
  { path: '/introduction', label: '소개' },
]

export default function Navbar({ user, isAdmin, theme, toggleTheme }) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      if (!error) {
        setProfile(data)
      }
    }

    fetchProfile()
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>

        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>CTruct</span>
        </Link>

        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.link} ${
                location.pathname === link.path ||
                (link.path !== '/' && location.pathname.startsWith(link.path))
                  ? styles.active
                  : ''
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={`${styles.link} ${styles.adminLink} ${
                location.pathname === '/admin' ? styles.active : ''
              }`}
              onClick={() => setMenuOpen(false)}
            >
              관리자
            </Link>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.themeToggle} onClick={toggleTheme} title={theme === 'dark' ? '라이트 모드' : '다크 모드'}>
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          {!user ? (
            <>
              <Link to="/login" className={styles.link}>로그인</Link>
              <Link to="/signup" className={styles.link}>회원가입</Link>
            </>
          ) : (
            <>
              <Link
                to={profile?.username ? `/profile/${profile.username}` : '#'}
                className={styles.profileLink}
              >
                {isAdmin && <span className={styles.adminBadge}>ADMIN</span>}
                {profile?.username || user.email}
              </Link>
              <button onClick={handleLogout} className={styles.link}>로그아웃</button>
            </>
          )}
        </div>

      </nav>
    </header>
  )
}
