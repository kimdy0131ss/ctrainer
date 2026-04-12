import { useState, useEffect, useRef, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { PROBLEMS } from '../data/problems'
import { supabase } from '../supabaseClient'
import { ThemeContext } from '../App'
import DifficultyBadge from '../components/judge/DifficultyBadge'
import styles from './ProblemDetail.module.css'

function normalizeDB(p) {
  return {
    id: p.id,
    title: p.title || '',
    difficulty: p.difficulty || 'easy',
    tags: Array.isArray(p.tags) ? p.tags : [],
    acceptance: p.acceptance || 0,
    submissions: p.submissions || 0,
    solved: false,
    description: p.description || '',
    examples: Array.isArray(p.examples) ? p.examples : [],
    constraints: Array.isArray(p.constraints) ? p.constraints : [],
    starterCode: { c: p.starter_c || '' },
    testCases: Array.isArray(p.test_cases) ? p.test_cases : [],
  }
}

async function runCode(code, stdin) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20000)
  try {
    const res = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        compiler: 'gcc-head',
        code,
        stdin,
        options: '',
        'compiler-option-raw': '-x c -O2 -lm',
      }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

function normalizeOut(s) {
  return (s || '').replace(/\r\n/g, '\n').trim()
}

function parseResult(result, expected) {
  const compileErr = normalizeOut(result.compiler_error)
  const programErr = normalizeOut(result.program_error)
  const programOut = normalizeOut(result.program_output)
  const status = String(result.status ?? '0')

  if (compileErr) return { passed: false, label: '컴파일 오류', detail: compileErr }
  if (status !== '0' && programErr) return { passed: false, label: '런타임 오류', detail: programErr }

  const exp = normalizeOut(expected)
  const passed = programOut === exp
  return {
    passed,
    label: passed ? '정답' : '오답',
  }
}

