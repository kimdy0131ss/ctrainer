import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STUDENTS, ASSIGNMENTS, CLASS_INFO } from '../data/teacher'
import { PROBLEMS } from '../data/problems'
import styles from './Teacher.module.css'

function getAssignmentStats(assignment) {
  const total = Object.keys(assignment.submissions).length
  const fullyDone = Object.values(assignment.submissions).filter(subs => {
    return assignment.problems.every(pid => subs[pid] === 'ac')
  }).length
  const partial = Object.values(assignment.submissions).filter(subs => {
    const any = assignment.problems.some(pid => subs[pid] === 'ac')
    const all = assignment.problems.every(pid => subs[pid] === 'ac')
    return any && !all
  }).length
  return { total, fullyDone, partial, notStarted: total - fullyDone - partial }
}

function StatusDot({ status }) {
  const map = { active: ['활성', '#34d399'], upcoming: ['예정', '#fbbf24'], closed: ['종료', '#94a3b8'] }
  const [label, color] = map[status] || map.closed
  return (
    <span className={styles.statusDot} style={{ color, background: color + '18', border: `1px solid ${color}40` }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', marginRight: 5 }} />
      {label}
    </span>
  )
}

export default function Teacher() {
  const [tab, setTab] = useState('dashboard') // dashboard | students | assignments | new-assignment
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', problems: [] })
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [searchStudent, setSearchStudent] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const avgSolved = Math.round(STUDENTS.reduce((s, st) => s + st.solved, 0) / STUDENTS.length)
  const activeCount = STUDENTS.filter(s => {
    const d = new Date(s.lastActive)
    const diff = (new Date('2026-04-04') - d) / 86400000
    return diff <= 2
  }).length
  const activeAssignments = ASSIGNMENTS.filter(a => a.status === 'active').length

  const filteredStudents = STUDENTS.filter(s =>
    s.name.includes(searchStudent) || s.username.includes(searchStudent)
  )

  const handleSubmitAssignment = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setTab('assignments')
      setNewAssignment({ title: '', description: '', dueDate: '', problems: [] })
    }, 1500)
  }

  const toggleProblem = (pid) => {
    setNewAssignment(prev => ({
      ...prev,
      problems: prev.problems.includes(pid)
        ? prev.problems.filter(p => p !== pid)
        : [...prev.problems, pid]
    }))
  }

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.classInfo}>
          <div className={styles.classIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="12" rx="2" stroke="url(#tGrad)" strokeWidth="1.5"/>
              <path d="M6 8h8M6 12h5" stroke="url(#tGrad)" strokeWidth="1.5" strokeLinecap="round"/>
              <defs>
                <linearGradient id="tGrad" x1="2" y1="4" x2="18" y2="16" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2dd4bf"/><stop offset="100%" stopColor="#a78bfa"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div className={styles.className}>{CLASS_INFO.name}</div>
            <div className={styles.classSub}>{CLASS_INFO.semester}</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {[
            { id: 'dashboard', icon: '⬡', label: '대시보드' },
            { id: 'students', icon: '◈', label: '학생 관리' },
            { id: 'assignments', icon: '◻', label: '과제 관리' },
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
          <div className={styles.teacherAvatar}>홍</div>
          <div>
            <div className={styles.teacherName}>{CLASS_INFO.teacher}</div>
            <div className={styles.teacherRole}>교사</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {/* ── 대시보드 ── */}
        {tab === 'dashboard' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>대시보드</h1>
              <span className={styles.sectionDate}>2026년 4월 4일</span>
            </div>

            {/* 통계 카드 */}
            <div className={styles.statsGrid}>
              {[
                { label: '총 학생 수', value: STUDENTS.length, unit: '명', color: '#2dd4bf' },
                { label: '오늘 접속', value: activeCount, unit: '명', color: '#34d399' },
                { label: '평균 해결 문제', value: avgSolved, unit: '문제', color: '#a78bfa' },
                { label: '진행 중 과제', value: activeAssignments, unit: '개', color: '#fbbf24' },
              ].map(stat => (
                <div key={stat.label} className={styles.statCard}>
                  <div className={styles.statTop}>
                    <span className={styles.statLabel}>{stat.label}</span>
                    <span className={styles.statDot} style={{ background: stat.color }} />
                  </div>
                  <div className={styles.statBottom}>
                    <span className={styles.statValue} style={{ color: stat.color }}>{stat.value}</span>
                    <span className={styles.statUnit}>{stat.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 학생 활동 현황 */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>학생 활동 현황</h2>
                <button className={styles.cardLink} onClick={() => setTab('students')}>전체 보기 →</button>
              </div>
              <div className={styles.miniTable}>
                <div className={styles.miniTableHead}>
                  <span>학생</span><span>해결</span><span>연속</span><span>최근 접속</span><span>상태</span>
                </div>
                {STUDENTS.slice(0, 5).map(s => {
                  const diff = Math.floor((new Date('2026-04-04') - new Date(s.lastActive)) / 86400000)
                  const isActive = diff <= 2
                  return (
                    <div key={s.id} className={styles.miniTableRow} onClick={() => { setSelectedStudent(s); setTab('students') }}>
                      <span className={styles.miniUser}>
                        <span className={styles.miniAvatar}>{s.avatar}</span>
                        {s.name}
                      </span>
                      <span className={styles.monoVal}>{s.solved}</span>
                      <span className={styles.monoVal}>{s.streak}일</span>
                      <span className={styles.monoVal}>{diff === 0 ? '오늘' : `${diff}일 전`}</span>
                      <span className={styles.activeBadge} style={{ color: isActive ? '#34d399' : '#94a3b8', background: isActive ? 'rgba(52,211,153,0.1)' : 'rgba(148,163,184,0.1)' }}>
                        {isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 과제 현황 */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>진행 중인 과제</h2>
                <button className={styles.cardLink} onClick={() => setTab('assignments')}>전체 보기 →</button>
              </div>
              {ASSIGNMENTS.filter(a => a.status === 'active').map(a => {
                const stats = getAssignmentStats(a)
                const pct = Math.round((stats.fullyDone / stats.total) * 100)
                return (
                  <div key={a.id} className={styles.assignmentRow} onClick={() => { setSelectedAssignment(a); setTab('assignments') }}>
                    <div className={styles.assignRowTop}>
                      <span className={styles.assignTitle}>{a.title}</span>
                      <StatusDot status={a.status} />
                    </div>
                    <div className={styles.assignMeta}>
                      <span>마감: {a.dueDate}</span>
                      <span>{stats.fullyDone}/{stats.total}명 완료</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                    </div>
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
              <span className={styles.sectionSub}>총 {STUDENTS.length}명</span>
            </div>

            <div className={styles.searchBar}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="이름 또는 아이디 검색..."
                value={searchStudent}
                onChange={e => setSearchStudent(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.studentGrid}>
              {filteredStudents.map(s => {
                const diff = Math.floor((new Date('2026-04-04') - new Date(s.lastActive)) / 86400000)
                const isActive = diff <= 2
                const pct = Math.min(100, Math.round((s.solved / PROBLEMS.length) * 100))
                return (
                  <div key={s.id} className={styles.studentCard} onClick={() => setSelectedStudent(s)}>
                    <div className={styles.studentCardTop}>
                      <div className={styles.studentAvatar}>{s.avatar}</div>
                      <span className={styles.activeBadge} style={{ color: isActive ? '#34d399' : '#94a3b8', background: isActive ? 'rgba(52,211,153,0.1)' : 'rgba(148,163,184,0.1)' }}>
                        {isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                    <div className={styles.studentName}>{s.name}</div>
                    <div className={styles.studentHandle}>@{s.username}</div>
                    <div className={styles.studentStats}>
                      <div className={styles.sStatItem}>
                        <span className={styles.sStatVal}>{s.solved}</span>
                        <span className={styles.sStatKey}>해결</span>
                      </div>
                      <div className={styles.sStatItem}>
                        <span className={styles.sStatVal}>{s.score.toLocaleString()}</span>
                        <span className={styles.sStatKey}>점수</span>
                      </div>
                      <div className={styles.sStatItem}>
                        <span className={styles.sStatVal}>{s.streak}일</span>
                        <span className={styles.sStatKey}>연속</span>
                      </div>
                    </div>
                    <div className={styles.solveProgress}>
                      <div className={styles.solveBar}>
                        <div className={styles.solveFill} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={styles.solvePct}>{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── 학생 상세 ── */}
        {tab === 'students' && selectedStudent && (
          <div className={styles.section}>
            <button className={styles.backBtn} onClick={() => setSelectedStudent(null)}>← 목록으로</button>
            <div className={styles.studentDetailHeader}>
              <div className={styles.detailAvatar}>{selectedStudent.avatar}</div>
              <div>
                <h1 className={styles.detailName}>{selectedStudent.name}</h1>
                <div className={styles.detailHandle}>@{selectedStudent.username} · {selectedStudent.grade}</div>
                <div className={styles.detailEmail}>{selectedStudent.email}</div>
              </div>
            </div>

            <div className={styles.statsGrid}>
              {[
                { label: '해결 문제', value: selectedStudent.solved, unit: '문제', color: '#2dd4bf' },
                { label: '총 점수', value: selectedStudent.score.toLocaleString(), unit: '점', color: '#a78bfa' },
                { label: '연속 도전', value: selectedStudent.streak, unit: '일', color: '#fbbf24' },
                { label: '가입일', value: selectedStudent.joinedAt, unit: '', color: '#94a3b8', small: true },
              ].map(stat => (
                <div key={stat.label} className={styles.statCard}>
                  <div className={styles.statTop}>
                    <span className={styles.statLabel}>{stat.label}</span>
                    <span className={styles.statDot} style={{ background: stat.color }} />
                  </div>
                  <div className={styles.statBottom}>
                    <span className={styles.statValue} style={{ color: stat.color, fontSize: stat.small ? 16 : undefined }}>{stat.value}</span>
                    <span className={styles.statUnit}>{stat.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>과제별 제출 현황</h2>
              {ASSIGNMENTS.filter(a => a.status !== 'upcoming').map(a => {
                const subs = a.submissions[selectedStudent.id] || {}
                const done = a.problems.filter(pid => subs[pid] === 'ac').length
                return (
                  <div key={a.id} className={styles.assignDetailRow}>
                    <div className={styles.assignRowTop}>
                      <span className={styles.assignTitle}>{a.title}</span>
                      <span className={styles.monoVal}>{done}/{a.problems.length}</span>
                    </div>
                    <div className={styles.problemChips}>
                      {a.problems.map(pid => {
                        const prob = PROBLEMS.find(p => p.id === pid)
                        const status = subs[pid]
                        return (
                          <div key={pid} className={`${styles.problemChip} ${styles[status || 'none']}`}>
                            <span className={styles.chipStatus}>
                              {status === 'ac' ? '✓' : status === 'wa' ? '✗' : '—'}
                            </span>
                            <span className={styles.chipTitle}>{prob?.title}</span>
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

            <div className={styles.assignmentList}>
              {ASSIGNMENTS.map(a => {
                const stats = getAssignmentStats(a)
                const pct = a.status === 'upcoming' ? 0 : Math.round((stats.fullyDone / stats.total) * 100)
                return (
                  <div key={a.id} className={styles.assignCard} onClick={() => setSelectedAssignment(a)}>
                    <div className={styles.assignCardTop}>
                      <div className={styles.assignCardLeft}>
                        <StatusDot status={a.status} />
                        <h3 className={styles.assignCardTitle}>{a.title}</h3>
                        <p className={styles.assignCardDesc}>{a.description}</p>
                      </div>
                      <div className={styles.assignCardRight}>
                        <div className={styles.circleChart}>
                          <svg width="64" height="64" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
                            <circle cx="32" cy="32" r="26" fill="none"
                              stroke={pct === 100 ? '#34d399' : '#2dd4bf'}
                              strokeWidth="8"
                              strokeDasharray={`${2*Math.PI*26*pct/100} ${2*Math.PI*26}`}
                              strokeLinecap="round"
                              transform="rotate(-90 32 32)"
                            />
                          </svg>
                          <span className={styles.circleLabel}>{pct}%</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.assignCardMeta}>
                      <span>문제 {a.problems.length}개</span>
                      <span>·</span>
                      <span>마감 {a.dueDate}</span>
                      <span>·</span>
                      <span>{stats.fullyDone}명 완료 / {stats.partial}명 진행 중 / {stats.notStarted}명 미시작</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── 과제 상세 ── */}
        {tab === 'assignments' && selectedAssignment && (
          <div className={styles.section}>
            <button className={styles.backBtn} onClick={() => setSelectedAssignment(null)}>← 목록으로</button>
            <div className={styles.sectionHeader}>
              <div>
                <h1 className={styles.sectionTitle}>{selectedAssignment.title}</h1>
                <p className={styles.sectionSub}>{selectedAssignment.description}</p>
              </div>
              <StatusDot status={selectedAssignment.status} />
            </div>

            <div className={styles.assignInfoBar}>
              <span>📅 마감: <strong>{selectedAssignment.dueDate}</strong></span>
              <span>📝 문제: <strong>{selectedAssignment.problems.length}개</strong></span>
              <span>👥 대상: <strong>{STUDENTS.length}명</strong></span>
            </div>

            {/* 문제별 현황 */}
            <div className={styles.card} style={{ marginBottom: 20 }}>
              <h2 className={styles.cardTitle}>문제별 정답률</h2>
              <div className={styles.problemStatList}>
                {selectedAssignment.problems.map(pid => {
                  const prob = PROBLEMS.find(p => p.id === pid)
                  const acCount = Object.values(selectedAssignment.submissions).filter(s => s[pid] === 'ac').length
                  const pct = Math.round((acCount / STUDENTS.length) * 100)
                  return (
                    <div key={pid} className={styles.problemStatRow}>
                      <span className={styles.problemStatTitle}>{prob?.title}</span>
                      <div className={styles.problemStatBar}>
                        <div className={styles.problemStatFill} style={{ width: `${pct}%`, background: pct >= 70 ? '#34d399' : pct >= 40 ? '#fbbf24' : '#f87171' }} />
                      </div>
                      <span className={styles.problemStatPct}>{acCount}/{STUDENTS.length}명 ({pct}%)</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 학생별 현황 */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>학생별 제출 현황</h2>
              <div className={styles.submissionTable}>
                <div className={styles.subTableHead}>
                  <span>학생</span>
                  {selectedAssignment.problems.map(pid => {
                    const prob = PROBLEMS.find(p => p.id === pid)
                    return <span key={pid}>{prob?.title}</span>
                  })}
                  <span>진행도</span>
                </div>
                {STUDENTS.map(student => {
                  const subs = selectedAssignment.submissions[student.id] || {}
                  const done = selectedAssignment.problems.filter(pid => subs[pid] === 'ac').length
                  const total = selectedAssignment.problems.length
                  return (
                    <div key={student.id} className={styles.subTableRow}>
                      <span className={styles.miniUser}>
                        <span className={styles.miniAvatar}>{student.avatar}</span>
                        {student.name}
                      </span>
                      {selectedAssignment.problems.map(pid => {
                        const s = subs[pid]
                        return (
                          <span key={pid} className={styles.subCell}>
                            {s === 'ac' ? <span className={styles.acBadge}>정답</span>
                             : s === 'wa' ? <span className={styles.waBadge}>오답</span>
                             : <span className={styles.noneBadge}>—</span>}
                          </span>
                        )
                      })}
                      <span className={styles.progressCell}>
                        <div className={styles.miniBar}>
                          <div style={{ width: `${(done/total)*100}%`, height: '100%', background: done === total ? '#34d399' : '#2dd4bf', borderRadius: 3, transition: 'width 0.4s' }} />
                        </div>
                        <span className={styles.monoVal}>{done}/{total}</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── 과제 출제 ── */}
        {tab === 'new-assignment' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>새 과제 출제</h1>
            </div>

            <form className={styles.assignForm} onSubmit={handleSubmitAssignment}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>과제 제목 <span className={styles.required}>*</span></label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="예: 3주차 과제 — 동적 프로그래밍"
                  value={newAssignment.title}
                  onChange={e => setNewAssignment(p => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>설명</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="학생들에게 보여줄 과제 설명을 입력하세요..."
                  value={newAssignment.description}
                  onChange={e => setNewAssignment(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>마감일 <span className={styles.required}>*</span></label>
                <input
                  className={styles.formInput}
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={e => setNewAssignment(p => ({ ...p, dueDate: e.target.value }))}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  문제 선택 <span className={styles.required}>*</span>
                  <span className={styles.formHint}>{newAssignment.problems.length}개 선택됨</span>
                </label>
                <div className={styles.problemSelect}>
                  {PROBLEMS.map(p => {
                    const selected = newAssignment.problems.includes(p.id)
                    return (
                      <div
                        key={p.id}
                        className={`${styles.problemOption} ${selected ? styles.problemSelected : ''}`}
                        onClick={() => toggleProblem(p.id)}
                      >
                        <span className={styles.problemOptionCheck}>
                          {selected ? '✓' : ''}
                        </span>
                        <div className={styles.problemOptionInfo}>
                          <span className={styles.problemOptionTitle}>{p.title}</span>
                          <div className={styles.problemOptionMeta}>
                            <span className={`${styles.diffSmall} ${styles[p.difficulty]}`}>
                              {p.difficulty === 'easy' ? '쉬움' : p.difficulty === 'medium' ? '보통' : '어려움'}
                            </span>
                            {p.tags.slice(0, 2).map(t => (
                              <span key={t} className={styles.tagSmall}>{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setTab('assignments')}>취소</button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitted || newAssignment.problems.length === 0}
                >
                  {submitted ? '✓ 과제 출제 완료!' : '과제 출제하기'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
