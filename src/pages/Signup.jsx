import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import styles from './Signup.module.css'

const ADMIN_CODE = '5178'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [secretCode, setSecretCode] = useState('')
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError(null)

    const isAdmin = secretCode === ADMIN_CODE

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    await supabase.auth.signOut()

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    const user = data?.user ?? data?.session?.user

    if (!user) {
      setError('회원가입은 되었지만 user 정보를 가져올 수 없습니다.')
      return
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          email: email,
          username: username || email.split('@')[0],
          solved_count: 0,
          rating: 0,
          is_admin: isAdmin,
        },
      ])

    if (profileError) {
      setError(profileError.message)
      return
    }

    navigate('/login')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>회원가입</h1>

        <form onSubmit={handleSignup}>
          <input
            className={styles.input}
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className={styles.input}
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="비밀코드 (선택사항)"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
          />

          <button className={styles.button} type="submit">
            회원가입
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  )
}
