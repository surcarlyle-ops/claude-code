import { useNavigate } from 'react-router-dom'
import { Microphone, MusicNote, Star, Sparkle } from '@phosphor-icons/react'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-12 2xl:px-16 gap-8 lg:gap-12 2xl:gap-16">
        {/* Left: Illustration area */}
        <div className="relative w-full max-w-md lg:max-w-lg 2xl:max-w-2xl aspect-square lg:aspect-[4/3] 2xl:aspect-[16/9]">
          {/* Abstract flat vector illustration using colored shapes */}
          <div className="relative w-full h-full">
            {/* Background shapes */}
            <div className="absolute top-4 left-4 w-32 h-32 rounded-[32px] bg-rose-200/60 rotate-12" />
            <div className="absolute bottom-8 right-6 w-40 h-40 rounded-[32px] bg-mint/60 -rotate-6" />
            <div className="absolute top-1/3 right-8 w-24 h-24 rounded-full bg-purple-lavender/70" />
            <div className="absolute bottom-1/4 left-8 w-20 h-20 rounded-full bg-yellow-cream/80" />

            {/* Central character - abstract person singing */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Body */}
                <div className="w-36 h-44 rounded-[40px] bg-gradient-to-b from-rose-300 to-rose-400 shadow-lg flex items-center justify-center">
                  {/* Head */}
                  <div className="absolute -top-12 w-24 h-24 rounded-full bg-yellow-cream border-4 border-rose-200 flex items-center justify-center">
                    {/* Face */}
                    <div className="relative">
                      {/* Eyes */}
                      <div className="flex gap-4 mb-2">
                        <div className="w-3 h-3 rounded-full bg-text-main" />
                        <div className="w-3 h-3 rounded-full bg-text-main" />
                      </div>
                      {/* Mouth - singing */}
                      <div className="w-6 h-3 rounded-full bg-rose-300 mx-auto" />
                    </div>
                  </div>
                  {/* Headphones */}
                  <div className="absolute -top-10 w-28 h-10 rounded-t-full border-[5px] border-rose-500 border-b-0" />
                </div>
                {/* Arm holding mic */}
                <div className="absolute -right-8 bottom-16 w-8 h-20 rounded-full bg-yellow-cream rotate-[30deg] border-2 border-rose-200" />
                {/* Microphone */}
                <div className="absolute -right-14 bottom-20">
                  <div className="w-3 h-16 bg-gray-400 rounded-full" />
                  <div className="w-8 h-6 bg-gray-600 rounded-full -mt-1 ml-[-10px]" />
                </div>
              </div>
            </div>

            {/* Floating music notes */}
            <MusicNote size={28} weight="fill" className="absolute top-6 right-10 text-rose-400 animate-bounce" style={{ animationDuration: '2s' }} />
            <MusicNote size={20} weight="fill" className="absolute bottom-16 left-6 text-mint-400 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
            <Star size={18} weight="fill" className="absolute top-20 left-12 text-yellow-400 animate-pulse" />
            <Sparkle size={16} weight="fill" className="absolute bottom-24 right-16 text-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Right: Text + CTA */}
        <div className="text-center lg:text-left max-w-sm 2xl:max-w-lg">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
            <span className="text-responsive-2xl">🎵</span>
            <h2 className="text-responsive-lg font-bold text-rose-400 tracking-wide">MusicExam</h2>
          </div>

          <h1 className="text-responsive-4xl font-bold text-text-main leading-tight mb-3">
            唱出你的<br />
            <span className="text-rose-400">最好成绩</span>
          </h1>

          <p className="text-text-muted text-responsive-lg mb-2">
            上海中小学音乐考试练习平台
          </p>
          <p className="text-text-muted/70 text-responsive-sm mb-8">
            对着镜头唱一首，AI 实时评分，知道你哪里唱得好、哪里需要练
          </p>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-[clamp(1.5rem,4vw,2.5rem)] py-[clamp(0.75rem,1.5vw,1.25rem)] rounded-btn bg-gradient-to-r from-rose-400 to-rose-500 text-white text-responsive-lg font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-200 shadow-md"
          >
            <Microphone size={22} weight="bold" />
            开始练习
          </button>
        </div>
      </div>

      {/* Bottom decoration: music note strip */}
      <div className="py-4 border-t border-rose-100/50">
        <div className="flex items-center justify-center gap-4 text-rose-200/60 text-sm overflow-hidden">
          <span className="font-handwriting text-xl">♩</span>
          <span className="font-handwriting text-lg">♪</span>
          <span className="font-handwriting text-xl">♫</span>
          <span className="font-handwriting text-lg">♬</span>
          <span className="font-handwriting text-base text-rose-300/40">—— 唱出自信，唱出进步 ——</span>
          <span className="font-handwriting text-lg">♩</span>
          <span className="font-handwriting text-xl">♪</span>
          <span className="font-handwriting text-lg">♫</span>
          <span className="font-handwriting text-xl">♬</span>
        </div>
      </div>
    </div>
  )
}