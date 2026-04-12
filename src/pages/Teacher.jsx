import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { PROBLEMS as LOCAL_PROBLEMS } from '../data/problems'
import styles from './Teacher.module.css'

function computeStreak(dates) {
  if (!dates.length) return 0
  const unique = [...new Set(dates.map(d => d.slice(0, 10)))].sort().reverse()
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

function assignmentStatus(dueDate) {
  if (!dueDate) return 'active'
  const due = new Date(dueDate)
  const now = new Date(); now.setHours(0, 0, 0, 0)
  return due < now ? 'closed' : 'active'
}

function StatusDot({ status }) {
  const [label, color] = status === 'active' ? ['활성', '#34d399'] : ['종료', '#94a3b8']
  return (
    <span className={styles.statusDot} style={{ color, background: color + '18', border: `1px solid ${color}40` }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', marginRight: 5 }} />
      {label}
    </span>
  )
}

export default function Teacher() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [notTeacher, setNotTeacher] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const [classrooms, setClassrooms] = useState([])
  const [activeClassroom, setActiveClassroom] = useState(null)
  const [students, setStudents] = useState([])
  const [subRows, setSubRows] = useState([])
  const [assignments, setAssignments] = useState([])
  const [pendingInvites, setPendingInvites] = useState([])
  const [allProblems, setAllProblems] = useState([])

  const [tab, setTab] = useState('dashboard')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [searchStudent, setSearchStudent] = useState('')

  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', problems: [] })
  const [submitting, setSubmitting] = useState(false)

  const [newClassName, setNewClassName] = useState('')
  const [showNewClass, setShowNewClass] = useState(false)
  const [creatingClass, setCreatingClass] = useState(false)

  const [inviteUsername, setInviteUsername] = useState('')
  const [inviteMsg, setInviteMsg] = useState(null)
  const [showInvite, setShowInvite] = useState(false)
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }

      const { data: prof } = await supabase
        .from('profiles').select('id, username, is_teacher').eq('id', user.id).single()
      setProfile(prof)

      if (!prof?.is_teacher) { setNotTeacher(true); setInitialized(true); return }

      const [{ data: cls }, { data: probs }] = await Promise.all([
        supabase.from('classrooms').select('*').eq('teacher_id', user.id).order('created_at'),
        supabase.from('problems').select('id, title, difficulty, tags').order('id'),
      ])

      setClassrooms(cls || [])
      setAllProblems(
        probs?.length
          ? probs
          : LOCAL_PROBLEMS.map(p => ({ id: p.id, title: p.title, difficulty: p.difficulty, tags: p.tags }))
      )
      if (cls?.length) setActiveClassroom(cls[0])
      setInitialized(true)
    }
    init()
  }, [])

  const loadClassroomData = useCallback(async (classroomId) => {
    const { data: memberRows } = await supabase
      .from('classroom_students')
      .select('student_id, status, joined_at, profiles(id, username)')
      .eq('classroom_id', classroomId)

    const accepted = (memberRows || []).filter(r => r.status === 'accepted')
    const pending  = (memberRows || []).filter(r => r.status === 'pending')
    setPendingInvites(pending.map(r => r.profiles?.username).filter(Boolean))

    const studentIds = accepted.map(r => r.student_id)
    if (!studentIds.length) {
      setStudents([]); setSubRows([])
    } else {
      const [{ data: solvedRows }, { data: subs }] = await Promise.all([
        supabase.from('solved_problems').select('user_id, problem_id').in('user_id', studentIds),
        supabase.from('submissions').select('user_id, problem_id, status, submitted_at').in('user_id', studentIds),
      ])
      setSubRows(subs || [])
      setStudents(accepted.map(r => {
        const solved   = (solvedRows || []).filter(s => s.user_id === r.student_id).length
        const userSubs = (subs || []).filter(s => s.user_id === r.student_id)
        return {
          id: r.student_id,
          username: r.profiles?.username || '?',
          solved,
          streak: computeStreak(userSubs.map(s => s.submitted_at)),
          score: solved * 100 + userSubs.filter(s => s.status === 'accepted').length * 10,
        }
      }))
    }

    const { data: assigns } = await supabase
      .from('assignments').select('*').eq('classroom_id', classroomId).order('created_at', { ascending: false })
    setAssignments(assigns || [])
  }, [])

  useEffect(() => {
    if (activeClassroom) loadClassroomData(activeClassroom.id)
  }, [activeClassroom, loadClassroomData])

  const getStats = (assignment) => {
    const pids = assignment.problem_ids || []
    let fullyDone = 0, partial = 0
    for (const s of students) {
      const acc = new Set(subRows.filter(r => r.user_id === s.id && r.status === 'accepted').map(r => r.problem_id))
      const done = pids.filter(p => acc.has(p)).length
      if (done === pids.length && pids.length > 0) fullyDone++
      else if (done > 0) partial++
    }
    return { total: students.length, fullyDone, partial, notStarted: students.length - fullyDone - partial }
  }

  const studentDone = (student, assignment) => {
    const acc = new Set(subRows.filter(r => r.user_id === student.id && r.status === 'accepted').map(r => r.problem_id))
    return (assignment.problem_ids || []).filter(p => acc.has(p)).length
  }

  const handleCreateClassroom = async () => {
    if (!newClassName.trim() || !profile) return
    setCreatingClass(true)
    const { data, error } = await supabase.from('classrooms')
      .insert([{ name: newClassName.trim(), teacher_id: profile.id }])
      .select().single()
    if (!error && data) {
      const updated = [...classrooms, data]
      setClassrooms(updated)
      setActiveClassroom(data)
      setNewClassName(''); setShowNewClass(false)
    }
    setCreatingClass(false)
  }

  const handleInvite = async () => {
    if (!inviteUsername.trim() || !activeClassroom) return
    setInviting(true); setInviteMsg(null)
    const { data: target } = await supabase
      .from('profiles').select('id, username').eq('username', inviteUsername.trim()).single()
    if (!target) {
      setInviteMsg({ type: 'error', text: '유저를 찾을 수 없습니다.' })
      setInviting(false); return
    }
    if (target.id === profile?.id) {
      setInviteMsg({ type: 'error', text: '자신은 초대할 수 없습니다.' })
      setInviting(false); return
    }
    const { error } = await supabase.from('classroom_students').upsert([{
      classroom_id: activeClassroom.id,
      student_id: target.id,
      status: 'pending',
      invited_at: new Date().toISOString(),
    }], { onConflict: 'classroom_id,student_id' })
    if (error) setInviteMsg({ type: 'error', text: '초대 실패: ' + error.message })
    else {
      setInviteMsg({ type: 'success', text: `${target.username}님에게 초대를 보냈습니다.` })
      setInviteUsername('')
      loadClassroomData(activeClassroom.id)
    }
    setInviting(false)
  }

  const handleCreateAssignment = async (e) => {
    e.preventDefault()
    if (!activeClassroom || !newAssignment.problems.length || !newAssignment.title.trim()) return
    setSubmitting(true)
    const { error } = await supabase.from('assignments').insert([{
      classroom_id: activeClassroom.id,
      title: newAssignment.title.trim(),
      description: newAssignment.description.trim(),
      due_date: newAssignment.dueDate || null,
      problem_ids: newAssignment.problems,
    }])
    if (!error) {
      setTab('assignments')
      setNewAssignment({ title: '', description: '', dueDate: '', problems: [] })
      loadClassroomData(activeClassroom.id)
    }
    setSubmitting(false)
  }

  const handleDeleteAssignment = async (assignId) => {
    if (!window.confirm('과제를 삭제하시겠습니까?')) return
    await supabase.from('assignments').delete().eq('id', assignId)
    setSelectedAssignment(null)
    loadClassroomData(activeClassroom.id)
  }

  if (!initialized) return <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>불러오는 중...</div>

  if (notTeacher) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12, color: 'var(--text-secondary)' }}>
      <p style={{ fontSize: 16 }}>교사 권한이 없습니다.</p>
      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>관리자에게 교사 권한 부여를 요청하세요.</p>
    </div>
  )

  const filteredStudents = students.filter(s =>
    s.username.toLowerCase().includes(searchStudent.toLowerCase())
  )
  const activeAssignmentsCount = assignments.filter(a => assignmentStatus(a.due_date) === 'active').length

  return (
    <div className={styles.page}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.classInfo}>
          <div className={styles.classIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="12" rx="2" stroke="url(#tGrad)" strokeWidth="1.5"/>
              <path d="M6 8h8M6 12h5" stroke="url(#tGrad)" strokeWidth="1.5" strokeLinecap="round"/>
              <defs><linearGradient id="tGrad" x1="2" y1="4" x2="18" y2="16" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2dd4bf"/><stop offset="100%" stopColor="#a78bfa"/>
              </linearGradient></defs>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {classrooms.length > 1 ? (
              <select
                className={styles.classSelect}
                value={activeClassroom?.id || ''}
                onChange={e => {
                  setActiveClassroom(classrooms.find(c => c.id === Number(e.target.value)))
                  setTab('dashboard'); setSelectedStudent(null); setSelectedAssignment(null)
                }}
              >
                {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            ) : (
              <div className={styles.className}>{activeClassroom?.name || '반 없음'}</div>
            )}
          </div>
        </div>

        <button className={styles.newClassBtn} onClick={() => setShowNewClass(true)}>+ 새 반 만들기</button>

        <nav className={styles.nav}>
          {[
            { id: 'dashboard',      icon: '⬡', label: '대시보드' },
            { id: 'students',       icon: '◈', label: '학생 관리' },
            { id: 'assignments',    icon: '◻', label: '과제 관리' },
            { id: 'new-assignment', icon: '+', label: '과제 출제', accent: true },
          ].map(item => (
            <button
              key={item.id}
              className={`${styles.navItem} ${tab === item.id ? styles.navActive : ''} ${item.accent ? styles.navAccent : ''}`}
              onClick={() => { setTab(item.id); setSelectedStudent(null); setSelectedAssignment(null) }}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.teacherBadge}>
          <div className={styles.teacherAvatar}>{profile?.username?.[0]?.toUpperCase() || 'T'}</div>
          <div>
            <div className={styles.teacherName}>{profile?.username}</div>
            <div className={styles.teacherRole}>교사</div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>

        {/* Create classroom modal */}
        {showNewClass && (
          <div className={styles.overlay} onClick={() => setShowNewClass(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <h2 className={styles.modalTitle}>새 반 만들기</h2>
              <input
                className={styles.formInput}
                placeholder="반 이름 (예: 2반 알고리즘)"
                value={newClassName}
                onChange={e => setNewClassName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateClassroom()}
                autoFocus
              />
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setShowNewClass(false)}>취소</button>
                <button className={styles.submitBtn} onClick={handleCreateClassroom} disabled={!newClassName.trim() || creatingClass}>
                  {creatingClass ? '생성 중...' : '만들기'}
                </button>
              </div>
            </div>
          </div>
        )}

        {!activeClassroom ? (
          <div className={styles.emptyState}>
            <p>아직 반이 없습니다.</p>
            <button className={styles.newBtn} onClick={() => setShowNewClass(true)}>+ 반 만들기</button>
          </div>
        ) : (
          <>
            {/* ── 대시보드 ── */}
            {tab === 'dashboard' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h1 className={styles.sectionTitle}>대시보드</h1>
                  <span className={styles.sectionDate}>{activeClassroom.name}</span>
                </div>

                <div className={styles.statsGrid}>
                  {[
                    { label: '총 학생 수',    value: students.length,        unit: '명',  color: '#2dd4bf' },
                    { label: '대기 중 초대',  value: pendingInvites.length,  unit: '명',  color: '#fbbf24' },
                    { label: '평균 해결 문제', value: students.length ? Math.round(students.reduce((s, t) => s + t.solved, 0) / students.length) : 0, unit: '문제', color: '#a78bfa' },
                    { label: '진행 중 과제',  value: activeAssignmentsCount, unit: '개',  color: '#34d399' },
                  ].map(s => (
                    <div key={s.label} className={styles.statCard}>
                      <div className={styles.statTop}>
                        <span className={styles.statLabel}>{s.label}</span>
                        <span className={styles.statDot} style={{ background: s.color }} />
                      </div>
                      <div className={styles.statBottom}>
                        <span className={styles.statValue} style={{ color: s.color }}>{s.value}</span>
                        <span className={styles.statUnit}>{s.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>학생 활동 현황</h2>
                    <button className={styles.cardLink} onClick={() => setTab('students')}>전체 보기 →</button>
                  </div>
                  {students.length === 0 ? (
                    <div className={styles.emptySmall}>학생이 없습니다. 학생 관리 탭에서 초대하세요.</div>
                  ) : (
                    <div className={styles.miniTable}>
                      <div className={styles.miniTableHead}><span>학생</span><span>해결</span><span>연속</span><span>점수</span></div>
                      {students.slice(0, 5).map(s => (
                        <div key={s.id} className={styles.miniTableRow} onClick={() => { setSelectedStudent(s); setTab('students') }}>
                          <span className={styles.miniUser}>
                            <span className={styles.miniAvatar}>{s.username[0].toUpperCase()}</span>
                            {s.username}
                          </span>
                          <span className={styles.monoVal}>{s.solved}</span>
                          <span className={styles.monoVal}>{s.streak}일</span>
                          <span className={styles.monoVal}>{s.score.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>진행 중인 과제</h2>
                    <button className={styles.cardLink} onClick={() => setTab('assignments')}>전체 보기 →</button>
                  </div>
                  {activeAssignmentsCount === 0 ? (
                    <div className={styles.emptySmall}>진행 중인 과제가 없습니다.</div>
                  ) : assignments.filter(a => assignmentStatus(a.due_date) === 'active').map(a => {
                    const stats = getStats(a)
                    const pct = stats.total ? Math.round((stats.fullyDone / stats.total) * 100) : 0
                    return (
                      <div key={a.id} className={styles.assignmentRow} onClick={() => { setSelectedAssignment(a); setTab('assignments') }}>
                        <div className={styles.assignRowTop}>
                          <span className={styles.assignTitle}>{a.title}</span>
                          <StatusDot status="active" />
                        </div>
                        <div className={styles.assignMeta}>
                          <span>마감: {a.due_date || '없음'}</span>
                          <span>{stats.fullyDone}/{stats.total}명 완료</span>
                        </div>
                        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${pct}%` }} /></div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── 학생 관리 ── */}
            {tab === 'students' && !selectedStudent && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h1 className={styles.sectionTitle}>학생 관리</h1>
                  <button className={styles.newBtn} onClick={() => { setShowInvite(v => !v); setInviteMsg(null) }}>
                    {showInvite ? '닫기' : '+ 학생 초대'}
                  </button>
                </div>

                {showInvite && (
                  <div className={styles.inviteBox}>
                    <div className={styles.inviteRow}>
                      <input
                        className={styles.formInput}
                        placeholder="초대할 유저네임 입력..."
                        value={inviteUsername}
                        onChange={e => setInviteUsername(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleInvite()}
                      />
                      <button className={styles.submitBtn} onClick={handleInvite} disabled={inviting || !inviteUsername.trim()}>
                        {inviting ? '...' : '초대'}
                      </button>
                    </div>
                    {inviteMsg && (
                      <span style={{ fontSize: 13, color: inviteMsg.type === 'error' ? 'var(--hard)' : 'var(--easy)' }}>
                        {inviteMsg.text}
                      </span>
                    )}
                    {pendingInvites.length > 0 && (
                      <div className={styles.pendingList}>
                        <span className={styles.pendingLabel}>대기 중:</span>
                        {pendingInvites.map(u => <span key={u} className={styles.pendingChip}>@{u}</span>)}
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.searchBar}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input type="text" placeholder="학생 검색..." value={searchStudent}
                    onChange={e => setSearchStudent(e.target.value)} className={styles.searchInput}/>
                </div>

                {students.length === 0 ? (
                  <div className={styles.emptyState}><p>학생이 없습니다. 위에서 유저네임으로 초대하세요.</p></div>
                ) : (
                  <div className={styles.studentGrid}>
                    {filteredStudents.map(s => (
                      <div key={s.id} className={styles.studentCard} onClick={() => setSelectedStudent(s)}>
                        <div className={styles.studentAvatar}>{s.username[0].toUpperCase()}</div>
                        <div className={styles.studentName}>{s.username}</div>
                        <div className={styles.studentHandle}>@{s.username}</div>
                        <div className={styles.studentStats}>
                          {[['해결', s.solved], ['점수', s.score.toLocaleString()], ['연속', s.streak + '일']].map(([k, v]) => (
                            <div key={k} className={styles.sStatItem}>
                              <span className={styles.sStatVal}>{v}</span>
                              <span className={styles.sStatKey}>{k}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── 학생 상세 ── */}
            {tab === 'students' && selectedStudent && (
              <div className={styles.section}>
                <button className={styles.backBtn} onClick={() => setSelectedStudent(null)}>← 목록으로</button>
                <div className={styles.studentDetailHeader}>
                  <div className={styles.detailAvatar}>{selectedStudent.username[0].toUpperCase()}</div>
                  <div>
                    <h1 className={styles.detailName}>{selectedStudent.username}</h1>
                    <div className={styles.detailHandle}>@{selectedStudent.username}</div>
                  </div>
                </div>

                <div className={styles.statsGrid}>
                  {[
                    { label: '해결 문제', value: selectedStudent.solved, unit: '문제', color: '#2dd4bf' },
                    { label: '총 점수', value: selectedStudent.score.toLocaleString(), unit: '점', color: '#a78bfa' },
                    { label: '연속 도전', value: selectedStudent.streak, unit: '일', color: '#fbbf24' },
                  ].map(s => (
                    <div key={s.label} className={styles.statCard}>
                      <div className={styles.statTop}><span className={styles.statLabel}>{s.label}</span><span className={styles.statDot} style={{ background: s.color }} /></div>
                      <div className={styles.statBottom}><span className={styles.statValue} style={{ color: s.color }}>{s.value}</span><span className={styles.statUnit}>{s.unit}</span></div>
                    </div>
                  ))}
                </div>

                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>과제별 제출 현황</h2>
                  {assignments.length === 0 && <div className={styles.emptySmall}>과제가 없습니다.</div>}
                  {assignments.map(a => {
                    const done  = studentDone(selectedStudent, a)
                    const total = (a.problem_ids || []).length
                    const acc   = new Set(subRows.filter(r => r.user_id === selectedStudent.id && r.status === 'accepted').map(r => r.problem_id))
                    return (
                      <div key={a.id} className={styles.assignDetailRow}>
                        <div className={styles.assignRowTop}>
                          <span className={styles.assignTitle}>{a.title}</span>
                          <span className={styles.monoVal}>{done}/{total}</span>
                        </div>
                        <div className={styles.problemChips}>
                          {(a.problem_ids || []).map(pid => {
                            const prob = allProblems.find(p => p.id === pid)
                            const solved = acc.has(pid)
                            return (
                              <div key={pid} className={`${styles.problemChip} ${solved ? styles.ac : styles.none}`}>
                                <span className={styles.chipStatus}>{solved ? '✓' : '—'}</span>
                                <span className={styles.chipTitle}>{prob?.title || `#${pid}`}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── 과제 관리 ── */}
            {tab === 'assignments' && !selectedAssignment && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h1 className={styles.sectionTitle}>과제 관리</h1>
                  <button className={styles.newBtn} onClick={() => setTab('new-assignment')}>+ 새 과제</button>
                </div>
                {assignments.length === 0 ? (
                  <div className={styles.emptyState}><p>과제가 없습니다. 새 과제를 출제해보세요.</p></div>
                ) : (
                  <div className={styles.assignmentList}>
                    {assignments.map(a => {
                      const stats  = getStats(a)
                      const status = assignmentStatus(a.due_date)
                      const pct    = stats.total ? Math.round((stats.fullyDone / stats.total) * 100) : 0
                      return (
                        <div key={a.id} className={styles.assignCard} onClick={() => setSelectedAssignment(a)}>
                          <div className={styles.assignCardTop}>
                            <div className={styles.assignCardLeft}>
                              <StatusDot status={status} />
                              <h3 className={styles.assignCardTitle}>{a.title}</h3>
                              {a.description && <p className={styles.assignCardDesc}>{a.description}</p>}
                            </div>
                            <div className={styles.assignCardRight}>
                              <div className={styles.circleChart}>
                                <svg width="64" height="64" viewBox="0 0 64 64">
                                  <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border)" strokeWidth="8"/>
                                  <circle cx="32" cy="32" r="26" fill="none"
                                    stroke={pct === 100 ? '#34d399' : '#2dd4bf'} strokeWidth="8"
                                    strokeDasharray={`${2 * Math.PI * 26 * pct / 100} ${2 * Math.PI * 26}`}
                                    strokeLinecap="round" transform="rotate(-90 32 32)"
                                  />
                                </svg>
                                <span className={styles.circleLabel}>{pct}%</span>
                              </div>
                            </div>
                          </div>
                          <div className={styles.assignCardMeta}>
                            <span>문제 {(a.problem_ids || []).length}개</span>
                            <span>·</span>
                            <span>마감 {a.due_date || '없음'}</span>
                            <span>·</span>
                            <span>{stats.fullyDone}명 완료 / {stats.partial}명 진행 중 / {stats.notStarted}명 미시작</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── 과제 상세 ── */}
            {tab === 'assignments' && selectedAssignment && (() => {
              const pids  = selectedAssignment.problem_ids || []
              const cols  = `140px repeat(${pids.length}, 1fr) 120px`
              return (
                <div className={styles.section}>
                  <button className={styles.backBtn} onClick={() => setSelectedAssignment(null)}>← 목록으로</button>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h1 className={styles.sectionTitle}>{selectedAssignment.title}</h1>
                      {selectedAssignment.description && <p className={styles.sectionSub}>{selectedAssignment.description}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <StatusDot status={assignmentStatus(selectedAssignment.due_date)} />
                      <button className={styles.deleteAssignBtn} onClick={() => handleDeleteAssignment(selectedAssignment.id)}>삭제</button>
                    </div>
                  </div>

                  <div className={styles.assignInfoBar}>
                    <span>📅 마감: <strong>{selectedAssignment.due_date || '없음'}</strong></span>
                    <span>📝 문제: <strong>{pids.length}개</strong></span>
                    <span>👥 학생: <strong>{students.length}명</strong></span>
                  </div>

                  <div className={styles.card} style={{ marginBottom: 20 }}>
                    <h2 className={styles.cardTitle}>문제별 정답률</h2>
                    <div className={styles.problemStatList}>
                      {pids.map(pid => {
                        const prob    = allProblems.find(p => p.id === pid)
                        const acCount = students.filter(s => subRows.some(r => r.user_id === s.id && r.problem_id === pid && r.status === 'accepted')).length
                        const pct     = students.length ? Math.round((acCount / students.length) * 100) : 0
                        return (
                          <div key={pid} className={styles.problemStatRow}>
                            <span className={styles.problemStatTitle}>{prob?.title || `#${pid}`}</span>
                            <div className={styles.problemStatBar}>
                              <div className={styles.problemStatFill} style={{ width: `${pct}%`, background: pct >= 70 ? '#34d399' : pct >= 40 ? '#fbbf24' : '#f87171' }} />
                            </div>
                            <span className={styles.problemStatPct}>{acCount}/{students.length}명 ({pct}%)</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className={styles.card}>
                    <h2 className={styles.cardTitle}>학생별 제출 현황</h2>
                    <div className={styles.submissionTable}>
                      <div className={styles.subTableHead} style={{ gridTemplateColumns: cols }}>
                        <span>학생</span>
                        {pids.map(pid => <span key={pid}>{allProblems.find(p => p.id === pid)?.title || `#${pid}`}</span>)}
                        <span>진행도</span>
                      </div>
                      {students.map(student => {
                        const done = studentDone(student, selectedAssignment)
                        const acc  = new Set(subRows.filter(r => r.user_id === student.id && r.status === 'accepted').map(r => r.problem_id))
                        return (
                          <div key={student.id} className={styles.subTableRow} style={{ gridTemplateColumns: cols }}>
                            <span className={styles.miniUser}>
                              <span className={styles.miniAvatar}>{student.username[0].toUpperCase()}</span>
                              {student.username}
                            </span>
                            {pids.map(pid => (
                              <span key={pid} className={styles.subCell}>
                                {acc.has(pid)
                                  ? <span className={styles.acBadge}>정답</span>
                                  : <span className={styles.noneBadge}>—</span>}
                              </span>
                            ))}
                            <span className={styles.progressCell}>
                              <div className={styles.miniBar}>
                                <div style={{ width: `${pids.length ? Math.round(done / pids.length * 100) : 0}%`, height: '100%', background: done === pids.length && pids.length > 0 ? '#34d399' : '#2dd4bf', borderRadius: 3 }} />
                              </div>
                              <span className={styles.monoVal}>{done}/{pids.length}</span>
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* ── 과제 출제 ── */}
            {tab === 'new-assignment' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h1 className={styles.sectionTitle}>새 과제 출제</h1>
                </div>
                <form className={styles.assignForm} onSubmit={handleCreateAssignment}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>과제 제목 <span className={styles.required}>*</span></label>
                    <input className={styles.formInput} type="text" placeholder="예: 3주차 과제 — 동적 프로그래밍"
                      value={newAssignment.title} onChange={e => setNewAssignment(p => ({ ...p, title: e.target.value }))} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>설명</label>
                    <textarea className={styles.formTextarea} placeholder="학생들에게 보여줄 설명..."
                      value={newAssignment.description} onChange={e => setNewAssignment(p => ({ ...p, description: e.target.value }))} rows={3} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>마감일</label>
                    <input className={styles.formInput} type="date"
                      value={newAssignment.dueDate} onChange={e => setNewAssignment(p => ({ ...p, dueDate: e.target.value }))} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      문제 선택 <span className={styles.required}>*</span>
                      <span className={styles.formHint}>{newAssignment.problems.length}개 선택됨</span>
                    </label>
                    <div className={styles.problemSelect}>
                      {allProblems.map(p => {
                        const selected = newAssignment.problems.includes(p.id)
                        return (
                          <div key={p.id}
                            className={`${styles.problemOption} ${selected ? styles.problemSelected : ''}`}
                            onClick={() => setNewAssignment(prev => ({
                              ...prev,
                              problems: prev.problems.includes(p.id)
                                ? prev.problems.filter(x => x !== p.id)
                                : [...prev.problems, p.id],
                            }))}
                          >
                            <span className={styles.problemOptionCheck}>{selected ? '✓' : ''}</span>
                            <div className={styles.problemOptionInfo}>
                              <span className={styles.problemOptionTitle}>{p.title}</span>
                              <div className={styles.problemOptionMeta}>
                                <span className={`${styles.diffSmall} ${styles[p.difficulty]}`}>
                                  {p.difficulty === 'easy' ? '쉬움' : p.difficulty === 'medium' ? '보통' : '어려움'}
                                </span>
                                {(p.tags || []).slice(0, 2).map(t => <span key={t} className={styles.tagSmall}>{t}</span>)}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className={styles.formActions}>
                    <button type="button" className={styles.cancelBtn} onClick={() => setTab('assignments')}>취소</button>
                    <button type="submit" className={styles.submitBtn}
                      disabled={submitting || !newAssignment.problems.length || !newAssignment.title.trim()}>
                      {submitting ? '저장 중...' : '과제 출제하기'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
