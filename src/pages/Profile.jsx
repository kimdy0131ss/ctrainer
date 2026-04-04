import { useParams, Link } from 'react-router-dom'
import { PROBLEMS } from '../data/problems'
import DifficultyBadge from '../components/judge/DifficultyBadge'
import styles from './Profile.module.css'

const SOLVED = PROBLEMS.filter(p => p.solved)

const HEATMAP_DATA = (() => {
  const data = []
  for (let i = 0; i < 52 * 7; i++) {
    data.push(Math.random() < 0.3 ? Math.floor(Math.random() * 5) + 1 : 0)
  }
  return data
})()

function HeatCell({ count }) {
  const opacity = count === 0 ? 0 : 0.2 + (count / 5) * 0.8
  const color = count === 0
    ? 'rgba(255,255,255,0.04)'
    : `rgba(45,212,191,${opacity})`
  return <div className={styles.heatCell} style={{ background: color }} title={`${count} submissions`} />
}

export default function Profile() {
  const { username } = useParams()
  const totalSolved = SOLVED.length
  const easy = PROBLEMS.filter(p => p.solved && p.difficulty === 'easy').length
  const medium = PROBLEMS.filter(p => p.solved && p.difficulty === 'medium').length
  const hard = PROBLEMS.filter(p => p.solved && p.difficulty === 'hard').length

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Profile header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarLarge}>
            {username ? username[0].toUpperCase() : 'A'}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.displayName}>{username || 'Anonymous'}</h1>
            <span className={styles.handle}>@{username || 'anonymous'}</span>
            <div className={styles.profileBadges}>
              <span className={styles.rankBadge}>전문가</span>
              <span className={styles.streakBadge}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1C4 4 2 5 2 7.5A4 4 0 0 0 10 7.5C10 5 8 4 6 1Z" fill="#fb923c"/>
                </svg>
                24일 연속
              </span>
            </div>
          </div>
        </div>

        <div className={styles.layout}>
          {/* Left column */}
          <div className={styles.leftCol}>
            {/* Solved stats */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>풀이 현황</h3>
              <div className={styles.solvedCircle}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
                  <circle cx="60" cy="60" r="50" fill="none"
                    stroke="url(#solvedGrad)" strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 50 * totalSolved / PROBLEMS.length} ${2 * Math.PI * 50}`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                  <defs>
                    <linearGradient id="solvedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2dd4bf"/>
                      <stop offset="100%" stopColor="#a78bfa"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className={styles.solvedCenter}>
                  <span className={styles.solvedNum}>{totalSolved}</span>
                  <span className={styles.solvedTotal}>/{PROBLEMS.length}</span>
                </div>
              </div>

              <div className={styles.diffBreakdown}>
                <div className={styles.diffRow}>
                  <span className={styles.diffEasy}>Easy</span>
                  <div className={styles.diffBar}>
                    <div className={styles.diffFill} style={{ width: `${(easy / PROBLEMS.filter(p=>p.difficulty==='easy').length)*100}%`, background: 'var(--easy)' }} />
                  </div>
                  <span className={styles.diffCount}>{easy}</span>
                </div>
                <div className={styles.diffRow}>
                  <span className={styles.diffMedium}>Medium</span>
                  <div className={styles.diffBar}>
                    <div className={styles.diffFill} style={{ width: `${(medium / PROBLEMS.filter(p=>p.difficulty==='medium').length)*100}%`, background: 'var(--medium)' }} />
                  </div>
                  <span className={styles.diffCount}>{medium}</span>
                </div>
                <div className={styles.diffRow}>
                  <span className={styles.diffHard}>Hard</span>
                  <div className={styles.diffBar}>
                    <div className={styles.diffFill} style={{ width: `${(hard / PROBLEMS.filter(p=>p.difficulty==='hard').length)*100}%`, background: 'var(--hard)' }} />
                  </div>
                  <span className={styles.diffCount}>{hard}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>통계</h3>
              <div className={styles.statsList}>
                {[
                  { label: '전체 순위', value: '#1,284' },
                  { label: '점수', value: '12,450' },
                  { label: '정답률', value: '67.3%' },
                  { label: '총 제출 수', value: '342' },
                ].map(s => (
                  <div key={s.label} className={styles.statsRow}>
                    <span className={styles.statsLabel}>{s.label}</span>
                    <span className={styles.statsVal}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className={styles.rightCol}>
            {/* Heatmap */}
            <div className={styles.card}>
              <div className={styles.heatmapHeader}>
                <h3 className={styles.cardTitle}>제출 활동</h3>
                <span className={styles.heatmapYear}>2026</span>
              </div>
              <div className={styles.heatmap}>
                {HEATMAP_DATA.map((count, i) => <HeatCell key={i} count={count} />)}
              </div>
              <div className={styles.heatmapLegend}>
                <span className={styles.legendLabel}>Less</span>
                {[0,1,2,3,4,5].map(v => (
                  <div key={v} className={styles.heatCell} style={{
                    background: v === 0 ? 'rgba(255,255,255,0.04)' : `rgba(45,212,191,${0.2 + (v/5)*0.8})`,
                    flexShrink: 0
                  }} />
                ))}
                <span className={styles.legendLabel}>More</span>
              </div>
            </div>

            {/* Solved problems */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>푼 문제</h3>
              <div className={styles.solvedList}>
                {SOLVED.map(problem => (
                  <Link to={`/problems/${problem.id}`} key={problem.id} className={styles.solvedRow}>
                    <span className={styles.solvedCheck}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6.5" stroke="var(--easy)" strokeOpacity="0.5"/>
                        <path d="M4 7l2 2 4-4" stroke="var(--easy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className={styles.solvedTitle}>{problem.title}</span>
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
