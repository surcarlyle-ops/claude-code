import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SongsPage from './pages/SongsPage'
import ExamPage from './pages/ExamPage'
import ResultPage from './pages/ResultPage'
import TrendsPage from './pages/TrendsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/songs" element={<SongsPage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/trends" element={<TrendsPage />} />
      </Routes>
    </BrowserRouter>
  )
}