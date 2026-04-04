import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LEADERBOARD } from '../data/problems'
import styles from './Leaderboard.module.css'

const BADGE_COLORS = {
  Grandmaster: { color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  Master:      { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  Expert:      { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  Advanced:    { color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' },
  Intermediate:{ color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
}

const RANK_STYLES = {
  1: { color: '#ffd700' },
  2: { color: '#c0c0c0' },
  3: { color: '#cd7f32' },
}

export default function Leaderboard() {
  const [period, setPeriod] = useState('alltime')

  return (
    <div className={styles.page}>
      <div className={styles.heroBand}>
        <div className={`${styles.aurora} ${styles.a1}`} />
        <div className={`${styles.aurora} ${styles.a2}`} />
        <div className={styles.grain} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>랭킹</h1>
          <p className={styles.heroSub}>우리 커뮤니티 최고의 코더들</p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Top 3 podium */}
        <div className={styles.podium}>
          {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((user, i) => {
            const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3
            return (
              <Link to={`/profile/${user.username}`} key={user.username} className={`${styles.podiumCard} ${styles[`p${actualRank}`]}`}>
                <div className={styles.podiumRankBadge} style={{ color: RANK_STYLES[actualRank].color }}>
                  {actualRank === 1 ? '👑' : `#${actualRank}`}
                </div>
                <div className={styles.podiumAvatar} style={{ background: actualRank === 1 ? 'linear-gradient(135deg,#2dd4bf,#a78bfa)' : 'linear-gradient(135deg,#475569,#334155)' }}>
                  {user.displayName[0]}
                </div>
                <span className={styles.podiumName}>{user.displayName}</span>
                <span className={styles.podiumScore}>{user.score.toLocaleString()}</span>
                <span className={styles.podiumSolved}>{user.solved}문제 해결</span>
                <span className={styles.podiumBadge} style={{ color: BADGE_COLORS[user.badge]?.color, background: BADGE_COLORS[user.badge]?.bg }}>
                  {user.badge}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Filter */}
        <div className={styles.filterRow}>
          <div className={styles.periodTabs}>
            {[
              { id: 'alltime', label: '전체 기간' },
              { id: 'monthly', label: '이번 달' },
              { id: 'weekly', label: '이번 주' },
            ].map(p => (
              <button
                key={p.id}
                className={`${styles.periodTab} ${period === p.id ? styles.periodActive : ''}`}
                onClick={() => setPeriod(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span className={styles.colRank}>순위</span>
            <span className={styles.colUser}>유저</span>
            <span className={styles.colBadge}>등급</span>
            <span className={styles.colSolved}>해결</span>
            <span className={styles.colStreak}>연속</span>
            <span className={styles.colScore}>점수</span>
          </div>
          {LEADERBOARD.map(user => (
            <Link to={`/profile/${user.username}`} key={user.username} className={styles.tableRow}>
              <span className={styles.rank} style={RANK_STYLES[user.rank] || {}}>
                {user.rank <= 3
                  ? <span className={styles.rankEmoji}>{user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}</span>
                  : <span className={styles.rankNum}>{user.rank}</span>
                }
              </span>
              <span className={styles.userCell}>
                <div className={styles.miniAvatar}>{user.displayName[0]}</div>
                <div className={styles.userInfo}>
                  <span className={styles.displayName}>{user.displayName}</span>
                  <span className={styles.username}>@{user.username}</span>
                </div>
              </span>
              <span className={styles.badge}
                style={{ color: BADGE_COLORS[user.badge]?.color, background: BADGE_COLORS[user.badge]?.bg }}>
                {user.badge}
              </span>
              <span className={styles.solved}>{user.solved}</span>
              <span className={styles.streak}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{flexShrink:0}}>
                  <path d="M6 1C4 4 2 5 2 7.5A4 4 0 0 0 10 7.5C10 5 8 4 6 1Z" fill="#fb923c" opacity="0.8"/>
                </svg>
                {user.streak}d
              </span>
              <span className={styles.score}>{user.score.toLocaleString()}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
