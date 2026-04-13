import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import DifficultyBadge from '../components/judge/DifficultyBadge'
import styles from './Problems.module.css'

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

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard']
const DIFF_LABELS = { all: '전체', easy: '쉬움', medium: '보통', hard: '어려움' }
const STATUS_LABELS = { all: '전체', solved: '푼 문제', unsolved: '안 푼 문제' }

export default function Problems() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  const [selectedTag, setSelectedTag] = useState(null)
  const [status, setStatus] = useState('all')
  const [problems, setProblems] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || null)
    })
  }, [])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('problems').select('*').order('id', { ascending: true })
      if (data && data.length > 0) {
        const merged = data.filter(p => !p.hidden).map(normalizeDB)
        setProblems(merged)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!userId || problems.length === 0) return

    const updateSolvedStatus = async () => {
      const { data: solvedProblems } = await supabase
        .from('solved_problems')
        .select('problem_id')
        .eq('user_id', userId)

      const solvedIds = new Set((solvedProblems || []).map(s => s.problem_id))

      setProblems(prev =>
        prev.map(p => ({
          ...p,
          solved: solvedIds.has(p.id)
        }))
      )
    }

    updateSolvedStatus()
  }, [userId, problems.length])

  const allTags = [...new Set(problems.flatMap(p => p.tags))].sort()

  const filtered = problems.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    if (difficulty !== 'all' && p.difficulty !== difficulty) return false
    if (selectedTag && !p.tags.includes(selectedTag)) return false
    if (status === 'solved' && !p.solved) return false
    if (status === 'unsolved' && p.solved) return false
    return true
  })

  const counts = {
    easy: problems.filter(p => p.difficulty === 'easy').length,
    medium: problems.filter(p => p.difficulty === 'medium').length,
    hard: problems.filter(p => p.difficulty === 'hard').length,
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>문제</h1>
          <p className={styles.pageSubtitle}>총 {problems.length}개의 문제</p>
        </div>

        <div className={styles.diffOverview}>
          {['easy', 'medium', 'hard'].map(d => (
            <button
              key={d}
              className={`${styles.diffTile} ${styles[d]} ${difficulty === d ? styles.active : ''}`}
              onClick={() => setDifficulty(difficulty === d ? 'all' : d)}
            >
              <span className={styles.diffCount}>{counts[d]}</span>
              <span className={styles.diffLabel}>{DIFF_LABELS[d]}</span>
            </button>
          ))}
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>상태</span>
              {['all', 'solved', 'unsolved'].map(s => (
                <button
                  key={s}
                  className={`${styles.filterBtn} ${status === s ? styles.filterActive : ''}`}
                  onClick={() => setStatus(s)}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>난이도</span>
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  className={`${styles.filterBtn} ${difficulty === d ? styles.filterActive : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  {DIFF_LABELS[d]}
                </button>
              ))}
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>태그</span>
              <div className={styles.tagCloud}>
                {allTags.map((tag, idx) => (
                  <button
                    key={`${tag}-${idx}`}
                    className={`${styles.filterBtn} ${selectedTag === tag ? styles.tagActive : ''}`}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className={styles.main}>
            <div className={styles.searchBar}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.searchIcon}>
                <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="문제 검색..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              {search && (
                <button className={styles.clearBtn} onClick={() => setSearch('')}>×</button>
              )}
            </div>

            <div className={styles.listHeader}>
              <span className={styles.colNum}>#</span>
              <span className={styles.colTitle}>제목</span>
              <span className={styles.colDiff}>난이도</span>
              <span className={styles.colAccept}>정답률</span>
            </div>

            {filtered.length === 0 ? (
              <div className={styles.empty}>
                <span>검색 결과가 없습니다</span>
              </div>
            ) : (
              <div className={styles.list}>
                {filtered.map(problem => (
                  <Link to={`/problems/${problem.id}`} key={problem.id} className={styles.row}>
                    <span className={styles.rowNum}>
                      {problem.solved
                        ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6.5" stroke="var(--easy)" strokeOpacity="0.6" />
                          <path d="M4.5 7l2 2 3-3" stroke="var(--easy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        : <span className={styles.numText}>{problem.id}</span>
                      }
                    </span>
                    <span className={styles.rowTitle}>
                      <span className={styles.titleText}>{problem.title}</span>
                      <span className={styles.rowTags}>
                        {problem.tags.slice(0, 2).map(tag => (
                          <span key={`${problem.id}-${tag}`} className={styles.rowTag}>
                            {tag}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className={styles.rowDiff}>
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </span>
                    <span className={styles.rowAccept}>{problem.acceptance}%</span>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}