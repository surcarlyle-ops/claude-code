import { useNavigate } from 'react-router-dom'
import { Microphone, ChartLine, ClockCounterClockwise } from '@phosphor-icons/react'

const MOCK_HISTORY = [
  { date: '2024-06-09', title: '小星星', score: 85 },
  { date: '2024-06-08', title: '小蜜蜂', score: 88 },
  { date: '2024-06-07', title: '小星星', score: 80 },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center">
      {/* Hero section */}
      <div className="flex flex-col items-center justify-center pt-20 pb-12 px-5">
        <div className="text-6xl mb-4">🎵</div>
        <h1 className="text-[40px] font-bold text-text-main mb-2">
          MusicExam
        </h1>
        <p className="font-handwriting text-text-muted text-2xl mb-10">
          你的音乐练习伙伴
        </p>

        {/* Start exam button */}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="px-12 py-4 rounded-btn bg-gradient-to-r from-coral to-coral/90 text-white text-lg font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-200 shadow-md"
        >
          <span className="flex items-center gap-2">
            <Microphone size={22} weight="bold" />
            开始练习
          </span>
        </button>

        <p className="text-text-muted text-sm mt-4">
          需要摄像头和麦克风权限
        </p>
      </div>

      {/* Recent records section */}
      <div className="w-full max-w-2xl px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-main flex items-center gap-2">
            <ClockCounterClockwise size={20} className="text-coral" />
            最近练习
          </h2>
          <button
            type="button"
            onClick={() => navigate('/trends')}
            className="flex items-center gap-1 text-sm text-text-muted hover:text-text-main transition-colors"
          >
            <ChartLine size={16} />
            查看趋势
          </button>
        </div>

        <div className="space-y-3">
          {MOCK_HISTORY.map((record, i) => (
            <div
              key={i}
              className="bg-white rounded-card p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                  record.score >= 85
                    ? 'bg-mint text-teal-mint'
                    : record.score >= 70
                      ? 'bg-pink-soft text-coral'
                      : 'bg-gray-100 text-text-muted'
                }`}
              >
                {record.score}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-text-main">{record.title}</p>
                <p className="text-xs text-text-muted">{record.date}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/result')}
                className="text-sm text-coral font-medium hover:underline"
              >
                查看详情
              </button>
            </div>
          ))}
        </div>

        {MOCK_HISTORY.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <p className="text-lg">还没有练习记录</p>
            <p className="text-sm mt-1">点击上方按钮开始第一次练习吧</p>
          </div>
        )}
      </div>
    </div>
  )
}
