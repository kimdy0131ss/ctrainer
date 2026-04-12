import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import DifficultyBadge from '../components/judge/DifficultyBadge'
import styles from './Home.module.css'

function StatCard({ value, label }) {
  const display = typeof value === 'number' ? value.toLocaleString() : value
  return (
    <div className={styles.statCard}>
      <span className={styles.statValue}>{display}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

export default function Home() {
  const [userCount, setUserCount] = useState(null)
  const [problemCount, setProblemCount] = useState(null)
  const [submissionsToday, setSubmissionsToday] = useState(null)
  const [totalAC, setTotalAC] = useState(null)
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setUserCount(count ?? 0))
    
    supabase
      .from('problems')
      .select('id, hidden')
      .then(({ data }) => {
        const visibleDb = (data || []).filter(p => !p.hidden)
        setProblemCount(visibleDb.length)
        setFeatured(visibleDb.slice(0, 3))
      })
    
    // 오늘의 제출 수
    const today = new Date().toISOString().split('T')[0]
    supabase
      .from('submissions')
      .select('id', { count: 'exact' })
      .gte('submitted_at', today + 'T00:00:00')
      .then(({ count }) => setSubmissionsToday(count ?? 0))
    
    // 누적 정답 (AC)
    supabase
      .from('submissions')
      .select('id', { count: 'exact' })
      .eq('status', 'accepted')
      .then(({ count }) => setTotalAC(count ?? 0))
  }, [])

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.auroraWrap}>
          <div className={`${styles.aurora} ${styles.a1}`} />
          <div className={`${styles.aurora} ${styles.a2}`} />
          <div className={`${styles.aurora} ${styles.a3}`} />
          <div className={styles.grain} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.pill}>오픈 베타</div>
          <h1 className={styles.heroTitle}>
            실력을 갈고 닦으세요.<br />
            <span className={styles.gradient}>풀고. 겨루고. 성장하세요.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            알고리즘 문제를 풀고, 전 세계 개발자들과 경쟁하며,<br />나의 성장을 한눈에 확인하세요.
          </p>
          <div className={styles.heroActions}>
            <Link to="/problems" className={styles.btnPrimary}>문제 풀기</Link>
            <Link to="/leaderboard" className={styles.btnGhost}>랭킹 보기</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <StatCard value={problemCount ?? '—'} label="수록 문제 수" />
            <StatCard value={userCount ?? '—'} label="함께 준비 중인 코더" />
            <StatCard value={submissionsToday ?? '—'} label="오늘의 제출 수" />
            <StatCard value={totalAC ?? '—'} label="누적 정답 (AC)" />
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={`${styles.aurora} ${styles.ctaAurora}`} />
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>실력을 키울 준비가 됐나요?</h2>
              <p className={styles.ctaText}>매일 수천 명의 개발자들이 함께 성장하고 있습니다.</p>
              <Link to="/problems" className={styles.btnPrimary}>문제 탐색하기</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerText}>© 2026 CTruct. 코더를 위해, 코더가 만든 플랫폼.</p>
        </div>
      </footer>
    </div>
  )
}