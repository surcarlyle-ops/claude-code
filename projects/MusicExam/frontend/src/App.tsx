import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScaleProvider from './components/ScaleProvider'
import WelcomePage from './pages/WelcomePage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SongsPage from './pages/SongsPage'
import SingingPage from './pages/SingingPage'
import ResultPage from './pages/ResultPage'
import TrendsPage from './pages/TrendsPage'

export default function App() {
  return (
    <BrowserRouter>
      <ScaleProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/sing/practice" element={<SingingPage />} />
          <Route path="/sing/exam" element={<SingingPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/trends" element={<TrendsPage />} />
        </Routes>
      </ScaleProvider>
    </BrowserRouter>
  )
}