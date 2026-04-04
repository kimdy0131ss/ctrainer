import { useState } from 'react'

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'React 공부하기', done: false },
    { id: 2, text: 'Vite 프로젝트 만들기', done: true },
  ])
  const [input, setInput] = useState('')

  function addTodo() {
    const trimmed = input.trim()
    if (!trimmed) return
    setTodos(prev => [...prev, { id: Date.now(), text: trimmed, done: false }])
    setInput('')
  }

  function toggleTodo(id) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function removeTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function handleKey(e) {
    if (e.key === 'Enter') addTodo()
  }

  const remaining = todos.filter(t => !t.done).length

  return (
    <div className="feature-card">
      <h2>할 일 목록</h2>
      <p className="feature-desc">남은 항목: {remaining}개</p>
      <div className="todo-input-row">
        <input
          className="todo-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="새 할 일 입력..."
        />
        <button className="btn-primary" onClick={addTodo}>추가</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
            <button className="todo-check" onClick={() => toggleTodo(todo.id)} aria-label="완료 토글">
              {todo.done ? '✓' : '○'}
            </button>
            <span className="todo-text">{todo.text}</span>
            <button className="todo-remove" onClick={() => removeTodo(todo.id)} aria-label="삭제">✕</button>
          </li>
        ))}
        {todos.length === 0 && <li className="todo-empty">할 일이 없습니다!</li>}
      </ul>
    </div>
  )
}
