import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowCounterClockwise, MusicNote } from '@phosphor-icons/react'
import { type ExamResult } from '../services/api'

export default function ResultPage() {
  const navigate = useNavigate()
  const [animatedScore, setAnimatedScore] = useState(0)

  const result: ExamResult | null = (() => {
    try {
      const raw = sessionStorage.getItem('lastResult')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })()

  const studentName: string = (() => {
    try {
      const s = JSON.parse(sessionStorage.getItem('student') ?? '{}')
      return s.name ?? ''
    } catch {
      return ''
    }
  })()

  // Animate score on mount
  useEffect(() => {
    if (!result) return
    const target = Math.round(result.total_score)
    if (target === 0) return
    const duration = 1000
    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setAnimatedScore(Math.round(progress * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [result])

  if (!result) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-5">
        <p className="text-4xl mb-4">🧐</p>
        <p className="text-text-muted text-lg mb-6">暂无考试结果</p>
        <button
          type="button"
          onClick={() => navigate('/songs')}
          className="px-8 py-3 rounded-btn bg-gradient-to-r from-coral to-coral/90 text-white font-semibold hover:shadow-md transition-all duration-200 shadow-sm"
        >
          去选曲
        </button>
      </div>
    )
  }

  const encouragement = getEncouragement(result.total_score)

  return (
    <div className="min-h-screen bg-surface px-5 py-8 max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => navigate('/songs')}
          className="flex items-center gap-1 text-text-muted hover:text-text-main transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">返回选曲</span>
        </button>
        <div className="text-center">
          <h1 className="text-[24px] font-bold text-text-main">考试结果</h1>
          {studentName && <p className="text-sm text-text-muted">{studentName}</p>}
        </div>
        <div className="w-16" />
      </div>

      {/* Total score card */}
      <div className="rounded-card bg-white border-2 border-pink-soft p-8 text-center mb-6 shadow-sm transition-all duration-500 hover:shadow-md">
        <p className="text-5xl mb-3">🎉</p>
        <p className="text-[64px] font-bold text-text-main leading-none mb-2">
          {animatedScore}
        </p>
        <p className="font-handwriting text-2xl text-text-muted">{encouragement}</p>
      </div>

      {/* Sub-score cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-card bg-gradient-to-br from-blue-sky to-blue-sky/70 p-5 text-center shadow-sm">
          <p className="text-sm text-text-muted mb-2">🎯 音准</p>
          <p className="text-[32px] font-bold text-text-main mb-3">
            {Math.round(result.pitch_score)}
          </p>
          <div className="h-2.5 rounded-full bg-white/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-teal-mint transition-all duration-700"
              style={{ width: `${result.pitch_score}%` }}
            />
          </div>
        </div>
        <div className="rounded-card bg-gradient-to-br from-mint to-mint/70 p-5 text-center shadow-sm">
          <p className="text-sm text-text-muted mb-2">🥁 节奏</p>
          <p className="text-[32px] font-bold text-text-main mb-3">
            {Math.round(result.rhythm_score)}
          </p>
          <div className="h-2.5 rounded-full bg-white/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-coral transition-all duration-700"
              style={{ width: `${result.rhythm_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Error markers */}
      {result.errors && result.errors.length > 0 && (
        <div className="rounded-card bg-gradient-to-br from-yellow-cream to-yellow-cream/70 p-5 mb-6 shadow-sm">
          <h2 className="font-semibold text-text-main mb-3 flex items-center gap-2">
            🔍 错误小节
          </h2>
          <ul className="space-y-2">
            {result.errors.map((err, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm p-2 rounded-lg bg-white/40"
              >
                <span className="font-mono font-semibold text-coral flex-shrink-0">
                  小节 {err.bar}
                </span>
                <span
                  className={`${err.type === 'pitch' ? 'text-coral' : 'text-teal-mint'} flex-shrink-0`}
                >
                  {err.type === 'pitch' ? '🎯' : '🥁'}
                </span>
                <span className="text-text-main">{err.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div className="rounded-card bg-gradient-to-br from-purple-lavender to-purple-lavender/70 p-5 mb-6 shadow-sm">
          <h2 className="font-semibold text-text-main mb-3 flex items-center gap-2">
            💡 改进建议
          </h2>
          <ul className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-text-main p-2 rounded-lg bg-white/40"
              >
                <span className="text-coral flex-shrink-0">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate('/exam')}
          className="flex-1 py-3.5 rounded-btn bg-gradient-to-r from-coral to-coral/90 text-white font-semibold hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm"
        >
          <ArrowCounterClockwise size={18} />
          再唱一次
        </button>
        <button
          type="button"
          onClick={() => navigate('/songs')}
          className="flex-1 py-3.5 rounded-btn bg-white border border-gray-200 text-text-main font-semibold hover:bg-gray-50 hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          <MusicNote size={18} />
          换一首
        </button>
      </div>

      {/* Bottom link */}
      <div className="text-center mt-6">
        <button
          type="button"
          onClick={() => navigate('/trends')}
          className="text-xs text-text-muted hover:text-text-main transition-colors"
        >
          查看练习趋势 →
        </button>
      </div>
    </div>
  )
}

function getEncouragement(score: number): string {
  if (score >= 90) return '太棒了！'
  if (score >= 80) return '表现不错！'
  if (score >= 70) return '继续加油！'
  if (score >= 60) return '还有进步空间～'
  return '下次会更好 💪'
}
