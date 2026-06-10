import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowCounterClockwise, MusicNote, ChartLine } from '@phosphor-icons/react'
import { type ExamResult } from '../services/api'

export default function ResultPage() {
  const navigate = useNavigate()
  const [animatedScore, setAnimatedScore] = useState(0)

  const result: ExamResult | null = (() => {
    try {
      const raw = sessionStorage.getItem('lastResult')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })()

  const studentName: string = (() => {
    try { return JSON.parse(sessionStorage.getItem('student') ?? '{}').name ?? '' } catch { return '' }
  })()

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
        <button type="button" onClick={() => navigate('/songs')}
          className="px-8 py-3 rounded-btn bg-gradient-to-r from-coral to-coral/90 text-white font-semibold hover:shadow-md transition-all shadow-sm"
        >去选曲</button>
      </div>
    )
  }

  const encouragement = getEncouragement(result.total_score)

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button type="button" onClick={() => navigate('/songs')} className="flex items-center gap-1 text-text-muted hover:text-text-main transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm">返回选曲</span>
          </button>
          <h1 className="text-xl font-bold text-text-main">考试结果</h1>
          <div className="w-16 text-right">
            {studentName && <span className="text-xs text-text-muted">{studentName}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: total score + actions */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-card bg-white border-2 border-pink-soft p-8 text-center shadow-sm">
              <p className="text-5xl mb-3">🎉</p>
              <p className="text-[56px] font-bold text-text-main leading-none mb-2">{animatedScore}</p>
              <p className="font-handwriting text-2xl text-text-muted">{encouragement}</p>
            </div>

            <button type="button" onClick={() => navigate('/exam')}
              className="w-full py-3.5 rounded-btn bg-gradient-to-r from-coral to-coral/90 text-white font-semibold hover:shadow-md hover:-translate-y-0.5 transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <ArrowCounterClockwise size={18} /> 再唱一次
            </button>
            <button type="button" onClick={() => navigate('/songs')}
              className="w-full py-3.5 rounded-btn bg-white border border-gray-200 text-text-main font-semibold hover:bg-gray-50 hover:shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <MusicNote size={18} /> 换一首
            </button>
            <button type="button" onClick={() => navigate('/trends')}
              className="w-full py-3 rounded-btn border border-dashed border-gray-200 text-text-muted text-sm font-medium hover:text-text-main hover:border-gray-300 transition-all flex items-center justify-center gap-1.5"
            >
              <ChartLine size={16} /> 查看趋势
            </button>
          </div>

          {/* Right column: details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-card bg-gradient-to-br from-blue-sky to-blue-sky/70 p-6 text-center shadow-sm">
                <p className="text-sm text-text-muted mb-2">🎯 音准</p>
                <p className="text-[36px] font-bold text-text-main mb-3">{Math.round(result.pitch_score)}</p>
                <div className="h-2.5 rounded-full bg-white/60 overflow-hidden">
                  <div className="h-full rounded-full bg-teal-mint transition-all duration-700" style={{ width: `${result.pitch_score}%` }} />
                </div>
              </div>
              <div className="rounded-card bg-gradient-to-br from-mint to-mint/70 p-6 text-center shadow-sm">
                <p className="text-sm text-text-muted mb-2">🥁 节奏</p>
                <p className="text-[36px] font-bold text-text-main mb-3">{Math.round(result.rhythm_score)}</p>
                <div className="h-2.5 rounded-full bg-white/60 overflow-hidden">
                  <div className="h-full rounded-full bg-coral transition-all duration-700" style={{ width: `${result.rhythm_score}%` }} />
                </div>
              </div>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className="rounded-card bg-gradient-to-br from-yellow-cream to-yellow-cream/70 p-6 shadow-sm">
                <h2 className="font-semibold text-text-main mb-3 flex items-center gap-2">🔍 错误小节</h2>
                <div className="space-y-2">
                  {result.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm p-3 rounded-lg bg-white/50">
                      <span className="font-mono font-semibold text-coral flex-shrink-0">小节 {err.bar}</span>
                      <span className={`${err.type === 'pitch' ? 'text-coral' : 'text-teal-mint'} flex-shrink-0`}>
                        {err.type === 'pitch' ? '🎯' : '🥁'}
                      </span>
                      <span className="text-text-main">{err.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.suggestions && result.suggestions.length > 0 && (
              <div className="rounded-card bg-gradient-to-br from-purple-lavender to-purple-lavender/70 p-6 shadow-sm">
                <h2 className="font-semibold text-text-main mb-3 flex items-center gap-2">💡 改进建议</h2>
                <div className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm p-3 rounded-lg bg-white/50">
                      <span className="text-coral flex-shrink-0">•</span>
                      <span className="text-text-main">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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
