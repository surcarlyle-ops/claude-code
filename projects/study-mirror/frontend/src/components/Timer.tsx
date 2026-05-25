import { useState, useEffect } from 'react'
import { TimerState, StudyRecord } from '../types'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  Play, Square, RotateCcw, Clock, Zap, Target,
  Trophy, Coffee, Brain, Sparkles, CheckCircle,
  AlertCircle, Pause, TrendingUp, BarChart3
} from 'lucide-react'

interface TimerProps {
  state: TimerState
  onStart: () => void
  onStop: (durationMinutes: number, content: string, tags: string[], feeling: StudyRecord['feeling']) => void
  onCancel: () => void
  currentRecord: StudyRecord | null
}

const Timer: React.FC<TimerProps> = ({ state, onStart, onStop, onCancel, currentRecord }) => {
  const [seconds, setSeconds] = useState(0)
  const [isInitialPrompt, setIsInitialPrompt] = useState(true)
  const [showStopForm, setShowStopForm] = useState(false)
  const [stopContent, setStopContent] = useState('')
  const [stopTags, setStopTags] = useState('')
  const [stopFeeling, setStopFeeling] = useState<StudyRecord['feeling']>('focused')
  const [studyFocus, setStudyFocus] = useState('coding') // 新增：学习专注领域

  const tagSuggestions = [
    'React', 'TypeScript', 'Python', '算法', '机器学习',
    '前端开发', '后端架构', '数据库', 'DevOps', '云计算',
    '数学', '物理', '英语', '历史', '哲学',
    '设计思维', '产品管理', '数据分析', '商业分析'
  ]

  const studyFocusOptions = [
    { id: 'coding', name: '编程开发', icon: '💻', color: 'from-blue-500 to-cyan-500' },
    { id: 'math', name: '数学', icon: '📐', color: 'from-purple-500 to-pink-500' },
    { id: 'language', name: '语言学习', icon: '🌐', color: 'from-green-500 to-teal-500' },
    { id: 'science', name: '科学', icon: '🔬', color: 'from-red-500 to-orange-500' },
    { id: 'business', name: '商业', icon: '💼', color: 'from-amber-500 to-yellow-500' },
    { id: 'design', name: '设计', icon: '🎨', color: 'from-indigo-500 to-purple-500' }
  ]

  const currentFocus = studyFocusOptions.find(f => f.id === studyFocus) || studyFocusOptions[0]

  // 计时器逻辑
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (state === 'running') {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    } else if (state === 'stopped' || state === 'idle') {
      setSeconds(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [state])

  // 时间格式
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getStartMessage = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '🌅 开启今天的晨间学习吧！'
    if (hour < 18) return '🌞 开启下午的学习时光吧！'
    return '🌙 开启晚间的专注时刻吧！'
  }

  const handleStart = () => {
    setIsInitialPrompt(false)
    onStart()
  }

  const handleStop = () => {
    const durationMinutes = seconds / 60
    const tags = stopTags.split(/[,，\s]+/).filter(tag => tag.trim())

    // 自动添加时间标签
    const hour = new Date().getHours()
    if (hour < 12) tags.push('早晨')
    else if (hour < 18) tags.push('下午')
    else tags.push('晚上')

    if (durationMinutes >= 15) tags.push('专注时间')

    onStop(durationMinutes, stopContent, tags, stopFeeling as any)
    setShowStopForm(false)
    setStopContent('')
    setStopTags('')
    setStopFeeling('focused')
    setIsInitialPrompt(true)
  }

  // 根据不同状态渲染
  const renderContent = () => {
    const durationMinutes = seconds / 60

    if (state === 'idle') {
      return (
        <div className="text-center space-y-6">
          {isInitialPrompt ? (
            <>
              {/* 计时器初始状态 */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-900/20 to-secondary-900/20 rounded-full border-4 border-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-2 animate-pulse">⏰</div>
                    <div className="text-sm text-gray-400">准备学习</div>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-primary-500/20 rounded-full animate-ping"></div>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">准备好专注学习</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  选择专注领域，设置专注时间，开始您的高效学习旅程
                </p>
              </div>

              {/* 学习专注领域选择 */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-primary-400" />
                    <span className="text-sm font-medium text-gray-300">专注领域</span>
                  </div>
                  <span className="text-xs text-gray-500">选择一项</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {studyFocusOptions.map((focus) => (
                    <button
                      key={focus.id}
                      onClick={() => setStudyFocus(focus.id)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        studyFocus === focus.id
                          ? `bg-gradient-to-br ${focus.color} border-transparent text-white scale-105`
                          : 'surface hover:border-gray-600 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{focus.icon}</span>
                        <span className="text-sm font-medium">{focus.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 开始按钮 */}
              <button
                onClick={handleStart}
                className="btn-primary w-full py-4 text-lg font-medium mt-6 hover:scale-[1.02] transition-transform duration-200"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Play className="w-6 h-6" />
                  <span>开始专注学习</span>
                </div>
              </button>

              <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
                <div className="flex items-center justify-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Brain className="w-3 h-3" />
                    <span>智能计时</span>
                  </span>
                  <span className="w-6 h-px bg-gray-700"></span>
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>自动记录</span>
                  </span>
                  <span className="w-6 h-px bg-gray-700"></span>
                  <span className="flex items-center space-x-1">
                    <Trophy className="w-3 h-3" />
                    <span>成就追踪</span>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 上次学习完成状态 */}
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center border-4 border-emerald-500/30">
                  <CheckCircle className="w-12 h-12 text-emerald-400" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="surface px-4 py-3 rounded-xl">
                  <div className="text-2xl font-bold text-emerald-400">{formatTime(seconds)}</div>
                  <div className="text-sm text-gray-400">上一次专注时长</div>
                </div>

                <h3 className="text-xl font-bold text-white">专注完成！</h3>
                <p className="text-gray-400 text-sm">
                  您已成功完成一次专注学习，休息一下，准备开始新的学习旅程
                </p>
              </div>

              <button
                onClick={onCancel}
                className="btn-primary w-full py-4 text-lg font-medium mt-6 hover:scale-[1.02] transition-transform duration-200"
              >
                <div className="flex items-center justify-center space-x-3">
                  <RotateCcw className="w-6 h-6" />
                  <span>开始新的专注</span>
                </div>
              </button>
            </>
          )}
        </div>
      )
    }

    if (state === 'running') {
      return (
        <div className="text-center space-y-6">
          {/* 计时器显示 */}
          <div className="relative">
            <div className="text-6xl font-bold text-calm-600 mb-2">
              {formatTime(seconds)}
            </div>
            <div className="text-sm text-gray-500">
              已经专注了 {Math.floor(durationMinutes)} 分钟
            </div>
          </div>

          {/* 专注状态提示 */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-sm text-green-600">正在专注中...</span>
            </div>

            {durationMinutes >= 60 && (
              <div className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full inline-block">
                🔥 连续学习超过1小时，记得稍作休息哦
              </div>
            )}
          </div>

          {/* 停止按钮 */}
          <div className="space-y-3">
            <button
              onClick={() => setShowStopForm(true)}
              className="btn-secondary w-full py-3 text-lg hover:scale-[1.02] transition-transform"
            >
              🎯 完成学习
            </button>
            <button
              onClick={onCancel}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              取消计时
            </button>
          </div>
        </div>
      )
    }

    if (showStopForm) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold text-warm-700">
              学习完成！总共学习了 {formatTime(seconds)}
            </h3>
          </div>

          <div className="space-y-4">
            {/* 学习内容总结 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                今天学到了什么？分享一下收获：
              </label>
              <textarea
                value={stopContent}
                onChange={(e) => setStopContent(e.target.value)}
                placeholder="例如：学习了React Hooks，理解了useEffect的使用..."
                className="input-primary w-full h-32 resize-none"
                maxLength={300}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {stopContent.length}/300
              </div>
            </div>

            {/* 标签输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                为这次学习添加标签（可选）：
              </label>
              <input
                type="text"
                value={stopTags}
                onChange={(e) => setStopTags(e.target.value)}
                placeholder="例如：React, JavaScript, 前端"
                className="input-primary w-full"
              />
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">快速选择：</div>
                <div className="flex flex-wrap gap-2">
                  {tagSuggestions.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const tags = stopTags.split(/[,，\s]+/).filter(t => t.trim())
                        if (!tags.includes(tag)) {
                          setStopTags([...tags, tag].join(', '))
                        }
                      }}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 感觉选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                这次学习的感觉：
              </label>
              <div className="flex flex-wrap gap-2">
                {(['focused', 'confused', 'excited', 'tired', 'breakthrough', 'neutral'] as const).map((feelingOption) => {
                  const emojis = {
                    focused: '💪',
                    confused: '🤔',
                    excited: '🎉',
                    tired: '😴',
                    breakthrough: '💡',
                    neutral: '😊'
                  }
                  return (
                    <button
                      key={feelingOption}
                      type="button"
                      onClick={() => setStopFeeling(feelingOption)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        stopFeeling === feelingOption
                          ? 'bg-warm-100 text-warm-800 border border-warm-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {emojis[feelingOption]}
                      {feelingOption === 'focused' ? '专注' :
                       feelingOption === 'confused' ? '困惑' :
                       feelingOption === 'excited' ? '激动' :
                       feelingOption === 'tired' ? '疲惫' :
                       feelingOption === 'breakthrough' ? '突破' : '平静'}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleStop}
              disabled={!stopContent.trim()}
              className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💾 保存并完成
            </button>
            <button
              onClick={() => setShowStopForm(false)}
              className="py-3 px-4 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              返回
            </button>
          </div>

          <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-1">
              <span>📅</span>
              <span>{format(new Date(), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}</span>
            </div>
            {durationMinutes > 30 && (
              <div className="mt-2 text-green-600 font-medium">
                🎯 真棒！这次专注超过30分钟，有效学习时间！
              </div>
            )}
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="timer-container space-y-4">
      {/* 顶部状态栏 */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            state === 'running' ? 'bg-green-500 animate-pulse' :
            state === 'idle' ? 'bg-gray-300' : 'bg-calm-500'
          }`}></div>
          <span className="text-sm font-medium text-gray-700">
            {state === 'running' ? '正在学习' :
             state === 'idle' ? '准备学习' : '学习完成'}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {format(new Date(), 'HH:mm', { locale: zhCN })}
        </div>
      </div>

      {/* 主内容 */}
      {renderContent()}

      {/* 进度统计（仅在运行时显示） */}
      {state === 'running' && (
        <div className="bg-gradient-to-r from-calm-50 to-warm-50 rounded-xl p-4 mt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-sm text-gray-600">今日学习</div>
              <div className="text-xl font-bold text-calm-700">{(seconds / 3600).toFixed(1)}小时</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-600">本周累计</div>
              <div className="text-xl font-bold text-warm-700">{(seconds / 3600 * 7).toFixed(1)}小时</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-3 text-center">
            📈 点滴积累，终成江河
          </div>
        </div>
      )}
    </div>
  )
}

export default Timer