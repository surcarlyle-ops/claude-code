import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Microphone, ClockCounterClockwise, MusicNotes, GraduationCap, Sparkle, Target } from '@phosphor-icons/react'
import gsap from 'gsap'
import BottomNav from '../components/BottomNav'

const GRADE_LABELS: Record<string, string> = {
  'p3': '小学三年级', 'p4': '小学四年级', 'p5': '小学五年级',
  'm1': '初中预备班', 'm2': '初中一年级', 'm3': '初中二年级', 'm4': '初中三年级',
}

function getGrade(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'A+', color: 'text-yellow-500' }
  if (score >= 85) return { label: 'A', color: 'text-teal-mint' }
  if (score >= 80) return { label: 'B+', color: 'text-blue-400' }
  if (score >= 70) return { label: 'B', color: 'text-purple-400' }
  if (score >= 60) return { label: 'C', color: 'text-yellow-400' }
  return { label: 'D', color: 'text-gray-400' }
}

const HOVER_COLORS = [
  'hover:shadow-rose-200/50 hover:border-rose-200',
  'hover:shadow-mint/50 hover:border-mint',
  'hover:shadow-blue-sky/50 hover:border-blue-200',
  'hover:shadow-purple-lavender/50 hover:border-purple-200',
]

export default function HomePage() {
  const navigate = useNavigate()
  const welcomeRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  const [studentName, setStudentName] = useState('同学')
  const [studentGrade, setStudentGrade] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('student')
    if (!raw) { navigate('/welcome', { replace: true }); return }
    try {
      const data = JSON.parse(raw)
      setStudentName(data.name || '同学')
      setStudentGrade(GRADE_LABELS[data.grade] || '')
    } catch {
      navigate('/welcome', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    if (!welcomeRef.current) return
    gsap.fromTo(welcomeRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
    if (cardsRef.current?.children) {
      gsap.fromTo(cardsRef.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out', delay: 0.2 })
    }
    if (historyRef.current?.children) {
      gsap.fromTo(historyRef.current.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.35 })
    }
  }, [])

  const mockHistory = [
    { date: '06-09', title: '送别', score: 85, time: '1:20' },
    { date: '06-08', title: '茉莉花', score: 92, time: '2:10' },
    { date: '06-05', title: '友谊地久天长', score: 78, time: '1:45' },
  ]

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex-1">
        {/* Decorative background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-20 right-10 text-rose-200/20"><Sparkle size={48} weight="fill" /></div>
          <div className="absolute top-40 left-5 text-mint/20"><MusicNotes size={32} weight="fill" /></div>
          <div className="absolute bottom-40 right-20 text-purple-lavender/30"><Sparkle size={36} weight="fill" /></div>
          <div className="absolute bottom-60 left-10 text-blue-sky/20"><MusicNotes size={28} weight="fill" /></div>
        </div>

        <div className="relative z-10 container-wide">
          {/* Welcome */}
          <div ref={welcomeRef} className="mb-8">
            <h1 className="text-responsive-3xl font-bold text-text-main mb-1">
              {studentName}，你好！
            </h1>
            <p className="text-text-muted flex items-center gap-2">
              <GraduationCap size={18} />
              今天想练哪首歌？
              {studentGrade && <span className="text-xs bg-rose-100 text-rose-500 px-2.5 py-0.5 rounded-full">{studentGrade}</span>}
            </p>
          </div>

          {/* Practice + Exam cards */}
          <div className="mb-8">
            <h2 className="text-responsive-lg font-bold text-text-main mb-1 flex items-center gap-2">
              <Microphone size={22} className="text-rose-400" />
              开始练习
            </h2>
            <p className="text-text-muted text-sm mb-4">跟着歌词练唱，轻松上手</p>
            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-4 2xl:gap-6">
              <button type="button" onClick={() => navigate('/songs', { state: { mode: 'practice' } })}
                className="rounded-card bg-gradient-to-br from-rose-400 to-rose-500 p-6 text-left text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Microphone size={26} weight="fill" />
                  </div>
                  <div>
                    <h3 className="text-responsive-lg font-bold">开始练习</h3>
                    <p className="text-white/70 text-sm">跟唱模式 · 歌词常驻</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-xs">
                  <MusicNotes size={14} />
                  跟着提示练唱
                </div>
              </button>

              <button type="button" onClick={() => navigate('/songs', { state: { mode: 'exam' } })}
                className="rounded-card bg-gradient-to-br from-purple-lavender to-purple-300 p-6 text-left text-text-main shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target size={26} weight="fill" className="text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-responsive-lg font-bold">模拟考试</h3>
                    <p className="text-text-muted/70 text-sm">完整评分模式 · 隐藏歌词</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-text-muted/50 text-xs">
                  <MusicNotes size={14} />
                  完整评分 + 等级
                </div>
              </button>
            </div>
          </div>

          {/* Recent records */}
          <div>
            <h2 className="text-base font-semibold text-text-main mb-4 flex items-center gap-2">
              <ClockCounterClockwise size={18} className="text-rose-400" />
              最近练习
            </h2>

            <div ref={historyRef} className="space-y-3">
              {mockHistory.map((record, i) => {
                const g = getGrade(record.score)
                return (
                  <div key={i}
                    className={`bg-white rounded-card p-4 flex items-center gap-4 shadow-sm border-2 border-transparent cursor-pointer transition-all duration-200 ${HOVER_COLORS[i % HOVER_COLORS.length]} hover:shadow-md hover:-translate-y-0.5`}
                    onClick={() => navigate('/result')}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-text-main">{record.title}</p>
                      <p className="text-xs text-text-muted">{record.date} · {record.time}</p>
                    </div>
                    <span className={`text-responsive-lg font-bold ${g.color}`}>{g.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}