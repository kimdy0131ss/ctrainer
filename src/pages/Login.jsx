import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import styles from './Login.module.css'

const ADMIN_CODE = '5178'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secretCode, setSecretCode] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    if (secretCode === ADMIN_CODE && data?.user) {
      await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', data.user.id)
    }

    navigate('/')
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.box}>
        <div className={styles.title}>로그인</div>

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="비밀코드 (선택사항)"
          value={secretCode}
          onChange={(e) => setSecretCode(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          로그인
        </button>

        <div className={styles.footer}>
          <Link to="/signup" className={styles.link}>
            계정 없냐? 회원가입 ㄱ
          </Link>
        </div>
      </form>
    </div>
  )
}
