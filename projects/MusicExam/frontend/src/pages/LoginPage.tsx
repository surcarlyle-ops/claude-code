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

  const quickDemo = () => {
    sessionStorage.setItem('student', JSON.stringify({ id: 1, name: '张三', student_number: '2024001' }))
    navigate('/')
  }

  const openCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
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
    <div className="min-h-screen bg-surface flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-pink-soft via-surface to-blue-sky items-center justify-center relative overflow-hidden">
        <div className="absolute top-10 left-10 text-coral/20"><Sparkle size={48} weight="fill" /></div>
        <div className="absolute bottom-20 right-20 text-coral/15"><Sparkle size={32} weight="fill" /></div>
        <div className="text-center">
          <div className="text-8xl mb-6">🎵</div>
          <h1 className="text-[48px] font-bold text-text-main mb-3">MusicExam</h1>
          <p className="font-handwriting text-2xl text-text-muted">你的音乐练习伙伴</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-10">
        <div className="w-full max-w-sm">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-10">
            <div className="text-5xl mb-3">🎵</div>
            <h1 className="text-[32px] font-bold text-text-main mb-1">MusicExam</h1>
            <p className="font-handwriting text-text-muted text-xl">你的音乐练习伙伴</p>
          </div>

          <h2 className="text-xl font-bold text-text-main mb-6 text-center">考生身份确认</h2>

          {/* Face capture */}
          <div className="flex flex-col items-center mb-8">
            {facePreview ? (
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-mint shadow-md">
                  <img src={facePreview} alt="已拍照" className="w-full h-full object-cover" />
                </div>
                <button onClick={retakePhoto} type="button" className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md border border-gray-100 text-text-muted hover:text-coral transition-colors" title="重新拍照">
                  <Camera size={14} />
                </button>
                <p className="text-xs text-teal-mint font-medium text-center mt-2">✅ 照片已就绪</p>
              </div>
            ) : cameraOpen ? (
              <div className="relative">
                <video ref={videoRef} autoPlay playsInline className="w-24 h-24 rounded-full object-cover border-[3px] border-pink-soft shadow-md" />
                <button onClick={capturePhoto} type="button" className="absolute -bottom-1 -right-1 bg-coral text-white rounded-full p-1.5 shadow-md hover:opacity-90 transition-opacity" title="拍照">
                  <Check size={14} weight="bold" />
                </button>
              </div>
            ) : (
              <button onClick={openCamera} type="button" className="w-24 h-24 rounded-full bg-pink-soft flex items-center justify-center border-[3px] border-dashed border-coral/30 hover:border-coral/60 transition-all duration-300 group" title="开启摄像头">
                <Camera size={28} className="text-coral/50 group-hover:text-coral/80 transition-colors" />
              </button>
            )}
            {!facePreview && !cameraOpen && <p className="text-xs text-text-muted mt-2">点击圆圈开启摄像头拍照</p>}
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-text-main mb-1.5">姓名</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="输入你的真实姓名" className="w-full px-4 py-3 rounded-input bg-white border border-gray-200 text-text-main placeholder:text-gray-300 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/10 transition-all duration-200" />
          </div>

          {/* Student number */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-text-main mb-1.5">学号</label>
            <input type="text" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} placeholder="输入你的学号" className="w-full px-4 py-3 rounded-input bg-white border border-gray-200 text-text-main placeholder:text-gray-300 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/10 transition-all duration-200" />
          </div>

          {error && <p className="text-coral text-sm mb-4 text-center bg-coral/5 px-4 py-2 rounded-card">{error}</p>}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={!canSubmit || loading} className={`w-full py-3.5 rounded-btn font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${canSubmit && !loading ? 'bg-gradient-to-r from-coral to-coral/90 hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : 'bg-gray-200 cursor-not-allowed'}`}>
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>{canSubmit ? '开始考试' : '请完善信息'} <ArrowRight size={18} weight="bold" /></>
            )}
          </button>

          {/* Demo link */}
          <div className="mt-6 text-center">
            <button type="button" onClick={() => { sessionStorage.setItem('student', JSON.stringify({ id: 1, name: '张三', student_number: '2024001' })); navigate('/') }} className="text-sm text-text-muted hover:text-text-main transition-colors">跳过登录，直接体验 →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
