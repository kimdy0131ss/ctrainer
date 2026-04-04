import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/judge/Navbar'
import Home from './pages/Home'
import Problems from './pages/Problems'
import ProblemDetail from './pages/ProblemDetail'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Visualizer from './pages/Visualizer'
import Teacher from './pages/Teacher'
import MachineMaster from './pages/MachineMaster'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/visualizer" element={<Visualizer />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/machine-master" element={<MachineMaster />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
