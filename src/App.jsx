import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from './supabaseClient'

export const ThemeContext = createContext('dark')

import Navbar from './components/judge/Navbar'
import Copyright from './components/judge/Copyright'
import Home from './pages/Home'
import Problems from './pages/Problems'
import ProblemDetail from './pages/ProblemDetail'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Visualizer from './pages/Visualizer'
import Teacher from './pages/Teacher'
import Introduction from './pages/Introduction'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminPage from './pages/AdminPage'

function App() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchProfile(data.user.id)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        const u = session?.user ?? null
        setUser(u)
        if (u) fetchProfile(u.id)
        else setIsAdmin(false)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const fetchProfile = async (uid) => {
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', uid)
      .single()
    setIsAdmin(data?.is_admin === true)
  }

  return (
    <ThemeContext.Provider value={theme}>
    <BrowserRouter>
      <Navbar user={user} isAdmin={isAdmin} theme={theme} toggleTheme={toggleTheme} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/visualizer" element={<Visualizer isAdmin={isAdmin} />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/introduction" element={<Introduction />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPage isAdmin={isAdmin} />} />
      </Routes>
    </BrowserRouter>

    <Copyright />
    </ThemeContext.Provider>
  )
}

export default App
