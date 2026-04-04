import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PROBLEMS } from '../data/problems'
import DifficultyBadge from '../components/judge/DifficultyBadge'
import styles from './ProblemDetail.module.css'

const LANGS = ['python', 'javascript', 'cpp']
const LANG_LABELS = { python: 'Python', javascript: 'JavaScript', cpp: 'C++' }

const VERDICTS = [
  { id: 'ac', label: '정답입니다!', color: '#34d399' },
  { id: 'wa', label: '오답입니다', color: '#f87171' },
  { id: 'tle', label: '시간 초과', color: '#fbbf24' },
  { id: 'mle', label: '메모리 초과', color: '#a78bfa' },
  { id: 'ce', label: '컴파일 오류', color: '#fb923c' },
]

export default function ProblemDetail() {
  const { id } = useParams()
  const problem = PROBLEMS.find(p => p.id === Number(id))

  const [lang, setLang] = useState('python')
  const [code, setCode] = useState('')
  const [verdict, setVerdict] = useState(null)
  const [running, setRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('description') // description | submissions

  if (!problem) {
    return (
      <div className={styles.notFound}>
        <p>문제를 찾을 수 없습니다.</p>
        <Link to="/problems" className={styles.backLink}>← 문제 목록으로</Link>
      </div>
    )
  }

  const starterCode = problem.starterCode[lang]

  const handleLangChange = (l) => {
    setLang(l)
    setCode('')
    setVerdict(null)
  }

  const handleSubmit = () => {
    setRunning(true)
    setVerdict(null)
    setTimeout(() => {
      const v = VERDICTS[Math.floor(Math.random() * VERDICTS.length)]
      setVerdict(v)
      setRunning(false)
    }, 1800)
  }

  const handleRun = () => {
    setRunning(true)
    setVerdict(null)
    setTimeout(() => {
      setVerdict({ id: 'run', label: '테스트 케이스 통과 (3/3)', color: '#34d399' })
      setRunning(false)
    }, 1200)
  }

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.container}>
          <Link to="/problems" className={styles.breadLink}>문제</Link>
          <span className={styles.sep}>/</span>
          <span className={styles.breadCurrent}>{problem.title}</span>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left: Problem info */}
          <div className={styles.left}>
            <div className={styles.problemHeader}>
              <div className={styles.problemMeta}>
                <span className={styles.problemId}>#{problem.id}</span>
                <DifficultyBadge difficulty={problem.difficulty} />
                {problem.solved && (
                  <span className={styles.solvedBadge}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6l2.5 2.5 4.5-5" stroke="var(--easy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    풀었음
                  </span>
                )}
              </div>
              <h1 className={styles.problemTitle}>{problem.title}</h1>
              <div className={styles.tagList}>
                {problem.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'description' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('description')}
              >
                문제 설명
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'submissions' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('submissions')}
              >
                제출 내역
              </button>
            </div>

            {activeTab === 'description' ? (
              <div className={styles.content}>
                <p className={styles.description}>{problem.description}</p>

                <div className={styles.examples}>
                  {problem.examples.map((ex, i) => (
                    <div key={i} className={styles.example}>
                      <span className={styles.exLabel}>예시 {i + 1}</span>
                      <div className={styles.exBlock}>
                        <div className={styles.exRow}>
                          <span className={styles.exKey}>입력:</span>
                          <code className={styles.exCode}>{ex.input}</code>
                        </div>
                        <div className={styles.exRow}>
                          <span className={styles.exKey}>출력:</span>
                          <code className={styles.exCode}>{ex.output}</code>
                        </div>
                        {ex.explanation && (
                          <div className={styles.exRow}>
                            <span className={styles.exKey}>설명:</span>
                            <span className={styles.exText}>{ex.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.constraints}>
                  <span className={styles.constraintTitle}>제약 조건</span>
                  <ul className={styles.constraintList}>
                    {problem.constraints.map((c, i) => (
                      <li key={i}><code className={styles.constraintCode}>{c}</code></li>
                    ))}
                  </ul>
                </div>

                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>정답률</span>
                    <span className={styles.statVal}>{problem.acceptance}%</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>제출 수</span>
                    <span className={styles.statVal}>{problem.submissions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.submissionsTab}>
                <div className={styles.subHeader}>
                  <span>결과</span>
                  <span>언어</span>
                  <span>실행 시간</span>
                  <span>메모리</span>
                </div>
                {[
                  { status: '정답', lang: 'Python', runtime: '48 ms', memory: '16.3 MB', color: '#34d399' },
                  { status: '오답', lang: 'Python', runtime: '—', memory: '—', color: '#f87171' },
                  { status: '정답', lang: 'C++', runtime: '4 ms', memory: '8.1 MB', color: '#34d399' },
                ].map((sub, i) => (
                  <div key={i} className={styles.subRow}>
                    <span style={{ color: sub.color, fontWeight: 500, fontSize: 13 }}>{sub.status}</span>
                    <span className={styles.subMeta}>{sub.lang}</span>
                    <span className={styles.subMeta}>{sub.runtime}</span>
                    <span className={styles.subMeta}>{sub.memory}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Editor */}
          <div className={styles.right}>
            <div className={styles.editorPanel}>
              <div className={styles.editorToolbar}>
                <div className={styles.langTabs}>
                  {LANGS.map(l => (
                    <button
                      key={l}
                      className={`${styles.langTab} ${lang === l ? styles.langActive : ''}`}
                      onClick={() => handleLangChange(l)}
                    >
                      {LANG_LABELS[l]}
                    </button>
                  ))}
                </div>
                <button className={styles.resetBtn} onClick={() => setCode('')}>초기화</button>
              </div>

              <div className={styles.editorWrap}>
                <div className={styles.lineNums}>
                  {(code || starterCode).split('\n').map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <textarea
                  className={styles.editor}
                  value={code || starterCode}
                  onChange={e => setCode(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>

              {verdict && (
                <div className={styles.verdict} style={{ borderColor: verdict.color + '40', background: verdict.color + '10' }}>
                  <span className={styles.verdictDot} style={{ background: verdict.color }} />
                  <span className={styles.verdictLabel} style={{ color: verdict.color }}>{verdict.label}</span>
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
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <polygon points="3,1 13,7 3,13" fill="currentColor"/>
                  </svg>
                  실행
                </button>
                <button className={styles.submitBtn} onClick={handleSubmit} disabled={running}>
                  제출
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
