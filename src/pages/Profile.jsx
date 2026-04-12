import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import DifficultyBadge from '../components/judge/DifficultyBadge'
import styles from './Profile.module.css'

function buildHeatmap(submissions) {
  const counts = {}
  submissions.forEach(s => {
    const date = (s.submitted_at || '').slice(0, 10)
    if (date) counts[date] = (counts[date] || 0) + 1
  })
  const data = []
  const today = new Date()
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    data.push({ date: key, count: counts[key] || 0 })
  }
  return data
}

function HeatCell({ count, date }) {
  const max = 5
  const opacity = count === 0 ? 0 : Math.min(0.2 + (count / max) * 0.8, 1)
  const bg = count === 0 ? 'var(--heat-empty)' : `rgba(45,212,191,${opacity})`
  return (
    <div
      className={styles.heatCell}
      style={{ background: bg }}
      title={count ? `${date}: ${count}건` : date}
    />
  )
}

export default function Profile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [solvedProblems, setSolvedProblems] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [heatmap, setHeatmap] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [invitations, setInvitations] = useState([])
  const [myClassrooms, setMyClassrooms] = useState([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data?.user?.id || null))
  }, [])

  const loadSelfData = async (userId) => {
    // Pending invitations
    const { data: invites } = await supabase
      .from('classroom_students')
      .select('classroom_id, classrooms(id, name, teacher_id, profiles(username))')
      .eq('student_id', userId)
      .eq('status', 'pending')
    setInvitations(invites || [])

    // Classrooms I'm accepted into + their assignments
    const { data: memberships } = await supabase
      .from('classroom_students')
      .select('classroom_id, classrooms(id, name, profiles(username))')
      .eq('student_id', userId)
      .eq('status', 'accepted')

    if (memberships?.length) {
      const classroomIds = memberships.map(m => m.classroom_id)
      const { data: assigns } = await supabase
        .from('assignments')
        .select('*')
        .in('classroom_id', classroomIds)
        .order('due_date', { ascending: true })

      // Load my accepted problem ids
      const { data: solvedRows } = await supabase
        .from('solved_problems')
        .select('problem_id')
        .eq('user_id', userId)
      const solvedSet = new Set((solvedRows || []).map(r => r.problem_id))

      setMyClassrooms(memberships.map(m => ({
        id: m.classroom_id,
        name: m.classrooms?.name || '?',
        teacher: m.classrooms?.profiles?.username || '?',
        assignments: (assigns || [])
          .filter(a => a.classroom_id === m.classroom_id)
          .map(a => ({
            ...a,
            done: (a.problem_ids || []).filter(pid => solvedSet.has(pid)).length,
          })),
      })))
    } else {
      setMyClassrooms([])
    }
  }

  const handleAcceptInvite = async (classroomId) => {
    await supabase.from('classroom_students')
      .update({ status: 'accepted', joined_at: new Date().toISOString() })
      .eq('classroom_id', classroomId).eq('student_id', currentUserId)
    loadSelfData(currentUserId)
  }

  const handleDeclineInvite = async (classroomId) => {
    await supabase.from('classroom_students')
      .delete().eq('classroom_id', classroomId).eq('student_id', currentUserId)
    loadSelfData(currentUserId)
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setNotFound(false)

      const { data: prof } = await supabase
        .from('profiles')
        .select('id, username, is_admin, is_teacher')
        .eq('username', username)
        .single()

      if (!prof) { setNotFound(true); setLoading(false); return }
      setProfile(prof)

      const [{ data: solved }, { data: subs }] = await Promise.all([
        supabase.from('solved_problems').select('problem_id, problems(id, title, difficulty)').eq('user_id', prof.id),
        supabase.from('submissions').select('status, submitted_at').eq('user_id', prof.id).order('submitted_at', { ascending: false }),
      ])

      setSolvedProblems((solved || []).map(s => s.problems).filter(Boolean))
      setSubmissions(subs || [])
      setHeatmap(buildHeatmap(subs || []))
      setLoading(false)
    }
    load()
  }, [username])

  useEffect(() => {
    if (currentUserId && profile && currentUserId === profile.id) {
      loadSelfData(currentUserId)
    }
  }, [currentUserId, profile])

  if (loading) return <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>불러오는 중...</div>
  if (notFound) return (
    <div className={styles.notFound}>
      <p>"{username}" 유저를 찾을 수 없습니다.</p>
      <Link to="/" className={styles.backLink}>← 홈으로</Link>
    </div>
  )

  const totalSolved = solvedProblems.length
  const easy   = solvedProblems.filter(p => p.difficulty === 'easy').length
  const medium = solvedProblems.filter(p => p.difficulty === 'medium').length
  const hard   = solvedProblems.filter(p => p.difficulty === 'hard').length

  const totalSubs = submissions.length
  const accepted  = submissions.filter(s => s.status === 'accepted').length
  const accuracy  = totalSubs > 0 ? Math.round((accepted / totalSubs) * 1000) / 10 : 0

  // Problem counts for bar widths (use solved as proxy denominator)
  const totalEasy   = Math.max(easy, 1)
  const totalMedium = Math.max(medium, 1)
  const totalHard   = Math.max(hard, 1)

  const currentYear = new Date().getFullYear()

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Profile header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarLarge}>
            {username[0].toUpperCase()}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.displayName}>{username}</h1>
            <span className={styles.handle}>@{username}</span>
            <div className={styles.profileBadges}>
              {profile.is_admin && <span className={styles.adminBadge}>ADMIN</span>}
              {profile.is_teacher && <span className={styles.teacherBadge}>교사</span>}
              <span className={styles.solvedBadge}>{totalSolved}문제 해결</span>
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
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="10"/>
                  {totalSolved > 0 && (
                    <circle cx="60" cy="60" r="50" fill="none"
                      stroke="url(#solvedGrad)" strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 50 * Math.min(totalSolved / Math.max(totalSolved + 1, 10), 1)} ${2 * Math.PI * 50}`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                  )}
                  <defs>
                    <linearGradient id="solvedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2dd4bf"/>
                      <stop offset="100%" stopColor="#a78bfa"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className={styles.solvedCenter}>
                  <span className={styles.solvedNum}>{totalSolved}</span>
                  <span className={styles.solvedTotalLabel}>풀음</span>
                </div>
              </div>

              <div className={styles.diffBreakdown}>
                {[
                  { label: 'Easy',   count: easy,   color: 'var(--easy)',   total: easy },
                  { label: 'Medium', count: medium, color: 'var(--medium)', total: medium },
                  { label: 'Hard',   count: hard,   color: 'var(--hard)',   total: hard },
                ].map(({ label, count, color }) => (
                  <div key={label} className={styles.diffRow}>
                    <span className={styles.diffLabel} style={{ color }}>{label}</span>
                    <div className={styles.diffBar}>
                      <div className={styles.diffFill} style={{
                        width: totalSolved > 0 ? `${(count / totalSolved) * 100}%` : '0%',
                        background: color,
                      }} />
                    </div>
                    <span className={styles.diffCount}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>통계</h3>
              <div className={styles.statsList}>
                {[
                  { label: '총 제출 수', value: totalSubs.toLocaleString() },
                  { label: '정답 수',    value: accepted.toLocaleString() },
                  { label: '정답률',     value: `${accuracy}%` },
                  { label: '해결 문제',  value: `${totalSolved}문제` },
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
                <span className={styles.heatmapYear}>{currentYear}</span>
              </div>
              <div className={styles.heatmap}>
                {heatmap.map((cell, i) => (
                  <HeatCell key={i} count={cell.count} date={cell.date} />
                ))}
              </div>
              <div className={styles.heatmapLegend}>
                <span className={styles.legendLabel}>Less</span>
                {[0, 1, 2, 3, 4, 5].map(v => (
                  <div key={v} className={styles.heatCell} style={{
                    background: v === 0
                      ? 'var(--heat-empty)'
                      : `rgba(45,212,191,${Math.min(0.2 + (v / 5) * 0.8, 1)})`,
                    flexShrink: 0,
                  }} />
                ))}
                <span className={styles.legendLabel}>More</span>
              </div>
            </div>

            {/* Solved problems */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>푼 문제 ({totalSolved})</h3>
              {totalSolved === 0 ? (
                <div className={styles.empty}>아직 푼 문제가 없습니다.</div>
              ) : (
                <div className={styles.solvedList}>
                  {solvedProblems.map(problem => (
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
              )}
            </div>
          </div>
        </div>

        {/* ── 본인 프로필 전용: 초대 & 내 반 ── */}
        {currentUserId && profile && currentUserId === profile.id && (
          <div className={styles.selfSection}>

            {/* 대기 중 초대 */}
            {invitations.length > 0 && (
              <div className={styles.card} style={{ marginBottom: 20 }}>
                <h3 className={styles.cardTitle}>반 초대 ({invitations.length})</h3>
                <div className={styles.inviteList}>
                  {invitations.map(inv => (
                    <div key={inv.classroom_id} className={styles.inviteRow}>
                      <div className={styles.inviteInfo}>
                        <span className={styles.inviteName}>{inv.classrooms?.name || '?'}</span>
                        <span className={styles.inviteTeacher}>교사: @{inv.classrooms?.profiles?.username || '?'}</span>
                      </div>
                      <div className={styles.inviteActions}>
                        <button className={styles.acceptBtn} onClick={() => handleAcceptInvite(inv.classroom_id)}>수락</button>
                        <button className={styles.declineBtn} onClick={() => handleDeclineInvite(inv.classroom_id)}>거절</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 소속 반 & 과제 */}
            {myClassrooms.length > 0 && (
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>내 반</h3>
                <div className={styles.classroomList}>
                  {myClassrooms.map(cls => (
                    <div key={cls.id} className={styles.classroomItem}>
                      <div className={styles.classroomHeader}>
                        <span className={styles.classroomName}>{cls.name}</span>
                        <span className={styles.classroomTeacher}>교사: @{cls.teacher}</span>
                      </div>
                      {cls.assignments.length === 0 ? (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 0' }}>과제 없음</div>
                      ) : cls.assignments.map(a => {
                        const total = (a.problem_ids || []).length
                        const pct   = total ? Math.round((a.done / total) * 100) : 0
                        const due   = a.due_date ? new Date(a.due_date) : null
                        const closed = due && due < new Date()
                        return (
                          <div key={a.id} className={styles.assignmentItem}>
                            <div className={styles.assignItemTop}>
                              <span className={styles.assignItemTitle}>{a.title}</span>
                              <span className={styles.assignItemMeta}>
                                {a.done}/{total}
                                {due && (
                                  <span style={{ marginLeft: 8, color: closed ? 'var(--text-muted)' : '#fbbf24' }}>
                                    {closed ? '종료' : `D-${Math.ceil((due - new Date()) / 86400000)}`}
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className={styles.assignProgressBar}>
                              <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#34d399' : '#2dd4bf', borderRadius: 3, transition: 'width 0.5s' }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
