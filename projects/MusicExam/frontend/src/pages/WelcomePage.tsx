import { useNavigate } from 'react-router-dom'
import { Microphone, MusicNote, Star, Sparkle, ArrowRight } from '@phosphor-icons/react'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-hidden">
      {/* Background color blocks - 色块拼接背景 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top yellow block */}
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-[80px] bg-yellow-cream/70 rotate-12" />
        {/* Left pink block */}
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-[48px] bg-pink-soft/60 -rotate-6" />
        {/* Right blue block */}
        <div className="absolute bottom-1/3 right-0 w-48 h-48 rounded-full bg-blue-sky/50" />
        {/* Bottom green block */}
        <div className="absolute -bottom-16 left-1/4 w-72 h-72 rounded-[64px] bg-mint/50 rotate-12" />
        {/* Purple accent */}
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-purple-lavender/40" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-12 2xl:px-16 gap-8 lg:gap-12 2xl:gap-16 relative z-10">
        {/* Left: Modern abstract illustration */}
        <div className="relative w-full max-w-md lg:max-w-lg 2xl:max-w-xl aspect-square lg:aspect-[4/3]">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Central floating card composition */}
            <div className="relative">
              {/* Main card - yellow */}
              <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-[32px] bg-yellow-cream shadow-lg flex items-center justify-center rotate-6">
                <MusicNote size={64} weight="fill" className="text-yellow-bright" />
              </div>
              {/* Overlapping card - pink */}
              <div className="absolute -top-8 -right-12 w-36 h-36 lg:w-44 lg:h-44 rounded-[28px] bg-pink-soft shadow-md flex items-center justify-center -rotate-6">
                <Microphone size={48} weight="fill" className="text-pink-bright" />
              </div>
              {/* Overlapping card - blue */}
              <div className="absolute -bottom-10 -left-10 w-32 h-32 lg:w-40 lg:h-40 rounded-[24px] bg-blue-sky shadow-md flex items-center justify-center rotate-12">
                <Star size={40} weight="fill" className="text-blue-bright" />
              </div>
              {/* Small accent - green */}
              <div className="absolute bottom-8 -right-4 w-16 h-16 rounded-2xl bg-mint flex items-center justify-center">
                <Sparkle size={24} weight="fill" className="text-mint-bright" />
              </div>
            </div>

            {/* Floating elements */}
            <MusicNote size={28} weight="fill" className="absolute top-8 right-12 text-coral/60 animate-bounce" style={{ animationDuration: '2s' }} />
            <Star size={20} weight="fill" className="absolute bottom-20 left-8 text-purple-bright/50 animate-pulse" />
            <Sparkle size={16} weight="fill" className="absolute top-1/3 left-4 text-teal-mint/60 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Right: Text + CTA */}
        <div className="text-center lg:text-left max-w-sm 2xl:max-w-lg">
          {/* Brand tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-soft/80 mb-6">
            <MusicNote size={18} weight="fill" className="text-pink-bright" />
            <span className="text-sm font-bold text-text-main">MusicExam</span>
          </div>

          {/* Main headline - 超大粗体 */}
          <h1 className="text-responsive-5xl font-black text-text-main leading-[1.1] mb-4">
            唱出你的
            <br />
            <span className="text-coral">最好成绩</span>
          </h1>

          {/* Subtitle */}
          <p className="text-text-muted text-responsive-lg mb-2 font-medium">
            上海中小学音乐考试练习平台
          </p>
          <p className="text-text-light text-responsive-base mb-10">
            对着镜头唱一首，AI 实时评分，知道你哪里唱得好、哪里需要练
          </p>

          {/* CTA Button - 深色药丸形 */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="btn-dark text-responsive-lg"
          >
            <Microphone size={24} weight="bold" />
            开始练习
            <ArrowRight size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* Bottom: feature pills */}
      <div className="relative z-10 py-6 px-6">
        <div className="container-wide flex flex-wrap justify-center gap-3">
          <div className="pill-tag bg-card-pink text-text-main">
            <Star size={14} weight="fill" className="text-coral" />
            AI 智能评分
          </div>
          <div className="pill-tag bg-card-yellow text-text-main">
            <MusicNote size={14} weight="fill" className="text-yellow-bright" />
            实时反馈
          </div>
          <div className="pill-tag bg-card-green text-text-main">
            <Sparkle size={14} weight="fill" className="text-mint-bright" />
            进度追踪
          </div>
        </div>
      </div>
    </div>
  )
}
