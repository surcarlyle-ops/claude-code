import { useNavigate } from 'react-router-dom'
import { Microphone, MusicNote, Star, Sparkle } from '@phosphor-icons/react'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Main content - full screen hero layout */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 2xl:px-24 gap-8 lg:gap-16">
        {/* Left: Character illustration - hero size */}
        <div className="relative w-full lg:w-auto lg:flex-1 max-w-2xl flex items-center justify-center">
          {/* Single large character - no overlapping abstract shapes */}
          <div className="relative scale-[1.5] lg:scale-[2] 2xl:scale-[2.5] origin-center">
            {/* Body */}
            <div className="w-36 h-44 rounded-[40px] bg-gradient-to-b from-rose-300 to-rose-400 shadow-xl flex items-center justify-center">
              {/* Head */}
              <div className="absolute -top-12 w-24 h-24 rounded-full bg-yellow-cream border-4 border-rose-200 flex items-center justify-center shadow-md">
                {/* Face */}
                <div className="relative">
                  {/* Eyes - closed, she's singing */}
                  <div className="flex gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-text-main" />
                    <div className="w-2 h-2 rounded-full bg-text-main" />
                  </div>
                  {/* Mouth - singing wide */}
                  <div className="w-5 h-2.5 rounded-full bg-rose-300 mx-auto" />
                </div>
              </div>
              {/* Hair / headband */}
              <div className="absolute -top-10 w-28 h-10 rounded-t-full border-[5px] border-rose-400 border-b-0" />
            </div>
            {/* Arm holding mic - right arm */}
            <div className="absolute -right-8 bottom-16 w-8 h-20 rounded-full bg-yellow-cream rotate-[30deg] border-2 border-rose-200" />
            {/* Microphone */}
            <div className="absolute -right-14 bottom-20">
              <div className="w-3 h-16 bg-gray-400 rounded-full" />
              <div className="w-8 h-6 bg-gray-500 rounded-full -mt-1 ml-[-10px]" />
            </div>
            {/* Left arm */}
            <div className="absolute -left-8 bottom-16 w-8 h-20 rounded-full bg-yellow-cream -rotate-[30deg] border-2 border-rose-200" />

            {/* Floating music notes around the character */}
            <MusicNote size={24} weight="fill" className="absolute -top-8 -right-8 text-rose-400 animate-bounce" style={{ animationDuration: '2s' }} />
            <MusicNote size={18} weight="fill" className="absolute -bottom-4 -left-6 text-mint-400 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
            <Star size={16} weight="fill" className="absolute top-2 -left-10 text-yellow-400 animate-pulse" />
            <Sparkle size={14} weight="fill" className="absolute bottom-2 -right-10 text-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Right: Text + CTA */}
        <div className="w-full lg:flex-1 max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-responsive-3xl">🎵</span>
            <h2 className="text-responsive-xl font-extrabold text-coral tracking-wider">MusicExam</h2>
          </div>

          <h1 className="text-responsive-5xl font-black text-text-main leading-tight mb-4">
            唱出你的<br />
            <span className="text-coral">最好成绩</span>
          </h1>

          <p className="text-text-muted text-responsive-lg mb-2 leading-relaxed">
            上海中小学音乐考试练习平台
          </p>
          <p className="text-text-muted/70 text-responsive-base mb-10 max-w-md leading-relaxed">
            对着镜头唱一首，AI 实时评分，知道你哪里唱得好、哪里需要练
          </p>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-btn bg-dark text-white text-responsive-lg font-bold hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 shadow-lg"
          >
            <Microphone size={24} weight="bold" />
            开始练习
          </button>
        </div>
      </div>

      {/* Bottom decoration: subtle music note strip */}
      <div className="py-3 border-t border-rose-100/40">
        <div className="flex items-center justify-center gap-4 text-rose-300/40 text-sm overflow-hidden">
          <span className="font-handwriting text-xl">♩</span>
          <span className="font-handwriting text-lg">♪</span>
          <span className="font-handwriting text-xl">♫</span>
          <span className="font-handwriting text-lg">♬</span>
          <span className="font-handwriting text-base">—— 唱出自信，唱出进步 ——</span>
          <span className="font-handwriting text-lg">♩</span>
          <span className="font-handwriting text-xl">♪</span>
          <span className="font-handwriting text-lg">♫</span>
          <span className="font-handwriting text-xl">♬</span>
        </div>
      </div>
    </div>
  )
}
