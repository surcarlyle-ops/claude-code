import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Star } from '@phosphor-icons/react'

const MOCK_SCORES = [
  { date: '06-03', score: 72 },
  { date: '06-04', score: 78 },
  { date: '06-05', score: 65 },
  { date: '06-06', score: 82 },
  { date: '06-07', score: 80 },
  { date: '06-08', score: 88 },
  { date: '06-09', score: 85 },
]

const MOCK_RECORDS = [
  { date: '2024-06-09', title: '小星星', score: 85, duration: '1:20' },
  { date: '2024-06-08', title: '小蜜蜂', score: 88, duration: '1:00' },
  { date: '2024-06-07', title: '小星星', score: 80, duration: '1:20' },
  { date: '2024-06-06', title: '茉莉花', score: 82, duration: '2:10' },
  { date: '2024-06-05', title: '小星星', score: 65, duration: '1:20' },
  { date: '2024-06-04', title: '小蜜蜂', score: 78, duration: '1:00' },
  { date: '2024-06-03', title: '小星星', score: 72, duration: '1:20' },
]

export default function TrendsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'7d' | '30d' | 'custom'>('7d')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const W = rect.width
    const H = rect.height
    const PAD = { top: 30, right: 20, bottom: 40, left: 40 }
    const PW = W - PAD.left - PAD.right
    const PH = H - PAD.top - PAD.bottom

    ctx.clearRect(0, 0, W, H)

    // Background
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    const r = 16
    ctx.moveTo(r, 0)
    ctx.lineTo(W - r, 0)
    ctx.quadraticCurveTo(W, 0, W, r)
    ctx.lineTo(W, H - r)
    ctx.quadraticCurveTo(W, H, W - r, H)
    ctx.lineTo(r, H)
    ctx.quadraticCurveTo(0, H, 0, H - r)
    ctx.lineTo(0, r)
    ctx.quadraticCurveTo(0, 0, r, 0)
    ctx.closePath()
    ctx.fill()

    // Grid lines
    ctx.strokeStyle = '#F0EDEA'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + (PH / 4) * i
      ctx.beginPath()
      ctx.moveTo(PAD.left, y)
      ctx.lineTo(W - PAD.right, y)
      ctx.stroke()
    }

    // Chart data
    const scores = MOCK_SCORES
    const minScore = Math.min(...scores.map((s) => s.score)) - 5
    const maxScore = Math.max(...scores.map((s) => s.score)) + 5
    const range = maxScore - minScore

    const points = scores.map((s, i) => ({
      x: PAD.left + (i / Math.max(scores.length - 1, 1)) * PW,
      y: PAD.top + PH - ((s.score - minScore) / range) * PH,
      score: s.score,
      date: s.date,
    }))

    // Fill area gradient
    const gradient = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + PH)
    gradient.addColorStop(0, 'rgba(255, 107, 107, 0.15)')
    gradient.addColorStop(1, 'rgba(255, 107, 107, 0.01)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(points[0].x, PAD.top + PH)
    points.forEach((p) => ctx.lineTo(p.x, p.y))
    ctx.lineTo(points[points.length - 1].x, PAD.top + PH)
    ctx.closePath()
    ctx.fill()

    // Line
    ctx.strokeStyle = '#FF6B6B'
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'
    ctx.beginPath()
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    })
    ctx.stroke()

    // Data dots
    points.forEach((p) => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()
      ctx.strokeStyle = '#FF6B6B'
      ctx.lineWidth = 2.5
      ctx.stroke()
    })

    // Y-axis labels
    ctx.fillStyle = '#636E72'
    ctx.font = '11px Nunito, sans-serif'
    ctx.textAlign = 'right'
    for (let i = 0; i <= 4; i++) {
      const value = Math.round(maxScore - (range / 4) * i)
      const y = PAD.top + (PH / 4) * i + 4
      ctx.fillText(`${value}`, PAD.left - 8, y)
    }

    // X-axis labels
    ctx.textAlign = 'center'
    points.forEach((p) => {
      ctx.fillText(p.date, p.x, H - 12)
    })
  }, [filter])

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-teal-mint'
    if (score >= 70) return 'text-coral'
    return 'text-text-muted'
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-lg mx-auto px-5 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-text-muted hover:text-text-main transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">返回</span>
          </button>
          <h1 className="text-[24px] font-bold text-text-main">学习趋势</h1>
          <div className="w-16" />
        </div>

        {/* Time filter */}
        <div className="flex gap-2 mb-6">
          {[
            { key: '7d' as const, label: '7天' },
            { key: '30d' as const, label: '30天' },
            { key: 'custom' as const, label: '自定义' },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
              style={{
                backgroundColor: filter === f.key ? '#FADADD' : '#fff',
                color: filter === f.key ? '#FF6B6B' : '#636E72',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Canvas chart */}
        <div className="mb-6">
          <canvas
            ref={canvasRef}
            className="w-full h-56"
            style={{ borderRadius: '20px' }}
          />
        </div>

        {/* Average score card */}
        <div className="rounded-card bg-white p-5 shadow-sm mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted mb-1">7天平均分</p>
            <p className="text-[28px] font-bold text-text-main leading-none">
              {Math.round(
                MOCK_SCORES.reduce((sum, s) => sum + s.score, 0) /
                  MOCK_SCORES.length
              )}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm text-teal-mint">
            <Star size={16} weight="fill" />
            <span>趋势上升</span>
          </div>
        </div>

        {/* Practice records */}
        <h2 className="text-sm font-semibold text-text-main mb-3 px-1">
          练习记录
        </h2>
        <div className="space-y-2">
          {MOCK_RECORDS.map((record, i) => (
            <div
              key={i}
              className="rounded-card bg-white p-4 flex items-center gap-3 shadow-sm"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getScoreColor(record.score)} ${
                  record.score >= 85
                    ? 'bg-mint'
                    : record.score >= 70
                      ? 'bg-pink-soft'
                      : 'bg-gray-100'
                }`}
              >
                {record.score}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-main">
                  {record.title}
                </p>
                <p className="text-xs text-text-muted">
                  {record.date} · {record.duration}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/result')}
                className="text-xs text-coral font-medium hover:underline"
              >
                查看
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
