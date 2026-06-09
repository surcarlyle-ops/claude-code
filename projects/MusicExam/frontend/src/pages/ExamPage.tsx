import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, StopCircle, Warning } from '@phosphor-icons/react'
import { getSong, submitExam, type Song } from '../services/api'

const MEASURES = ['♩ ♩ ♩ ♩', '♩ ♩ ♩ ♩', '♩ ♪ ♪ ♩', '♩ ♩ ♩ ♩']
const MEASURE_DURATION = 4 // seconds per measure (4/4 at moderate tempo)

export default function ExamPage() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pitchHistoryRef = useRef<{ time: number; value: number }[]>([])
  const elapsedRef = useRef(0) // shared elapsed counter for pitch + measure intervals

  const [song, setSong] = useState<Song | null>(null)
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'singing' | 'submitting' | 'done'>('ready')
  const [countdown, setCountdown] = useState(3)
  const [elapsed, setElapsed] = useState(0)
  const [faceLost, setFaceLost] = useState(false)
  const [pitchScore, setPitchScore] = useState(0)
  const [rhythmScore, setRhythmScore] = useState(0)
  const [error, setError] = useState('')
  const [activeMeasure, setActiveMeasure] = useState(0)

  const studentId = (() => {
    try {
      const s = JSON.parse(sessionStorage.getItem('student') ?? '{}')
      return s.id as number
    } catch { return 0 }
  })()

  const songId = (() => {
    const id = sessionStorage.getItem('selectedSongId')
    return id ? parseInt(id) : null
  })()

  useEffect(() => {
    if (!studentId || !songId) {
      navigate('/', { replace: true })
      return
    }
    getSong(songId).then(setSong).catch(() => navigate('/songs'))
  }, [songId, navigate, studentId])

  // Camera
  useEffect(() => {
    if (phase === 'ready' || phase === 'singing') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream
        })
        .catch(() => setError('请允许摄像头和麦克风访问'))
    }
  }, [phase])

  // Canvas drawing effect — runs during singing phase
  useEffect(() => {
    if (phase !== 'singing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const PAD = { top: 20, right: 30, bottom: 30, left: 40 }
    const PW = W - PAD.left - PAD.right
    const PH = H - PAD.top - PAD.bottom

    // Simulated reference pitch curve (sin wave as placeholder for demo)
    const refPoints: { x: number; y: number }[] = []
    for (let i = 0; i <= PW; i += 2) {
      const t = i / PW
      const y = PAD.top + PH / 2 + Math.sin(t * Math.PI * 4) * PH * 0.3
      refPoints.push({ x: PAD.left + i, y })
    }

    let animId: number
    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Grid lines
      ctx.strokeStyle = '#E8E8E8'
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        const y = PAD.top + (PH / 4) * i
        ctx.beginPath()
        ctx.moveTo(PAD.left, y)
        ctx.lineTo(W - PAD.right, y)
        ctx.stroke()
      }

      // Reference curve (dashed gray)
      if (refPoints.length > 1) {
        ctx.strokeStyle = '#B0B0B0'
        ctx.lineWidth = 2
        ctx.setLineDash([6, 4])
        ctx.beginPath()
        ctx.moveTo(refPoints[0].x, refPoints[0].y)
        for (let i = 1; i < refPoints.length; i++) {
          ctx.lineTo(refPoints[i].x, refPoints[i].y)
        }
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Student pitch curve (solid coral)
      const history = pitchHistoryRef.current
      if (history.length > 1) {
        ctx.strokeStyle = '#FF6B6B'
        ctx.lineWidth = 2.5
        ctx.beginPath()
        const duration = song?.duration ?? 60
        const firstX = PAD.left + (history[0].time / duration) * PW
        const firstY = PAD.top + PH / 2 - (history[0].value - 440) / 440 * PH * 0.4
        ctx.moveTo(firstX, Math.max(PAD.top, Math.min(H - PAD.bottom, firstY)))
        for (let i = 1; i < history.length; i++) {
          const x = PAD.left + (history[i].time / duration) * PW
          const y = PAD.top + PH / 2 - (history[i].value - 440) / 440 * PH * 0.4
          ctx.lineTo(x, Math.max(PAD.top, Math.min(H - PAD.bottom, y)))
        }
        ctx.stroke()
      }

      // Axis labels
      ctx.fillStyle = '#636E72'
      ctx.font = '11px Nunito, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText('高', PAD.left - 6, PAD.top + 12)
      ctx.fillText('低', PAD.left - 6, H - PAD.bottom)

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => cancelAnimationFrame(animId)
  }, [phase, song])

  const startRecording = useCallback(() => {
    setPhase('singing')
    setElapsed(0)
    elapsedRef.current = 0
    setActiveMeasure(0)
    pitchHistoryRef.current = []
    chunksRef.current = []

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream)
        mediaRecorderRef.current = recorder
        recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
        recorder.onstop = () => submitAudio()
        recorder.start()
      })
      .catch(() => setError('无法访问麦克风'))
  }, [])

  const stopRecording = useCallback(() => {
    setPhase('submitting')
    mediaRecorderRef.current?.stop()
  }, [])

  // Countdown
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown <= 0) {
      startRecording()
      return
    }
    const t = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown])

  // Elapsed timer + simulated scores + pitch history + measure highlight
  useEffect(() => {
    if (phase !== 'singing') return

    // Sync elapsedRef with state each second
    const interval = setInterval(() => {
      setElapsed((e) => {
        elapsedRef.current = e + 1
        if (song && elapsedRef.current >= song.duration) {
          stopRecording()
          return e
        }
        return elapsedRef.current
      })
    }, 1000)

    // Simulate real-time scores
    const scoreInterval = setInterval(() => {
      setPitchScore(Math.min(100, Math.floor(Math.random() * 30) + 70))
      setRhythmScore(Math.min(100, Math.floor(Math.random() * 25) + 65))
    }, 1500)

    // Simulate pitch data points for the curve (every 200ms)
    const pitchInterval = setInterval(() => {
      const t = elapsedRef.current
      const baseFreq = 440
      const variation = Math.sin(t * 0.5) * 40 + (Math.random() - 0.5) * 30
      pitchHistoryRef.current.push({ time: t, value: baseFreq + variation })
    }, 200)

    // Update active measure based on elapsed (every 500ms)
    const measureInterval = setInterval(() => {
      setActiveMeasure(Math.min(MEASURES.length - 1, Math.floor(elapsedRef.current / MEASURE_DURATION)))
    }, 500)

    return () => {
      clearInterval(interval)
      clearInterval(scoreInterval)
      clearInterval(pitchInterval)
      clearInterval(measureInterval)
    }
  }, [phase, song, stopRecording])

  const submitAudio = async () => {
    const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
    const file = new File([blob], 'recording.webm', { type: 'audio/webm' })
    try {
      const result = await submitExam(studentId, songId!, file)
      sessionStorage.setItem('lastResult', JSON.stringify(result))
      setPhase('done')
      navigate('/result')
    } catch {
      setError('提交评分失败，请重试')
      setPhase('singing')
    }
  }

  const handleStart = () => setPhase('countdown')
  const handleStop = () => stopRecording()

  const progressPercent = song ? (elapsed / song.duration) * 100 : 0
  const totalScore = Math.round(pitchScore * 0.6 + rhythmScore * 0.4)
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (!song) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-coral/30 border-t-coral rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/50 backdrop-blur border-b border-gray-100">
        <button
          type="button"
          onClick={() => navigate('/songs')}
          className="flex items-center gap-1 text-text-muted hover:text-text-main transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">退出</span>
        </button>
        <div className="text-center">
          <p className="font-semibold text-text-main">{song.title}</p>
          <p className="text-xs text-text-muted">{formatTime(elapsed)} / {formatTime(song.duration)}</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Main area */}
      <div className="flex-1 px-5 py-4 flex gap-4 max-w-5xl mx-auto w-full">
        {/* Camera */}
        <div className="w-48 flex-shrink-0">
          <div className="rounded-card overflow-hidden bg-gray-900 aspect-[3/4] relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {faceLost && (
              <div className="absolute top-2 left-2 right-2 bg-yellow-cream text-text-main text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                <Warning size={14} className="text-coral" />
                未检测到人脸
              </div>
            )}
          </div>
          <p className="text-xs text-center mt-2 text-mint font-medium">
            {faceLost ? '⚠️ 请保持正对屏幕' : '● 在位'}
          </p>
        </div>

        {/* Score cards + pitch curve */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Score cards */}
          <div className="flex gap-3">
            <div className="flex-1 rounded-card bg-blue-sky p-4 text-center">
              <p className="text-xs text-text-muted mb-1">音准</p>
              <p className="text-2xl font-bold text-text-main">{pitchScore}%</p>
              <div className="mt-2 h-2 rounded-full bg-white/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal-mint transition-all duration-500"
                  style={{ width: `${pitchScore}%` }}
                />
              </div>
            </div>
            <div className="flex-1 rounded-card bg-mint p-4 text-center">
              <p className="text-xs text-text-muted mb-1">节奏</p>
              <p className="text-2xl font-bold text-text-main">{rhythmScore}%</p>
              <div className="mt-2 h-2 rounded-full bg-white/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-coral transition-all duration-500"
                  style={{ width: `${rhythmScore}%` }}
                />
              </div>
            </div>
            <div className="flex-1 rounded-card bg-purple-lavender p-4 text-center">
              <p className="text-xs text-text-muted mb-1">总分</p>
              <p className="text-2xl font-bold text-text-main">{totalScore}</p>
            </div>
          </div>

          {/* Pitch curve canvas */}
          <div className="flex-1 rounded-card bg-white p-4 flex flex-col min-h-0">
            <p className="text-xs text-text-muted mb-2">音高实时曲线</p>
            <div className="flex-1 relative min-h-0">
              <canvas
                ref={canvasRef}
                width={600}
                height={250}
                className="w-full h-full"
              />
              {phase !== 'singing' && (
                <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm bg-white/60">
                  等待开始
                </div>
              )}
            </div>
          </div>

          {/* Notation scroll placeholder */}
          <div className="rounded-card bg-white p-4">
            <p className="text-xs text-text-muted mb-2">简谱预览</p>
            <div className="flex gap-2 text-text-muted text-sm">
              <span className="text-coral font-bold">♩ ♩ ♩ ♩</span>
              <span>|</span>
              <span>♩ ♩ ♩ ♩</span>
              <span>|</span>
              <span className="bg-pink-soft rounded px-1">♩ ♪ ♪ ♩</span>
              <span>|</span>
              <span>♩ ♩ ♩ ♩</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar + controls */}
      <div className="px-5 py-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="h-3 rounded-full bg-gray-100 overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #FF6B6B, #FADADD)',
              }}
            />
          </div>

          {error && (
            <p className="text-coral text-sm text-center mb-3">{error}</p>
          )}

          <div className="flex justify-center">
            {phase === 'ready' && (
              <button
                type="button"
                onClick={handleStart}
                className="px-8 py-3 rounded-btn bg-coral text-white font-semibold hover:opacity-90 transition-opacity"
              >
                开始演唱
              </button>
            )}
            {phase === 'countdown' && (
              <div className="text-[64px] font-bold text-coral animate-pulse">{countdown}</div>
            )}
            {phase === 'singing' && (
              <button
                type="button"
                onClick={handleStop}
                className="flex items-center gap-2 px-6 py-3 rounded-btn bg-white border border-gray-200 text-text-main font-semibold hover:bg-gray-50 transition-colors"
              >
                <StopCircle size={20} className="text-coral" />
                结束演唱
              </button>
            )}
            {phase === 'submitting' && (
              <div className="flex items-center gap-2 text-text-muted">
                <div className="w-5 h-5 border-2 border-coral/30 border-t-coral rounded-full animate-spin" />
                评分中...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