export default function ProblemDetail() {
  const theme = useContext(ThemeContext)
  const { id } = useParams()
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [verdict, setVerdict] = useState(null)
  const [running, setRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [testResults, setTestResults] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isSolved, setIsSolved] = useState(false)
  const [submissionHistory, setSubmissionHistory] = useState([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || null)
    })
  }, [])

  const loadSubmissionHistory = async (uid, pid) => {
    if (!uid) return
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', uid)
      .eq('problem_id', pid)
      .order('submitted_at', { ascending: false })
      .limit(20)
    setSubmissionHistory(data || [])
  }

  const checkSolved = async (uid, pid) => {
    if (!uid) return
    const { data } = await supabase
      .from('solved_problems')
      .select('id')
      .eq('user_id', uid)
      .eq('problem_id', pid)
      .single()
    setIsSolved(!!data)
  }

  useEffect(() => {
    setCode('')
    setVerdict(null)
    setTestResults(null)
    setLoading(true)
    setIsSolved(false)
    setSubmissionHistory([])
    const load = async () => {
      const { data } = await supabase
        .from('problems').select('*').eq('id', Number(id)).single()
      setProblem(data ? normalizeDB(data) : (PROBLEMS.find(p => p.id === Number(id)) || null))
      setLoading(false)
    }
    load()
  }, [id])

  useEffect(() => {
    if (userId && id) {
      checkSolved(userId, Number(id))
      loadSubmissionHistory(userId, Number(id))
    }
  }, [userId, id])

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>불러오는 중...</div>
  if (!problem) return (
    <div className={styles.notFound}>
      <p>문제를 찾을 수 없습니다.</p>
      <Link to="/problems" className={styles.backLink}>← 문제 목록으로</Link>
    </div>
  )

  const starterCode = problem.starterCode?.c || '#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}'
  const currentCode = code || starterCode

  const handleRun = async () => {
    setRunning(true)
    setVerdict(null)
    setTestResults(null)
    const tc = problem.testCases?.[0]
    if (!tc) {
      setVerdict({ label: '테스트케이스가 없습니다.', color: '#fbbf24' })
      setRunning(false)
      return
    }
    try {
      const result = await runCode(currentCode, tc.input)
      const r = parseResult(result, tc.expected)
      let label
      if (r.passed) label = `예시 테스트 통과 ✓   출력: ${normalizeOut(result.program_output)}`
      else label = `${r.label}: ${r.detail}`
      setVerdict({ label, color: r.passed ? '#34d399' : r.label === '컴파일 오류' ? '#fb923c' : '#f87171' })
    } catch (e) {
      setVerdict({
        label: e.name === 'AbortError' ? '시간 초과 (20초). 무한루프나 서버 지연이 원인일 수 있습니다.' : `오류: ${e.message}`,
        color: '#f87171',
      })
    }
    setRunning(false)
  }

  const handleSubmit = async () => {
    setRunning(true)
    setVerdict(null)
    setTestResults(null)
    if (!problem.testCases?.length) {
      setVerdict({ label: '테스트케이스가 없습니다.', color: '#fbbf24' })
      setRunning(false)
      return
    }
    const results = []
    let allPassed = false
    try {
      for (const tc of problem.testCases) {
        const result = await runCode(currentCode, tc.input)
        const r = parseResult(result, tc.expected)
        results.push(r)
        if (r.label === '컴파일 오류') break
      }
      setTestResults(results)
      const passed = results.filter(r => r.passed).length
      allPassed = passed === results.length
      setVerdict({
        label: allPassed
          ? `정답입니다!`
          : `오답입니다`,
        color: allPassed ? '#34d399' : '#f87171',
      })
    } catch (e) {
      setVerdict({
        label: e.name === 'AbortError' ? '시간 초과 (20초).' : `오류: ${e.message}`,
        color: '#f87171',
      })
    }

    // DB recording
    const pid = Number(id)
    if (userId) {
      const status = allPassed ? 'accepted' : (results.length > 0 && results[0].label === '컴파일 오류' ? 'compile_error' : 'wrong_answer')
      await supabase.from('submissions').insert([{
        user_id: userId,
        problem_id: pid,
        status,
        language: 'c',
        submitted_at: new Date().toISOString(),
      }])

      // Update problem stats
      const { data: prow } = await supabase
        .from('problems').select('submissions, solved_count').eq('id', pid).single()
      if (prow) {
        const newSubs = (prow.submissions || 0) + 1
        let newSolved = prow.solved_count || 0
        if (allPassed && !isSolved) {
          newSolved += 1
          await supabase.from('solved_problems').upsert([{ user_id: userId, problem_id: pid }], { onConflict: 'user_id,problem_id' })
          setIsSolved(true)
        }
        const newAcceptance = newSubs > 0 ? Math.round((newSolved / newSubs) * 1000) / 10 : 0
        await supabase.from('problems').update({
          submissions: newSubs,
          solved_count: newSolved,
          acceptance: newAcceptance,
        }).eq('id', pid)
      }

      loadSubmissionHistory(userId, pid)
    }

    setRunning(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <div className={styles.container}>
          <Link to="/problems" className={styles.breadLink}>문제</Link>
          <span className={styles.sep}>/</span>
          <span className={styles.breadCurrent}>{problem.title}</span>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* 왼쪽 */}
          <div className={styles.left}>
            <div className={styles.problemHeader}>
              <div className={styles.problemMeta}>
                <span className={styles.problemId}>#{problem.id}</span>
                <DifficultyBadge difficulty={problem.difficulty} />
                {isSolved && (
                  <span className={styles.solvedBadge}>✓ 풀었음</span>
                )}
              </div>
              <h1 className={styles.problemTitle}>{problem.title}</h1>
              <div className={styles.tagList}>
                {problem.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
              </div>
            </div>

            <div className={styles.tabs}>
              <button className={`${styles.tab} ${activeTab === 'description' ? styles.tabActive : ''}`} onClick={() => setActiveTab('description')}>문제 설명</button>
              <button className={`${styles.tab} ${activeTab === 'submissions' ? styles.tabActive : ''}`} onClick={() => setActiveTab('submissions')}>제출 내역</button>
            </div>

            {activeTab === 'description' ? (
              <div className={styles.content}>
                <p className={styles.description}>{problem.description}</p>

                <div className={styles.examples}>
                  {problem.examples.map((ex, i) => (
                    <div key={i} className={styles.example}>
                      <span className={styles.exLabel}>예시 {i + 1}</span>
                      <div className={styles.exBlock}>
                        <div className={styles.exRow}><span className={styles.exKey}>입력:</span><code className={styles.exCode}>{ex.input}</code></div>
                        <div className={styles.exRow}><span className={styles.exKey}>출력:</span><code className={styles.exCode}>{ex.output}</code></div>
                        {ex.explanation && <div className={styles.exRow}><span className={styles.exKey}>설명:</span><span className={styles.exText}>{ex.explanation}</span></div>}
                      </div>
                    </div>
                  ))}
                </div>

                {problem.constraints.length > 0 && (
                  <div className={styles.constraints}>
                    <span className={styles.constraintTitle}>제약 조건</span>
                    <ul className={styles.constraintList}>
                      {problem.constraints.map((c, i) => <li key={i}><code className={styles.constraintCode}>{c}</code></li>)}
                    </ul>
                  </div>
                )}

                <div className={styles.stats}>
                  <div className={styles.statItem}><span className={styles.statLabel}>정답률</span><span className={styles.statVal}>{problem.acceptance}%</span></div>
                  <div className={styles.statItem}><span className={styles.statLabel}>제출 수</span><span className={styles.statVal}>{problem.submissions.toLocaleString()}</span></div>
                </div>
              </div>
            ) : (
              <div className={styles.submissionsTab}>
                <div className={styles.subHeader}><span>결과</span><span>언어</span><span>제출 시각</span></div>
                {submissionHistory.length === 0 ? (
                  <div style={{ padding: '24px 0', color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>제출 내역이 없습니다.</div>
                ) : submissionHistory.map((s, i) => {
                  const statusMap = {
                    accepted: { label: '정답', color: '#34d399' },
                    wrong_answer: { label: '오답', color: '#f87171' },
                    compile_error: { label: '컴파일 오류', color: '#fb923c' },
                    time_limit: { label: '시간 초과', color: '#fbbf24' },
                  }
                  const st = statusMap[s.status] || { label: s.status, color: '#94a3b8' }
                  const date = new Date(s.submitted_at).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                  return (
                    <div key={i} className={styles.subRow}>
                      <span style={{ color: st.color, fontWeight: 500, fontSize: 13 }}>{st.label}</span>
                      <span className={styles.subMeta}>{(s.language || 'C').toUpperCase()}</span>
                      <span className={styles.subMeta}>{date}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 오른쪽: 에디터 */}
          <div className={styles.right}>
            <div className={styles.editorPanel}>
              <div className={styles.editorToolbar}>
                <div className={styles.langTabs}>
                  <button className={`${styles.langTab} ${styles.langActive}`}>C</button>
                </div>
                <button className={styles.resetBtn} onClick={() => setCode(starterCode)}>초기화</button>
              </div>

              <div className={styles.monacoWrap}>
                <Editor
                  height="100%"
                  language="c"
                  theme={theme === 'light' ? 'vs-light' : 'vs-dark'}
                  value={currentCode}
                  onChange={val => setCode(val || '')}
                  options={{
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono','Fira Code','Consolas',monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    padding: { top: 12, bottom: 12 },
                    lineNumbersMinChars: 3,
                    renderLineHighlight: 'line',
                    wordWrap: 'off',
                    tabSize: 4,
                    automaticLayout: true,
                  }}
                />
              </div>

              {verdict && (
                <div className={styles.verdict} style={{ borderColor: verdict.color + '40', background: verdict.color + '10' }}>
                  <span className={styles.verdictDot} style={{ background: verdict.color }} />
                  <span className={styles.verdictLabel} style={{ color: verdict.color, whiteSpace: 'pre-wrap' }}>{verdict.label}</span>
                </div>
              )}

              {running && (
                <div className={styles.running}>
                  <div className={styles.spinner} />
                  <span>채점 중...</span>
                </div>
              )}

              <div className={styles.editorActions}>
                <button className={styles.runBtn} onClick={handleRun} disabled={running}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polygon points="3,1 13,7 3,13" fill="currentColor"/></svg>
                  실행
                </button>
                <button className={styles.submitBtn} onClick={handleSubmit} disabled={running}>제출</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
