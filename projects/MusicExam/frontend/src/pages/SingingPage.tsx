import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Microphone, StopCircle } from '@phosphor-icons/react'
import gsap from 'gsap'
import { LYRIC_DATA, type LyricLine } from '../data/lyrics'

const TOTAL_DURATION = 80
const SONGS: Record<number, { title: string }> = {
  1: { title: '送别' }, 2: { title: '雪绒花' }, 3: { title: '让我们荡起双桨' },
  4: { title: '小红帽' }, 5: { title: '采蘑菇的小姑娘' }, 6: { title: '茉莉花' },
  7: { title: '友谊地久天长' }, 8: { title: '外婆的澎湖湾' }, 9: { title: '大海啊故乡' },
  10: { title: '我的中国心' }, 11: { title: '长江之歌' }, 12: { title: '歌唱祖国' },
  13: { title: '同一首歌' }, 14: { title: '我和我的祖国' },
}

const GHOST_TEXTS: Record<string, string> = {
  practice: '开始前做几个深呼吸，让声音更放松哦～',
  exam: '别紧张，就像平时练习一样～加油！',
}

function GhostSVG() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
      <ellipse cx="24" cy="26" rx="16" ry="18" fill="#F5F0EB" />
      <circle cx="18" cy="22" r="4" fill="#2D3436" />
      <circle cx="30" cy="22" r="4" fill="#2D3436" />
      <circle cx="17" cy="21" r="1.5" fill="white" />
      <circle cx="29" cy="21" r="1.5" fill="white" />
      <ellipse cx="24" cy="40" rx="14" ry="4" fill="#F5F0EB" />
    </svg>
  )
}

