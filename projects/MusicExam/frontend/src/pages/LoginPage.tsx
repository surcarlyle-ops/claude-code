import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Camera, Check, X } from '@phosphor-icons/react'
import gsap from 'gsap'

const GRADES = [
  { value: 'p3', label: '小学三年级' },
  { value: 'p4', label: '小学四年级' },
  { value: 'p5', label: '小学五年级' },
  { value: 'm1', label: '初中预备班' },
  { value: 'm2', label: '初中一年级' },
  { value: 'm3', label: '初中二年级' },
  { value: 'm4', label: '初中三年级' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [faceBlob, setFaceBlob] = useState<Blob | null>(null)
  const [facePreview, setFacePreview] = useState<string | null>(null)
  const [cameraModalOpen, setCameraModalOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = name.trim() && grade && faceBlob

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [])

  // GSAP success animation
  useEffect(() => {
    if (!showSuccess || !successRef.current) return
    gsap.fromTo(
      successRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    )
    const tl = gsap.timeline()
    tl.to(successRef.current, { scale: 1.1, duration: 0.2, ease: 'power2.out' })
      .to(successRef.current, { scale: 1, duration: 0.15, ease: 'power2.in' })
  }, [showSuccess])

  const openCameraModal = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      setCameraModalOpen(true)
      setError('')
      // Wait for next render, then assign stream
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream
      }, 50)
    } catch {
      setError('请在浏览器设置中允许摄像头访问')
    }
  }, [])

  const captureFromModal = useCallback(() => {
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
        // Stop camera
        streamRef.current?.getTracks().forEach((t) => t.stop())
        streamRef.current = null
        setCameraModalOpen(false)
        // Show success animation
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
      }
    }, 'image/jpeg')
  }, [])

  const handleSubmit = () => {
    if (!name.trim()) { setError('请输入你的真实姓名'); return }
    if (!grade) { setError('请选择你的年级'); return }
    if (!faceBlob) { setError('请先完成人脸验证'); return }
    sessionStorage.setItem('student', JSON.stringify({
      id: Date.now(),
      name: name.trim(),
      grade: grade,
    }))
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-rose-100 via-surface to-mint items-center justify-center relative overflow-hidden">
        <div className="relative w-64 h-64">
          <div className="absolute top-0 left-0 w-32 h-32 rounded-[28px] bg-rose-200/80 rotate-12" />
          <div className="absolute bottom-4 right-0 w-36 h-36 rounded-[28px] bg-mint/60 -rotate-6" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-yellow-cream/80" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-20 bg-white rounded-xl shadow-md rotate-12 flex items-center justify-center border border-gray-100">
              <span className="text-3xl">🎵</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 text-center">
          <p className="font-handwriting text-2xl text-text-muted">唱出你的最好成绩</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-4xl mb-2">🎵</div>
            <h1 className="text-2xl font-bold text-text-main">MusicExam</h1>
            <p className="font-handwriting text-text-muted text-lg">唱出你的最好成绩</p>
          </div>

          <h2 className="text-xl font-bold text-text-main mb-2 text-center lg:text-left">同学你好！</h2>
          <p className="text-sm text-text-muted mb-8 text-center lg:text-left">先完成身份验证，马上开始练习</p>

          {/* Face verification — click to open modal */}
          <div className="flex flex-col items-center mb-6">
            <label className="block text-sm font-semibold text-text-main mb-3">① 人脸验证</label>
            {facePreview ? (
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-rose-300 shadow-md">
                  <img src={facePreview} alt="已拍照" className="w-full h-full object-cover" />
                </div>
                <button onClick={() => openCameraModal()} type="button"
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md border border-gray-100 text-text-muted hover:text-rose-400 transition-colors"
                  title="重新拍照"
                >
                  <Camera size={14} />
                </button>
              </div>
            ) : (
              <button onClick={openCameraModal} type="button"
                className="w-28 h-28 rounded-full bg-rose-50 flex items-center justify-center border-[3px] border-dashed border-rose-200 hover:border-rose-400 hover:bg-rose-100 transition-all duration-300 group cursor-pointer"
                title="开启摄像头"
              >
                <Camera size={32} className="text-rose-300 group-hover:text-rose-400 transition-colors" />
              </button>
            )}
            {!facePreview && (
              <p className="text-xs text-text-muted mt-2">点击圆圈开启摄像头，对准脸部拍照</p>
            )}

            {/* Success flash animation */}
            {showSuccess && (
              <div ref={successRef} className="mt-3 px-4 py-2 bg-mint rounded-full shadow-sm">
                <p className="text-sm text-teal-mint font-semibold flex items-center gap-2">
                  <Check size={16} weight="bold" />
                  人脸采集成功！
                </p>
              </div>
            )}
          </div>

          {/* Name */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-text-main mb-1.5">② 姓名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入你的真实姓名"
              className="w-full px-4 py-3.5 rounded-input bg-white border-2 border-gray-200 text-text-main placeholder:text-gray-300 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all duration-200 text-base"
            />
          </div>

          {/* Grade */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-main mb-1.5">③ 你的年级</label>
            <div className="grid grid-cols-2 gap-2">
              {GRADES.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => { setGrade(g.value); setError('') }}
                  className={`px-3 py-3 rounded-btn text-sm font-medium transition-all duration-200 border-2 cursor-pointer ${
                    grade === g.value
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm'
                      : 'bg-white text-text-muted border-gray-200 hover:border-rose-200 hover:text-text-main'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-rose-500 text-sm mb-4 text-center bg-rose-50 px-4 py-2 rounded-card">{error}</p>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-3.5 rounded-btn font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
              canSubmit
                ? 'bg-gradient-to-r from-rose-400 to-rose-500 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                : 'bg-gray-200 cursor-not-allowed'
            }`}
          >
            进入练习 <ArrowRight size={18} weight="bold" />
          </button>

          {/* Skip link */}
          <div className="mt-6 text-center">
            <button type="button"
              onClick={() => {
                sessionStorage.setItem('student', JSON.stringify({ id: Date.now(), name: '同学', grade: 'p5' }))
                navigate('/home')
              }}
              className="text-sm text-text-muted hover:text-text-main transition-colors cursor-pointer"
            >
              先跳过，直接体验 →
            </button>
          </div>
        </div>
      </div>

      {/* Camera modal */}
      {cameraModalOpen && (
        <div ref={modalRef} className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl max-w-lg w-full">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-text-main">人脸验证</h3>
              <button type="button" title="关闭摄像头"
                onClick={() => {
                  streamRef.current?.getTracks().forEach((t) => t.stop())
                  streamRef.current = null
                  setCameraModalOpen(false)
                }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Camera viewfinder */}
            <div className="px-6 py-6">
              <div className="relative bg-gray-900 rounded-[16px] overflow-hidden aspect-[4/3] shadow-inner">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {/* Face guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 rounded-full border-[3px] border-white/30" />
                </div>
                {/* Hint text */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="text-white/60 text-xs bg-black/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
                    将脸部对准圆圈
                  </span>
                </div>
              </div>

              <button type="button" onClick={captureFromModal}
                className="mt-5 w-full py-3.5 rounded-btn bg-rose-400 text-white font-semibold hover:bg-rose-500 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera size={18} weight="bold" />
                拍照采集
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}