import { useNavigate } from 'react-router-dom'
import { ArrowCounterClockwise, MusicNote, ChartLine } from '@phosphor-icons/react'
import BottomNav from '../components/BottomNav'

function getGrade(score: number): { grade: string; color: string; bg: string; label: string } {
  if (score >= 90) return { grade: 'A+', color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-200', label: '太棒了！' }
  if (score >= 85) return { grade: 'A', color: 'text-teal-mint', bg: 'bg-mint border-mint', label: '表现优秀！' }
  if (score >= 80) return { grade: 'B+', color: 'text-blue-400', bg: 'bg-blue-sky border-blue-200', label: '表现不错！' }
  if (score >= 70) return { grade: 'B', color: 'text-purple-400', bg: 'bg-purple-lavender border-purple-200', label: '继续加油！' }
  if (score >= 60) return { grade: 'C', color: 'text-yellow-400', bg: 'bg-yellow-cream border-yellow-200', label: '还有进步空间' }
  return { grade: 'D', color: 'text-gray-400', bg: 'bg-gray-100 border-gray-200', label: '下次会更好' }
}

export default function ResultPage() {
  const navigate = useNavigate()

  const result = (() => {
    try {
      const raw = sessionStorage.getItem('lastResult')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })()

  if (!result) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-5">
        <p className="text-4xl mb-4">🧐</p>
        <p className="text-text-muted text-lg mb-6">暂无考试结果</p>
        <button type="button" onClick={() => navigate('/songs')}
          className="px-8 py-3 rounded-btn bg-gradient-to-r from-rose-400 to-rose-500 text-white font-semibold hover:shadow-md transition-all shadow-sm"
        >去选曲</button>
      </div>
    )
  }

  const { grade, color, bg, label } = getGrade(result.total_score)

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex-1 container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Grade card */}
          <div className="lg:col-span-1 space-y-4">
            <div className={`rounded-card bg-white border-2 ${bg} p-8 text-center shadow-sm`}>
              <p className="text-sm text-text-muted mb-1">总成绩</p>
              <p className={`text-responsive-4xl font-bold leading-none mb-2 ${color}`}>{grade}</p>
              <p className="font-handwriting text-xl text-text-muted">{label}</p>
            </div>

            <button type="button" onClick={() => navigate('/sing/exam', { state: { songId: result.song_id, mode: 'exam' } })}
              className="w-full py-3.5 rounded-btn bg-gradient-to-r from-rose-400 to-rose-500 text-white font-semibold hover:shadow-md hover:-translate-y-0.5 transition-all shadow-sm flex items-center justify-center gap-1.5"
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
              <ChartLine size={16} /> 查看记录
            </button>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-card bg-gradient-to-br from-blue-sky to-blue-sky/70 p-6 text-center shadow-sm">
                <p className="text-sm text-text-muted mb-2">🎯 音准</p>
                <p className="text-responsive-2xl font-bold text-text-main mb-3">{Math.round(result.pitch_score)}</p>
                <div className="h-2.5 rounded-full bg-white/60 overflow-hidden">
                  <div className="h-full rounded-full bg-rose-300 transition-all duration-700" style={{ width: `${result.pitch_score}%` }} />
                </div>
              </div>
              <div className="rounded-card bg-gradient-to-br from-mint to-mint/70 p-6 text-center shadow-sm">
                <p className="text-sm text-text-muted mb-2">🥁 节奏</p>
                <p className="text-responsive-2xl font-bold text-text-main mb-3">{Math.round(result.rhythm_score)}</p>
                <div className="h-2.5 rounded-full bg-white/60 overflow-hidden">
                  <div className="h-full rounded-full bg-rose-400 transition-all duration-700" style={{ width: `${result.rhythm_score}%` }} />
                </div>
              </div>
            </div>

            {result.errors?.length > 0 && (
              <div className="rounded-card bg-gradient-to-br from-yellow-cream to-yellow-cream/70 p-6 shadow-sm">
                <h2 className="font-semibold text-text-main mb-3 flex items-center gap-2">🔍 错误小节</h2>
                <div className="space-y-2">
                  {result.errors.map((err: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm p-3 rounded-lg bg-white/50">
                      <span className="font-mono font-semibold text-rose-400 flex-shrink-0">小节 {err.bar}</span>
                      <span className={err.type === 'pitch' ? 'text-rose-400' : 'text-teal-mint'}>{err.type === 'pitch' ? '🎯' : '🥁'}</span>
                      <span className="text-text-main">{err.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.suggestions?.length > 0 && (
              <div className="rounded-card bg-gradient-to-br from-purple-lavender to-purple-lavender/70 p-6 shadow-sm">
                <h2 className="font-semibold text-text-main mb-3 flex items-center gap-2">💡 改进建议</h2>
                <div className="space-y-2">
                  {result.suggestions.map((s: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm p-3 rounded-lg bg-white/50">
                      <span className="text-rose-400 flex-shrink-0">•</span>
                      <span className="text-text-main">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}