import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Student, Eye, EyeSlash, ArrowRight, User, Clock, Sparkle } from '@phosphor-icons/react'
import { useScale } from '../components/ScaleProvider'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setDemoMode } = useScale()
  const [showPassword, setShowPassword] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, password })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || '登录失败')
      }

      const data = await response.json()
      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('student', JSON.stringify(data.student))
      navigate('/home')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemo = () => {
    setDemoMode(true)
    sessionStorage.setItem('demoMode', 'true')
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Background color blocks */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-yellow-cream/50" />
        <div className="absolute top-1/3 -left-20 w-48 h-48 rounded-[40px] bg-pink-soft/50 rotate-12" />
        <div className="absolute -bottom-20 right-1/4 w-56 h-56 rounded-[48px] bg-blue-sky/40 -rotate-6" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-soft/80 mb-4">
            <Sparkle size={16} weight="fill" className="text-pink-bright" />
            <span className="text-sm font-bold text-text-main">MusicExam</span>
          </div>
          <h1 className="text-responsive-4xl font-black text-text-main">
            欢迎回来
          </h1>
          <p className="text-text-muted text-responsive-base mt-2">
            登录你的练习账户
          </p>
        </div>

        {/* Login Card - Pink background */}
        <div className="card-dopamine bg-card-pink mb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-pink-soft flex items-center justify-center">
              <Student size={20} weight="bold" className="text-pink-bright" />
            </div>
            <div>
              <h2 className="text-responsive-xl font-bold text-text-main">学生登录</h2>
              <p className="text-text-light text-sm">输入学号和密码</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-main mb-2">学号</label>
              <div className="relative">
                <User size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-text-light" />
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="请输入学号"
                  className="input-underline pl-7"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-2">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="input-underline pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-text-light hover:text-text-main transition-colors"
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-coral text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-dark w-full justify-center mt-4"
            >
              {isLoading ? (
                <span className="animate-spin">⌛</span>
              ) : (
                <>
                  登录
                  <ArrowRight size={18} weight="bold" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Card - Yellow background */}
        <div className="card-dopamine bg-card-yellow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-cream flex items-center justify-center">
              <Clock size={20} weight="bold" className="text-yellow-bright" />
            </div>
            <div>
              <h2 className="text-responsive-lg font-bold text-text-main">演示模式</h2>
              <p className="text-text-light text-sm">无需账号，快速体验</p>
            </div>
          </div>

          <p className="text-text-muted text-sm mb-4">
            使用演示数据，包含示例学生信息、曲目列表和模拟评分，快速了解平台功能。
          </p>

          <button
            type="button"
            onClick={handleDemo}
            className="w-full py-3 px-4 rounded-btn bg-white text-text-main font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Sparkle size={16} weight="fill" className="text-yellow-bright" />
            进入演示模式
          </button>
        </div>
      </div>
    </div>
  )
}
