import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Star } from '@phosphor-icons/react'
import BottomNav from '../components/BottomNav'

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
  { date: '2024-06-09', title: '送别', score: 85, duration: '1:20' },
  { date: '2024-06-08', title: '茉莉花', score: 88, duration: '2:10' },
  { date: '2024-06-07', title: '送别', score: 80, duration: '1:20' },
  { date: '2024-06-06', title: '友谊地久天长', score: 82, duration: '1:45' },
  { date: '2024-06-05', title: '雪绒花', score: 65, duration: '1:30' },
  { date: '2024-06-04', title: '茉莉花', score: 78, duration: '2:10' },
  { date: '2024-06-03', title: '大海啊故乡', score: 72, duration: '2:00' },
]

function getGrade(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'A+', color: 'text-yellow-500' }
  if (score >= 85) return { label: 'A', color: 'text-teal-mint' }
  if (score >= 80) return { label: 'B+', color: 'text-blue-400' }
  if (score >= 70) return { label: 'B', color: 'text-purple-400' }
  if (score >= 60) return { label: 'C', color: 'text-yellow-400' }
  return { label: 'D', color: 'text-gray-400' }
}

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

    ctx.fillStyle = '#fff'
    ctx.beginPath()
    const r = 16
    ctx.moveTo(r, 0); ctx.lineTo(W - r, 0); ctx.quadraticCurveTo(W, 0, W, r)
    ctx.lineTo(W, H - r); ctx.quadraticCurveTo(W, H, W - r, H)
    ctx.lineTo(r, H); ctx.quadraticCurveTo(0, H, 0, H - r)
    ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0); ctx.closePath(); ctx.fill()

    ctx.strokeStyle = '#F0EDEA'; ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + (PH / 4) * i
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke()
    }

    const scores = MOCK_SCORES
    const minScore = Math.min(...scores.map((s) => s.score)) - 5
    const maxScore = Math.max(...scores.map((s) => s.score)) + 5
    const range = maxScore - minScore

    const points = scores.map((s, i) => ({
      x: PAD.left + (i / Math.max(scores.length - 1, 1)) * PW,
      y: PAD.top + PH - ((s.score - minScore) / range) * PH,
      score: s.score, date: s.date,
    }))

    const gradient = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + PH)
    gradient.addColorStop(0, 'rgba(255, 107, 107, 0.15)')
    gradient.addColorStop(1, 'rgba(255, 107, 107, 0.01)')
    ctx.fillStyle = gradient
    ctx.beginPath(); ctx.moveTo(points[0].x, PAD.top + PH)
    points.forEach((p) => ctx.lineTo(p.x, p.y))
    ctx.lineTo(points[points.length - 1].x, PAD.top + PH); ctx.closePath(); ctx.fill()

    ctx.strokeStyle = '#FF6B6B'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'
    ctx.beginPath()
    points.forEach((p, i) => { i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y) })
    ctx.stroke()

    points.forEach((p) => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'; ctx.fill()
      ctx.strokeStyle = '#FF6B6B'; ctx.lineWidth = 2.5; ctx.stroke()
    })

    ctx.fillStyle = '#636E72'; ctx.font = '11px Nunito, sans-serif'
    ctx.textAlign = 'right'
    for (let i = 0; i <= 4; i++) {
      ctx.fillText(`${Math.round(maxScore - (range / 4) * i)}`, PAD.left - 8, PAD.top + (PH / 4) * i + 4)
    }
    ctx.textAlign = 'center'
    points.forEach((p) => ctx.fillText(p.date, p.x, H - 12))
  }, [filter])

  const avgScore = Math.round(MOCK_SCORES.reduce((s, r) => s + r.score, 0) / MOCK_SCORES.length)

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 2xl:px-8 py-4 flex items-center justify-between">
            <button type="button" onClick={() => navigate('/home')} className="flex items-center gap-1 text-text-muted hover:text-text-main transition-colors">
              <ArrowLeft size={20} />
              <span className="text-sm">返回</span>
            </button>
            <h1 className="text-responsive-xl font-bold text-text-main">学习记录</h1>
            <div className="w-16" />
          </div>
        </div>

        <div className="max-w-5xl 2xl:max-w-7xl mx-auto px-6 2xl:px-8 py-8">
          {/* Filter */}
          <div className="flex gap-3 mb-6">
            {[
              { key: '7d' as const, label: '7天' },
              { key: '30d' as const, label: '30天' },
              { key: 'custom' as const, label: '自定义' },
            ].map((f) => (
              <button key={f.key} type="button" onClick={() => setFilter(f.key)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                style={{ backgroundColor: filter === f.key ? '#FADADD' : '#fff', color: filter === f.key ? '#FF6B6B' : '#636E72' }}
              >{f.label}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 2xl:gap-8 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <canvas ref={canvasRef} className="w-full h-72" style={{ borderRadius: '20px' }} />

              <h2 className="text-base font-semibold text-text-main">练习记录</h2>
              <div className="space-y-2">
                {MOCK_RECORDS.map((record, i) => {
                  const g = getGrade(record.score)
                  return (
                    <div key={i} className="bg-white rounded-card px-4 py-3 flex items-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-rose-100">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-main">{record.title}</p>
                        <p className="text-xs text-text-muted">{record.date} · {record.duration}</p>
                      </div>
                      <span className={`text-base font-bold ${g.color}`}>{g.label}</span>
                      <button type="button" onClick={() => navigate('/result')} className="text-xs text-rose-400 font-medium hover:underline">查看</button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-card bg-white p-6 shadow-sm">
                <p className="text-xs text-text-muted mb-1">7天平均分</p>
                <p className="text-responsive-2xl font-bold text-text-main leading-none mb-3">{avgScore}</p>
                <div className="flex items-center gap-1 text-sm text-teal-mint">
                  <Star size={16} weight="fill" />
                  <span>趋势上升</span>
                </div>
              </div>
              <div className="rounded-card bg-white p-6 shadow-sm">
                <p className="text-xs text-text-muted mb-1">最高分</p>
                <p className="text-responsive-2xl font-bold text-text-main leading-none">{Math.max(...MOCK_SCORES.map(s => s.score))}</p>
              </div>
              <div className="rounded-card bg-white p-6 shadow-sm">
                <p className="text-xs text-text-muted mb-1">练习次数</p>
                <p className="text-responsive-2xl font-bold text-text-main leading-none">{MOCK_RECORDS.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}