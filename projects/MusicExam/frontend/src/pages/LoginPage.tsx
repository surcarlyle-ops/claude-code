import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Check, ArrowRight, Sparkle } from '@phosphor-icons/react'
import { registerStudent } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [name, setName] = useState('')
  const [studentNumber, setStudentNumber] = useState('')
  const [faceBlob, setFaceBlob] = useState<Blob | null>(null)
  const [facePreview, setFacePreview] = useState<string | null>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const openCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraOpen(true)
      setError('')
    } catch {
      setError('请在浏览器设置中允许摄像头访问')
    }
  }, [])

  const capturePhoto = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')!.drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      if (blob) {
        setFaceBlob(blob)
        setFacePreview(URL.createObjectURL(blob))
        streamRef.current?.getTracks().forEach((t) => t.stop())
        streamRef.current = null
        setCameraOpen(false)
      }
    }, 'image/jpeg')
  }, [])

  const retakePhoto = () => {
    setFaceBlob(null)
    setFacePreview(null)
    openCamera()
  }

  const canSubmit = name.trim() && studentNumber.trim() && faceBlob

  const handleSubmit = async () => {
    if (!canSubmit || !faceBlob) return
    setLoading(true)
    setError('')
    try {
      const file = new File([faceBlob], 'face.jpg', { type: 'image/jpeg' })
      const student = await registerStudent(name.trim(), studentNumber.trim(), file)
      sessionStorage.setItem('student', JSON.stringify(student))
      navigate('/')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-5 py-10">
      {/* Decorative elements */}
      <div className="absolute top-8 left-8 text-pink-soft opacity-50">
        <Sparkle size={24} weight="fill" />
      </div>
      <div className="absolute top-12 right-12 text-yellow-cream opacity-50">
        <Sparkle size={18} weight="fill" />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[32px] font-bold text-text-main mb-1">
          🎵 MusicExam
        </h1>
        <p className="font-handwriting text-text-muted text-xl">
          你的音乐练习伙伴
        </p>
      </div>

      {/* Face capture area */}
      <div className="mb-8 flex flex-col items-center">
        {facePreview ? (
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-mint shadow-md">
              <img
                src={facePreview}
                alt="已拍照"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={retakePhoto}
              className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-md border border-gray-100 text-text-muted hover:text-coral transition-colors"
            >
              <Camera size={16} />
            </button>
            <p className="text-xs text-teal-mint font-medium text-center mt-2">
              ✅ 照片已就绪
            </p>
          </div>
        ) : cameraOpen ? (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-28 h-28 rounded-full object-cover border-[3px] border-pink-soft shadow-md"
            />
            <button
              onClick={capturePhoto}
              className="absolute -bottom-1 -right-1 bg-coral text-white rounded-full p-2 shadow-md hover:opacity-90 transition-opacity"
            >
              <Check size={16} weight="bold" />
            </button>
            <p className="text-xs text-text-muted text-center mt-2">
              📸 点击下方按钮拍照
            </p>
          </div>
        ) : (
          <button
            onClick={openCamera}
            className="w-28 h-28 rounded-full bg-pink-soft flex items-center justify-center border-[3px] border-dashed border-coral/30 hover:border-coral/60 transition-all duration-300 group hover:bg-pink-soft/80"
          >
            <Camera
              size={36}
              className="text-coral/50 group-hover:text-coral/80 transition-colors"
            />
          </button>
        )}
        {!facePreview && !cameraOpen && (
          <p className="text-xs text-text-muted mt-2">
            点击上方圆圈开启摄像头拍照
          </p>
        )}
      </div>

      {/* Name input */}
      <div className="w-full max-w-sm mb-4">
        <label className="block text-sm font-semibold text-text-main mb-1.5">
          姓名
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入你的真实姓名"
          className="w-full px-5 py-3.5 rounded-input bg-white border border-gray-200 text-text-main placeholder:text-gray-300 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/10 transition-all duration-200"
        />
      </div>

      {/* Student number input */}
      <div className="w-full max-w-sm mb-8">
        <label className="block text-sm font-semibold text-text-main mb-1.5">
          学号
        </label>
        <input
          type="text"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
          placeholder="输入你的学号"
          className="w-full px-5 py-3.5 rounded-input bg-white border border-gray-200 text-text-main placeholder:text-gray-300 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/10 transition-all duration-200"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-coral text-sm mb-4 max-w-sm text-center bg-coral/5 px-4 py-2 rounded-card">
          {error}
        </p>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        className={`w-full max-w-sm py-3.5 rounded-btn font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
          canSubmit && !loading
            ? 'bg-gradient-to-r from-coral to-coral/90 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
            : 'bg-gray-200 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            {canSubmit ? '开始考试' : '请完善信息'}
            <ArrowRight size={18} weight="bold" />
          </>
        )}
      </button>

      <p className="text-text-muted text-sm mt-6 hover:text-text-main cursor-pointer transition-colors">
        首次使用？看看怎么操作 →
      </p>

      {/* Demo mode */}
      <div className="mt-8 pt-6 border-t border-gray-100 w-full max-w-sm">
        <p className="text-xs text-text-muted mb-3 text-center">
          💡 演示模式
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(
                'student',
                JSON.stringify({
                  id: 1,
                  name: '张三',
                  student_number: '2024001',
                })
              )
              navigate('/')
            }}
            className="flex-1 py-2.5 rounded-btn bg-white border border-gray-200 text-xs text-text-main font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-1"
          >
            <span>🏠</span> 首页
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(
                'student',
                JSON.stringify({
                  id: 1,
                  name: '张三',
                  student_number: '2024001',
                })
              )
              sessionStorage.setItem('selectedSongId', '1')
              navigate('/exam')
            }}
            className="flex-1 py-2.5 rounded-btn bg-white border border-gray-200 text-xs text-text-main font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-1"
          >
            <span>🎤</span> 考试
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(
                'student',
                JSON.stringify({
                  id: 1,
                  name: '张三',
                  student_number: '2024001',
                })
              )
              sessionStorage.setItem('lastResult',
                JSON.stringify({
                  id: 1,
                  student_id: 1,
                  song_id: 1,
                  pitch_score: 92,
                  rhythm_score: 85,
                  total_score: 89.2,
                  errors: [
                    { bar: 3, type: 'pitch', detail: '音高偏低，偏低了大二度' },
                    { bar: 8, type: 'rhythm', detail: '节奏偏快，比参考快0.3秒' },
                    { bar: 12, type: 'pitch', detail: '音高偏高' },
                  ],
                  suggestions: [
                    '第3-5小节音准偏低，建议单独慢速练习',
                    '中段节奏偏快，可以跟着节拍器先练',
                    '高音部分不错，继续保持！',
                  ],
                })
              )
              navigate('/result')
            }}
            className="flex-1 py-2.5 rounded-btn bg-white border border-gray-200 text-xs text-text-main font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-1"
          >
            <span>📊</span> 结果
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(
                'student',
                JSON.stringify({
                  id: 1,
                  name: '张三',
                  student_number: '2024001',
                })
              )
              navigate('/trends')
            }}
            className="flex-1 py-2.5 rounded-btn bg-white border border-gray-200 text-xs text-text-main font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-1"
          >
            <span>📈</span> 趋势
          </button>
        </div>
      </div>
    </div>
  )
}
