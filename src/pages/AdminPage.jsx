import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { PROBLEMS as LOCAL_PROBLEMS } from '../data/problems'
import styles from './AdminPage.module.css'

const EMPTY_FORM = {
  title: '',
  difficulty: 'easy',
  tags: '',
  description: '',
  examples: '[{"input":"","output":"","explanation":""}]',
  constraints: '',
  starter_c: '',
  test_cases: '[{"input":"","expected":""}]',
  acceptance: 0,
  submissions: 0,
}

function localToRow(p) {
  return {
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    tags: p.tags,
    description: p.description,
    examples: p.examples,
    constraints: p.constraints,
    starter_c: p.starterCode?.c || '',
    test_cases: p.testCases || [],
    acceptance: p.acceptance,
    submissions: p.submissions,
    _source: 'local',
  }
}

function dbToRow(p) {
  return { ...p, _source: 'supabase' }
}

export default function AdminPage({ isAdmin }) {
  const navigate = useNavigate()
  const [mainTab, setMainTab] = useState('problems')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  // User management
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data?.user?.id || null))
  }, [])

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return }
    loadAll()
  }, [isAdmin])

  const loadUsers = async () => {
    setUsersLoading(true)
    const { data } = await supabase.from('profiles').select('id, username, is_admin, is_teacher').order('username')
    setUsers(data || [])
    setUsersLoading(false)
  }

  useEffect(() => {
    if (isAdmin && mainTab === 'users') loadUsers()
  }, [isAdmin, mainTab])

  const toggleTeacher = async (user) => {
    await supabase.from('profiles').update({ is_teacher: !user.is_teacher }).eq('id', user.id)
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_teacher: !u.is_teacher } : u))
  }

  const toggleAdmin = async (user) => {
    await supabase.from('profiles').update({ is_admin: !user.is_admin }).eq('id', user.id)
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_admin: !u.is_admin } : u))
  }

  const deleteUser = async (user) => {
    if (!window.confirm(`"${user.username}" 유저를 삭제하시겠습니까?\n제출 내역, 풀이 기록이 모두 삭제됩니다.`)) return
    const { error } = await supabase.rpc('delete_user', { target_user_id: user.id })
    if (error) { setMsg({ type: 'error', text: '삭제 실패: ' + error.message }); return }
    setUsers(prev => prev.filter(u => u.id !== user.id))
    setMsg({ type: 'success', text: `"${user.username}" 유저가 삭제되었습니다.` })
  }

  const loadAll = async () => {
    setLoading(true)
    const { data } = await supabase.from('problems').select('*').order('id', { ascending: true })
    const dbRows = (data || []).map(dbToRow)
    const dbIds = new Set(dbRows.map(r => r.id))
    const visibleDbRows = dbRows.filter(r => !r.hidden)
    const localRows = LOCAL_PROBLEMS.filter(p => !dbIds.has(p.id)).map(localToRow)
    setRows([...visibleDbRows, ...localRows].sort((a, b) => a.id - b.id))
    setLoading(false)
  }

  const openNew = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setMsg(null)
    setShowForm(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({
      title: row.title || '',
      difficulty: row.difficulty || 'easy',
      tags: Array.isArray(row.tags) ? row.tags.join(', ') : (row.tags || ''),
      description: row.description || '',
      examples: typeof row.examples === 'string' ? row.examples : JSON.stringify(row.examples || []),
      constraints: Array.isArray(row.constraints) ? row.constraints.join('\n') : (row.constraints || ''),
      starter_c: row.starter_c || row.starterCode?.c || '',
      test_cases: typeof row.test_cases === 'string' ? row.test_cases : JSON.stringify(row.test_cases || []),
      acceptance: row.acceptance || 0,
      submissions: row.submissions || 0,
    })
    setMsg(null)
    setShowForm(true)
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`"${row.title}" 문제를 삭제하시겠습니까?`)) return
    if (row._source === 'supabase') {
      const { error } = await supabase.from('problems').delete().eq('id', row.id)
      if (error) { setMsg({ type: 'error', text: '삭제 실패: ' + error.message }); return }
    } else {
      const { error } = await supabase.from('problems').upsert([{
        id: row.id, title: row.title, difficulty: row.difficulty, tags: row.tags,
        description: row.description, examples: row.examples, constraints: row.constraints,
        starter_c: row.starterCode?.c || '', test_cases: row.testCases || [],
        acceptance: row.acceptance, submissions: row.submissions, hidden: true,
      }])
      if (error) { setMsg({ type: 'error', text: '삭제 실패: ' + error.message }); return }
    }
    setRows(prev => prev.filter(r => r.id !== row.id))
    setMsg({ type: 'success', text: '삭제되었습니다.' })
  }

  const handleSave = async () => {
    if (!form.title.trim()) { setMsg({ type: 'error', text: '제목을 입력해 주세요.' }); return }

    let parsedExamples, parsedTestCases
    try {
      parsedExamples = JSON.parse(form.examples)
      parsedTestCases = JSON.parse(form.test_cases)
    } catch {
      setMsg({ type: 'error', text: '예시 또는 테스트케이스 JSON 형식 오류입니다.' })
      return
    }

    setSaving(true)
    setMsg(null)

    const payload = {
      title: form.title.trim(),
      difficulty: form.difficulty,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      description: form.description.trim(),
      examples: parsedExamples,
      constraints: form.constraints.split('\n').map(c => c.trim()).filter(Boolean),
      starter_c: form.starter_c,
      test_cases: parsedTestCases,
      acceptance: Number(form.acceptance) || 0,
      submissions: Number(form.submissions) || 0,
    }

    let error
    if (editingId) {
      const existing = rows.find(r => r.id === editingId)
      if (existing?._source === 'supabase') {
        const res = await supabase.from('problems').update(payload).eq('id', editingId)
        error = res.error
      } else {
        // 로컬 문제 → Supabase에 새로 삽입 (id 유지)
        const res = await supabase.from('problems').insert([{ ...payload, id: editingId }])
        error = res.error
      }
    } else {
      const res = await supabase.from('problems').insert([payload])
      error = res.error
    }

    if (error) {
      setMsg({ type: 'error', text: '저장 실패: ' + error.message })
    } else {
      setMsg({ type: 'success', text: '저장되었습니다.' })
      setShowForm(false)
      loadAll()
    }
    setSaving(false)
  }

  if (!isAdmin) return null

  const diffColor = { easy: '#34d399', medium: '#fbbf24', hard: '#f87171' }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>관리자</h1>
        <div className={styles.mainTabs}>
          <button className={`${styles.mainTab} ${mainTab === 'problems' ? styles.mainTabActive : ''}`} onClick={() => setMainTab('problems')}>문제 관리</button>
          <button className={`${styles.mainTab} ${mainTab === 'users' ? styles.mainTabActive : ''}`} onClick={() => setMainTab('users')}>유저 관리</button>
        </div>
        {mainTab === 'problems' && <button className={styles.addBtn} onClick={openNew}>+ 문제 추가</button>}
      </div>

      {msg && (
        <div className={`${styles.msg} ${msg.type === 'error' ? styles.msgError : styles.msgSuccess}`}>
          {msg.text}
        </div>
      )}

      {/* 유저 관리 탭 */}
      {mainTab === 'users' && (
        usersLoading ? <div className={styles.loading}>불러오는 중...</div> : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>유저네임</th>
                  <th>관리자</th>
                  <th>교사</th>
                  <th>관리자 권한</th>
                  <th>교사 권한</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className={styles.titleCol}>{user.username}</td>
                    <td>
                      {user.is_admin && (
                        <span style={{ fontSize:11, fontWeight:600, padding:'2px 7px', borderRadius:5, background:'rgba(239,68,68,0.15)', color:'#f87171' }}>ADMIN</span>
                      )}
                    </td>
                    <td>
                      {user.is_teacher && (
                        <span style={{ fontSize:11, fontWeight:600, padding:'2px 7px', borderRadius:5, background:'rgba(45,212,191,0.15)', color:'var(--accent-teal)' }}>교사</span>
                      )}
                    </td>
                    <td>
                      {user.id !== currentUserId && (
                        <button
                          className={user.is_admin ? styles.deleteBtn : styles.editBtn}
                          onClick={() => toggleAdmin(user)}
                        >
                          {user.is_admin ? '관리자 취소' : '관리자 부여'}
                        </button>
                      )}
                    </td>
                    <td>
                      {user.id !== currentUserId && (
                        <button
                          className={user.is_teacher ? styles.deleteBtn : styles.editBtn}
                          onClick={() => toggleTeacher(user)}
                        >
                          {user.is_teacher ? '권한 취소' : '교사 권한 부여'}
                        </button>
                      )}
                    </td>
                    <td>
                      {user.id !== currentUserId && (
                        <button className={styles.deleteBtn} onClick={() => deleteUser(user)}>
                          삭제
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {mainTab === 'problems' && loading ? (
        <div className={styles.loading}>불러오는 중...</div>
      ) : mainTab === 'problems' && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>제목</th>
                <th>난이도</th>
                <th>태그</th>
                <th>정답률</th>
                <th>출처</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={`${row._source}-${row.id}`}>
                  <td className={styles.idCol}>#{row.id}</td>
                  <td className={styles.titleCol}>{row.title}</td>
                  <td>
                    <span className={styles.diffBadge} style={{ color: diffColor[row.difficulty], borderColor: diffColor[row.difficulty] + '50' }}>
                      {row.difficulty}
                    </span>
                  </td>
                  <td className={styles.tagsCol}>
                    {(Array.isArray(row.tags) ? row.tags : []).slice(0, 3).map((t, i) => (
                      <span key={i} className={styles.tag}>{t}</span>
                    ))}
                  </td>
                  <td>{row.acceptance}%</td>
                  <td>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 5,
                      background: row._source === 'supabase' ? 'rgba(99,102,241,0.2)' : 'rgba(251,191,36,0.15)',
                      color: row._source === 'supabase' ? '#a5b4fc' : '#fbbf24',
                    }}>
                      {row._source === 'supabase' ? 'DB' : '로컬'}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => openEdit(row)}>수정</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(row)}>
                      {row._source === 'local' ? '숨기기' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mainTab === 'problems' && showForm && (
        <div className={styles.overlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? '문제 수정' : '문제 추가'}</h2>
              <button className={styles.closeBtn} onClick={() => setShowForm(false)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <label className={styles.label}>제목 *</label>
              <input className={styles.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />

              <label className={styles.label}>난이도</label>
              <select className={styles.input} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <label className={styles.label}>태그 (쉼표 구분)</label>
              <input className={styles.input} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Array, Hash Table" />

              <label className={styles.label}>문제 설명</label>
              <textarea className={styles.textarea} rows={5} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

              <label className={styles.label}>예시 (JSON 배열)</label>
              <textarea className={styles.textarea} rows={4} value={form.examples} onChange={e => setForm(f => ({ ...f, examples: e.target.value }))} placeholder='[{"input":"...","output":"...","explanation":"..."}]' />

              <label className={styles.label}>제약 조건 (줄바꿈 구분)</label>
              <textarea className={styles.textarea} rows={3} value={form.constraints} onChange={e => setForm(f => ({ ...f, constraints: e.target.value }))} />

              <div className={styles.row2}>
                <div>
                  <label className={styles.label}>정답률 (%)</label>
                  <input className={styles.input} type="number" value={form.acceptance} onChange={e => setForm(f => ({ ...f, acceptance: e.target.value }))} />
                </div>
                <div>
                  <label className={styles.label}>제출 수</label>
                  <input className={styles.input} type="number" value={form.submissions} onChange={e => setForm(f => ({ ...f, submissions: e.target.value }))} />
                </div>
              </div>

              <div className={styles.sectionTitle}>C 스타터 코드</div>
              <textarea className={styles.codeArea} rows={12} value={form.starter_c} onChange={e => setForm(f => ({ ...f, starter_c: e.target.value }))} placeholder="#include <stdio.h>&#10;&#10;int solution() {&#10;&#10;}&#10;&#10;int main() { ... }" />

              <div className={styles.sectionTitle}>테스트케이스 (JSON 배열)</div>
              <textarea className={styles.codeArea} rows={5} value={form.test_cases} onChange={e => setForm(f => ({ ...f, test_cases: e.target.value }))} placeholder='[{"input":"2\n1 2","expected":"3"}]' />
            </div>

            <div className={styles.modalFooter}>
              {msg && (
                <span className={msg.type === 'error' ? styles.msgError : styles.msgSuccess} style={{ fontSize: 13 }}>
                  {msg.text}
                </span>
              )}
              <button className={styles.cancelBtn} onClick={() => setShowForm(false)}>취소</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
