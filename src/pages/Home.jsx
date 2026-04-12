import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PROBLEMS, STATS } from '../data/problems'
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
  const featured = PROBLEMS.slice(0, 3)
  const [userCount, setUserCount] = useState(null)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setUserCount(count ?? 0))
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
            <StatCard value={STATS.totalProblems} label="수록 문제 수" />
            <StatCard value={userCount ?? '—'} label="함께 준비 중인 코더" />
            <StatCard value={STATS.submissionsToday} label="오늘의 제출 수" />
            <StatCard value={STATS.totalAC} label="누적 정답 (AC)" />
          </div>
        </div>
      </section>

      {/* Featured Problems */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>추천 문제</h2>
            <Link to="/problems" className={styles.seeAll}>전체 보기 →</Link>
          </div>
          <div className={styles.problemGrid}>
            {featured.map(problem => (
              <Link to={`/problems/${problem.id}`} key={problem.id} className={styles.problemCard}>
                <div className={styles.problemCardTop}>
                  <span className={styles.problemNum}>#{problem.id}</span>
                  {problem.solved && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.solvedIcon}>
                      <circle cx="8" cy="8" r="7.5" stroke="var(--easy)" strokeOpacity="0.5"/>
                      <path d="M5 8l2 2 4-4" stroke="var(--easy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <h3 className={styles.problemTitle}>{problem.title}</h3>
                <div className={styles.problemMeta}>
                  <DifficultyBadge difficulty={problem.difficulty} />
                  <span className={styles.acceptance}>정답률 {problem.acceptance}%</span>
                </div>
                <div className={styles.tagList}>
                  {problem.tags.slice(0, 2).map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
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
