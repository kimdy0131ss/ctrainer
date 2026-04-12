import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import styles from './Leaderboard.module.css'

const BADGE_THRESHOLDS = [
  { label: 'Grandmaster', min: 20, color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  { label: 'Master',      min: 10, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  { label: 'Expert',      min: 5,  color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  { label: 'Advanced',    min: 3,  color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' },
  { label: 'Beginner',    min: 0,  color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
]

function getBadge(solved) {
  return BADGE_THRESHOLDS.find(t => solved >= t.min) || BADGE_THRESHOLDS.at(-1)
}

function computeStreak(submittedDates) {
  if (!submittedDates.length) return 0
  const unique = [...new Set(submittedDates.map(d => d.slice(0, 10)))].sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (unique[0] !== today && unique[0] !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < unique.length; i++) {
    const diff = (new Date(unique[i - 1]) - new Date(unique[i])) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}

function periodStart(period) {
  const now = new Date()
  if (period === 'weekly') {
    const d = new Date(now)
    d.setDate(now.getDate() - now.getDay())
    d.setHours(0, 0, 0, 0)
    return d.toISOString()
  }
  if (period === 'monthly') {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  }
  return null
}

const RANK_EMOJI = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function Leaderboard() {
  const [period, setPeriod] = useState('alltime')
  const [profiles, setProfiles] = useState([])
  const [solvedRows, setSolvedRows] = useState([])
  const [subRows, setSubRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [{ data: profs }, { data: solved }, { data: subs }] = await Promise.all([
        supabase.from('profiles').select('id, username'),
        supabase.from('solved_problems').select('user_id, problem_id'),
        supabase.from('submissions').select('user_id, problem_id, status, submitted_at'),
      ])
      setProfiles(profs || [])
      setSolvedRows(solved || [])
      setSubRows(subs || [])
      setLoading(false)
    }
    load()
  }, [])

  const ranked = useMemo(() => {
    if (!profiles.length) return []
    const start = periodStart(period)

    return profiles.map(p => {
      const userSubs = subRows.filter(s => s.user_id === p.id)
      const periodSubs = start ? userSubs.filter(s => s.submitted_at >= start) : userSubs

      // 전체/주간/월간 모두 submissions 기준으로 distinct accepted 문제 수 계산
      const acceptedSubs = period === 'alltime'
        ? userSubs.filter(s => s.status === 'accepted')
        : periodSubs.filter(s => s.status === 'accepted')
      const solved = new Set(acceptedSubs.map(s => s.problem_id)).size

      const totalSubs = periodSubs.length
      const streak = computeStreak(userSubs.map(s => s.submitted_at))
      const score = solved * 100 + periodSubs.filter(s => s.status === 'accepted').length * 10

      return { id: p.id, username: p.username, solved, totalSubs, streak, score }
    })
      .sort((a, b) => b.solved - a.solved || b.score - a.score)
      .map((u, i) => ({ ...u, rank: i + 1, badge: getBadge(u.solved) }))
  }, [profiles, solvedRows, subRows, period])

  const top3 = [ranked[1], ranked[0], ranked[2]].filter(Boolean)
  const podiumRanks = top3.length === 3 ? [2, 1, 3] : top3.map((u) => u?.rank)

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
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>불러오는 중...</div>
        ) : ranked.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>아직 등록된 유저가 없습니다.</div>
        ) : (
          <>
            {/* Podium */}
            {top3.length >= 1 && (
              <div className={styles.podium} style={{ gridTemplateColumns: `repeat(${top3.length}, 1fr)` }}>
                {top3.map((user, i) => {
                  const actualRank = podiumRanks[i]
                  return (
                    <Link
                      to={`/profile/${user.username}`}
                      key={user.username}
                      className={`${styles.podiumCard} ${actualRank === 1 ? styles.p1 : ''}`}
                    >
                      <div className={styles.podiumRankBadge} style={{ color: actualRank === 1 ? '#ffd700' : actualRank === 2 ? '#c0c0c0' : '#cd7f32' }}>
                        {actualRank === 1 ? '👑' : `#${actualRank}`}
                      </div>
                      <div className={styles.podiumAvatar} style={{
                        background: actualRank === 1
                          ? 'linear-gradient(135deg,#2dd4bf,#a78bfa)'
                          : 'linear-gradient(135deg,#475569,#334155)',
                        color: actualRank === 1 ? '#080b12' : 'var(--text-primary)',
                      }}>
                        {user.username[0].toUpperCase()}
                      </div>
                      <span className={styles.podiumName}>{user.username}</span>
                      <span className={styles.podiumScore}>{user.score.toLocaleString()}</span>
                      <span className={styles.podiumSolved}>{user.solved}문제 해결</span>
                      <span className={styles.podiumBadge} style={{ color: user.badge.color, background: user.badge.bg }}>
                        {user.badge.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Period filter */}
            <div className={styles.filterRow}>
              <div className={styles.periodTabs}>
                {[
                  { id: 'alltime', label: '전체 기간' },
                  { id: 'monthly', label: '이번 달' },
                  { id: 'weekly',  label: '이번 주' },
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
              {ranked.map(user => (
                <Link to={`/profile/${user.username}`} key={user.username} className={styles.tableRow}>
                  <span className={styles.rank}>
                    {user.rank <= 3
                      ? <span className={styles.rankEmoji}>{RANK_EMOJI[user.rank]}</span>
                      : <span className={styles.rankNum}>{user.rank}</span>
                    }
                  </span>
                  <span className={styles.userCell}>
                    <div className={styles.miniAvatar}>{user.username[0].toUpperCase()}</div>
                    <div className={styles.userInfo}>
                      <span className={styles.displayName}>{user.username}</span>
                      <span className={styles.username}>@{user.username}</span>
                    </div>
                  </span>
                  <span className={styles.badge} style={{ color: user.badge.color, background: user.badge.bg }}>
                    {user.badge.label}
                  </span>
                  <span className={styles.solved}>{user.solved}</span>
                  <span className={styles.streak}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M6 1C4 4 2 5 2 7.5A4 4 0 0 0 10 7.5C10 5 8 4 6 1Z" fill="#fb923c" opacity="0.8"/>
                    </svg>
                    {user.streak}d
                  </span>
                  <span className={styles.score}>{user.score.toLocaleString()}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