export default function SingingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as Record<string, unknown> | null
  const mode = (state?.mode as string) || 'practice'
  const songId = (state?.songId as number) || 1
  const song = SONGS[songId]
  const lyrics = LYRIC_DATA[songId] || []

  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const ghostRef = useRef<HTMLDivElement>(null)
  const lyricsRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const elapsedRef = useRef(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const animIdRef = useRef(0)

  const [phase, setPhase] = useState<'ready' | 'countdown' | 'singing' | 'submitting'>('ready')
  const [countdown, setCountdown] = useState(3)
  const [elapsed, setElapsed] = useState(0)
  const [ghostMessage, setGhostMessage] = useState('')
  const [error, setError] = useState('')
  const [currentLine, setCurrentLine] = useState(0)

  const isExam = mode === 'exam'
  const displaySeconds = Math.min(elapsed, TOTAL_DURATION)

  // GSAP entrance
  useEffect(() => {
    if (ghostRef.current) {
      gsap.fromTo(ghostRef.current, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' })
    }
    setGhostMessage(GHOST_TEXTS[mode] || '')
  }, [mode])

  // Smooth wave + progress animation (requestAnimationFrame-driven)
  useEffect(() => {
    const canvas = waveCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    let W = rect.width
    let H = rect.height

    const resize = () => {
      rect = canvas.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = W * dpr
      canvas.height = H * dpr
    }
    window.addEventListener('resize', resize)

    // Phase timing for smooth progress interpolation
    let singStartTime = 0
    let prevProgressValue = 0

    const draw = (timestamp: number) => {
      if (rect.width === 0 || rect.height === 0) {
        animIdRef.current = requestAnimationFrame(draw)
        return
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // Smooth progress: interpolate toward target over ~300ms
      const phase_ = phase
      const elapsed_ = elapsedRef.current

      let targetProgress: number
      if (phase_ === 'ready' || phase_ === 'countdown') {
        targetProgress = 0
      } else if (phase_ === 'singing') {
        if (singStartTime === 0) singStartTime = timestamp
        targetProgress = Math.min(elapsed_ / TOTAL_DURATION, 1)
      } else {
        targetProgress = 1
      }

      // Smooth interpolation: move 20% of the way each frame
      prevProgressValue += (targetProgress - prevProgressValue) * 0.15
      if (Math.abs(prevProgressValue - targetProgress) < 0.001) prevProgressValue = targetProgress
      const progress = prevProgressValue
      const fillX = W * progress

      // Draw base sine wave
      const waveTime = Date.now() * 0.001
      const waveFn = (x: number) =>
        H / 2 + Math.sin(x * 0.03 + waveTime * 1.2) * 7
          + Math.sin(x * 0.07 + waveTime * 1.8) * 3

      // Draw unfilled portion (grey wave only)
      if (progress < 1) {
        ctx.beginPath()
        let started = false
        for (let x = Math.max(0, fillX); x < W; x++) {
          const y = waveFn(x)
          if (!started) { ctx.moveTo(x, y); started = true }
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Draw filled portion
      if (progress > 0) {
        ctx.beginPath()
        for (let x = 0; x <= fillX; x++) {
          const y = waveFn(x)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.lineTo(fillX, H)
        ctx.lineTo(0, H)
        ctx.closePath()
        const gradient = ctx.createLinearGradient(0, 0, fillX, 0)
        gradient.addColorStop(0, '#FB7185')
        gradient.addColorStop(1, '#E11D48')
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Draw current position dot with glow
      if (progress > 0.01 && progress < 0.99) {
        const dotY = waveFn(fillX)
        ctx.beginPath()
        ctx.arc(fillX, dotY, 6, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(251, 113, 133, 0.15)'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(fillX, dotY, 4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(251, 113, 133, 0.3)'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(fillX, dotY, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = '#FB7185'
        ctx.fill()
      }

      animIdRef.current = requestAnimationFrame(draw)
    }
    animIdRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animIdRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [phase])

  // Timer (1s tick, but progress is smoothed by canvas loop)
  useEffect(() => {
    if (phase !== 'singing') return
    const interval = setInterval(() => {
      setElapsed((e) => {
        elapsedRef.current = e + 1
        if (elapsedRef.current >= TOTAL_DURATION) {
          handleStop()
          return e
        }
        return elapsedRef.current
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  // Track lyrics line
  useEffect(() => {
    if (lyrics.length === 0) return
    let lineIdx = 0
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (displaySeconds >= lyrics[i].time) { lineIdx = i; break }
    }
    setCurrentLine(lineIdx)
  }, [displaySeconds, lyrics])

  // Countdown
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown <= 0) { startSinging(); return }
    const t = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown])

  // Remove ghost message when singing starts
  useEffect(() => {
    if (phase === 'singing') {
      setGhostMessage('')
      if (ghostRef.current) gsap.to(ghostRef.current, { opacity: 0.6, duration: 0.3 })
    }
    if (phase === 'ready' && ghostRef.current) {
      gsap.to(ghostRef.current, { opacity: 1, duration: 0.3 })
    }
  }, [phase])

  const startSinging = useCallback(() => {
    setPhase('singing')
    setGhostMessage('')
    progressRef.current = 0
    elapsedRef.current = 0
    chunksRef.current = []

    if (isExam) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream)
          mediaRecorderRef.current = recorder
          recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
          recorder.onstop = () => finishAudio()
          recorder.start()
        })
        .catch(() => setError('无法访问麦克风'))
    }
  }, [isExam])

  const handleStart = () => {
    setPhase('countdown')
    setCountdown(3)
    setGhostMessage('')
  }

  const handleStop = useCallback(() => {
    if (phase !== 'singing') return
    setPhase('submitting')
    mediaRecorderRef.current?.stop()

    if (!isExam) {
      finishRecording()
    }
  }, [phase, isExam])

  const finishRecording = () => {
    // Both modes: generate mock score
    const pitchScore = Math.floor(Math.random() * 20) + 75
    const rhythmScore = Math.floor(Math.random() * 25) + 70
    const totalScore = Math.round(pitchScore * 0.6 + rhythmScore * 0.4)
    sessionStorage.setItem('lastResult', JSON.stringify({
      id: Date.now(), student_id: 1, song_id: songId,
      pitch_score: pitchScore, rhythm_score: rhythmScore, total_score: totalScore,
      errors: [
        { bar: 3, type: 'pitch', detail: '第3小节音准偏低，注意气息控制' },
        { bar: 5, type: 'rhythm', detail: '第5小节节奏稍有拖拍' },
      ],
      suggestions: ['唱高音时注意腹部发力', '副歌部分节奏可以更稳定', '整体表现不错！多练习效果更好'],
      created_at: new Date().toISOString(),
    }))
    navigate('/result')
  }

  const finishAudio = () => {
    finishRecording()
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  // Render lyric line with accent dots and breath marker
  const renderLyricLine = (line: LyricLine, isActive: boolean) => {
    const chars = line.text.split('')
    return (
      <div key={line.time} className={`py-1.5 text-center transition-all duration-500 ${isActive ? 'scale-105' : 'opacity-30'}`}>
        <span className={`inline-block text-responsive-2xl font-bold tracking-wide ${isActive ? 'text-rose-400' : 'text-text-muted'}`}>
          {chars.map((char, i) => (
            <span key={i} className="relative inline-block">
              {char}
              {line.accent?.includes(i) && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] text-rose-400">●</span>
              )}
            </span>
          ))}
        </span>
        {line.breath && (
          <span className="inline-flex items-center gap-1 ml-3 text-xs text-text-muted/60">
            💨<span className="text-[10px]">换气</span>
          </span>
        )}
      </div>
    )
  }

  if (!song) {
    navigate('/songs', { replace: true })
    return null
  }

  return (
    <div className="h-screen bg-gradient-to-b from-rose-50 to-surface flex flex-col overflow-hidden">
      {/* Minimal header */}
      <div className="bg-white/70 backdrop-blur-md border-b border-rose-100 flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-2.5">
          <button type="button" onClick={() => navigate('/songs')}
            className="flex items-center gap-1 text-text-muted hover:text-text-main transition-colors text-xs"
          ><ArrowLeft size={16} /> 退出</button>
          <div className="text-center">
            <p className="font-semibold text-text-main text-xs">{song.title}</p>
            <p className="text-[10px] text-text-muted/60">
              {isExam ? '🎯 考试模式' : '🎤 练习模式'}
              {phase === 'singing' && ` · ${formatTime(displaySeconds)} / ${formatTime(TOTAL_DURATION)}`}
            </p>
          </div>
          <div className="w-12 flex justify-end">
            {phase === 'singing' && <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />}
          </div>
        </div>
      </div>

      {/* Ghost in top-left + bubble */}
      <div ref={ghostRef} className="absolute top-14 left-6 z-10 flex items-start gap-2">
        <GhostSVG />
        {ghostMessage && (
          <div className="bg-white rounded-2xl px-3.5 py-2 shadow-md text-[11px] text-text-muted border border-rose-100 max-w-[180px]">
            <div className="absolute -left-1 top-3 w-2 h-2 bg-white rotate-45 border-l border-b border-rose-100" />
            {ghostMessage}
          </div>
        )}
      </div>

      {/* Main area - fills remaining space */}
      <div className="flex-1 flex flex-col min-h-0 px-6 py-4 gap-4">
        {/* Mountain wave progress bar */}
        <div className="h-16 2xl:h-[clamp(3rem,6vw,5rem)] bg-white/50 rounded-card shadow-sm overflow-hidden flex-shrink-0">
          <canvas ref={waveCanvasRef} className="w-full h-full" />
        </div>

        {/* Lyrics area - fills remaining vertical space */}
        <div className="flex-1 bg-white/40 rounded-card shadow-sm overflow-hidden relative min-h-0">
          {phase !== 'ready' && phase !== 'countdown' ? (
            <div ref={lyricsRef} className="h-full flex flex-col justify-center px-6" style={{ scrollbarWidth: 'none' }}>
              {lyrics.length > 0 ? (
                <div className="space-y-1">
                  {lyrics.map((line, i) => renderLyricLine(line, i === currentLine))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted">
                  <p>暂无歌词数据</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-text-muted/30 text-lg">{isExam ? '🎯 考试模式' : '🎤 练习模式'}</p>
                <p className="text-text-muted/20 text-sm mt-1">{isExam ? '歌词默认隐藏，演唱后显示' : '准备开始跟唱'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && <p className="text-rose-500 text-xs text-center bg-rose-50 px-3 py-1.5 rounded-card flex-shrink-0">{error}</p>}
      </div>

      {/* Bottom controls - minimal */}
      <div className="flex-shrink-0 border-t border-rose-100 bg-white/50 backdrop-blur-sm px-6 py-3">
        <div className="flex justify-center">
          {phase === 'ready' && (
            <button type="button" onClick={handleStart}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 text-white font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-md flex items-center gap-2"
            >
              <Microphone size={18} weight="bold" />
              {isExam ? '开始考试' : '开始跟唱'}
            </button>
          )}
          {phase === 'countdown' && (
            <div className="text-[48px] font-bold text-rose-400 animate-pulse">{countdown}</div>
          )}
          {phase === 'singing' && (
            <button type="button" onClick={handleStop}
              className="px-6 py-3 rounded-full bg-white border-2 border-rose-200 text-text-main font-semibold text-sm hover:bg-rose-50 transition-all shadow-sm flex items-center gap-2"
            >
              <StopCircle size={18} className="text-rose-400" weight="fill" />
              {isExam ? '结束考试' : '结束跟唱'}
            </button>
          )}
          {phase === 'submitting' && (
            <div className="flex items-center gap-2 text-text-muted">
              <div className="w-4 h-4 border-2 border-rose-200 border-t-rose-400 rounded-full animate-spin" />
              <span className="text-xs">评分中...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}