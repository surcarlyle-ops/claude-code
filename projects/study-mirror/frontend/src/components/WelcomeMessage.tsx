import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useStudyRecords } from '../hooks/useStudyRecords'
import { Sparkles, Target, TrendingUp, Brain, Clock, CalendarDays, Award, Coffee } from 'lucide-react'

const WelcomeMessage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { getDailyStats, records } = useStudyRecords()
  const dailyStats = getDailyStats()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // 每分钟更新一次

    return () => clearInterval(timer)
  }, [])

  // 获取当前时间段
  const getTimeOfDay = () => {
    const hour = currentTime.getHours()
    if (hour < 6) return '深夜'
    if (hour < 12) return '早晨'
    if (hour < 14) return '中午'
    if (hour < 18) return '下午'
    if (hour < 22) return '晚上'
    return '深夜'
  }

  // 获取问候语
  const getGreeting = () => {
    const timeOfDay = getTimeOfDay()
    const greetings = {
      早晨: [
        { text: '早安！新的一天从学习开始', emoji: '🌅' },
        { text: '早晨的时光最适合学习，一起加油！', emoji: '☀️' },
        { text: '一日之计在于晨，开启今天的学习吧', emoji: '🌱' }
      ],
      中午: [
        { text: '午安！午饭后来点精神食粮吧', emoji: '🍱' },
        { text: '正午时光，让学习带来充实感', emoji: '🌞' }
      ],
      下午: [
        { text: '下午好！今天的学习计划进展如何？', emoji: '📚' },
        { text: '下午是创作的黄金时间，开始吧', emoji: '✍️' }
      ],
      晚上: [
        { text: '晚上好！今天的学习收获如何？', emoji: '🌙' },
        { text: '晚间独处的时光，最适合深度思考', emoji: '🕯️' }
      ],
      深夜: [
        { text: '夜深了，还在学习的你真有毅力', emoji: '🌃' },
        { text: '凌晨的星光见证着你的努力', emoji: '⭐' },
        { text: '别太晚了，学习也要注意休息哦', emoji: '💤' }
      ]
    }

    const options = greetings[timeOfDay as keyof typeof greetings] || greetings.晚上
    const randomIndex = Math.floor(Math.random() * options.length)
    return options[randomIndex]
  }

  // 获取今日鼓励语
  const getEncouragement = () => {
    const todayRecords = records.filter(record => {
      const recordDate = new Date(record.createdAt)
      return recordDate.getDate() === currentTime.getDate() &&
             recordDate.getMonth() === currentTime.getMonth() &&
             recordDate.getFullYear() === currentTime.getFullYear()
    })

    const todayTotalHours = todayRecords.reduce((sum, r) => sum + (r.durationMinutes / 60), 0)

    if (todayTotalHours === 0) {
      return '今天还没有开始学习，不妨从一个小目标开始？'
    } else if (todayTotalHours < 0.5) {
      return '今天已经迈出了学习的第一步，继续前进！'
    } else if (todayTotalHours < 1) {
      return '今天已经投入了宝贵的学习时间，这很棒！'
    } else if (todayTotalHours < 2) {
      return '今天已经高效学习了超过1小时，继续保持！'
    } else if (todayTotalHours < 3) {
      return '今天已经专注投入了超过2小时，真是了不起的坚持！'
    } else {
      return '今天的学习强度非常高，记得合理安排休息时间！'
    }
  }

  const greeting = getGreeting()
  const encouragement = getEncouragement()
  const todayTotalHours = records.filter(r => {
    const recordDate = new Date(r.createdAt)
    return recordDate.getDate() === currentTime.getDate() &&
           recordDate.getMonth() === currentTime.getMonth() &&
           recordDate.getFullYear() === currentTime.getFullYear()
  }).reduce((sum, r) => sum + (r.durationMinutes / 60), 0)

  const timeOfDay = getTimeOfDay()
  const weekProgress = (currentTime.getDay() / 7) * 100

  return (
    <div className="card group hover:shadow-primary-900/20 transition-all duration-500">
      <div className="relative overflow-hidden rounded-2xl">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-transparent to-secondary-900/10"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary-500/5 rounded-full blur-3xl"></div>

        <div className="relative p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* 左侧问候部分 */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start space-x-4">
                {/* 时间图标 */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-700 to-secondary-600 flex items-center justify-center shadow-xl shadow-primary-900/30">
                      <span className="text-2xl">{greeting.emoji}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-secondary-400 to-primary-400 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* 问候语和时间 */}
                <div className="flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-2xl font-bold text-white">
                        {greeting.text}
                      </h2>
                      <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-primary-900/30 to-secondary-900/30 text-primary-300 rounded-full border border-primary-800/30">
                        {timeOfDay}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <CalendarDays className="w-4 h-4" />
                        <span className="text-sm">
                          {format(currentTime, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-gray-700"></div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {format(currentTime, 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 鼓励语 */}
                  <p className="mt-4 text-gray-300 leading-relaxed max-w-2xl">
                    {encouragement}
                  </p>
                </div>
              </div>

              {/* 今日进度卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {/* 今日学习时长 */}
                <div className="surface-light p-4 rounded-xl hover:border-primary-500/30 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-secondary-400" />
                        <span className="text-sm text-gray-400">今日学习</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{todayTotalHours.toFixed(1)}h</div>
                    </div>
                    {todayTotalHours > 0 && (
                      <div className="text-secondary-400 animate-pulse">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-secondary-500 to-secondary-400 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, todayTotalHours / 2 * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">目标 2小时</div>
                  </div>
                </div>

                {/* 连续学习天数 */}
                <div className="surface-light p-4 rounded-xl hover:border-primary-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-gray-400">连续学习</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{dailyStats.currentStreak}天</div>
                    </div>
                    {dailyStats.currentStreak > 0 && (
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(dailyStats.currentStreak, 3) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 200}ms` }}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    {dailyStats.currentStreak > 0 ? (
                      <span className="text-primary-300">🔥 坚持就是胜利！</span>
                    ) : (
                      <span className="text-gray-500">今天开始你的学习之旅</span>
                    )}
                  </div>
                </div>

                {/* 本周进度 */}
                <div className="surface-light p-4 rounded-xl hover:border-primary-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-accent-400" />
                        <span className="text-sm text-gray-400">本周进度</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{weekProgress.toFixed(0)}%</div>
                    </div>
                    <Brain className="w-6 h-6 text-accent-400/60" />
                  </div>
                  <div className="mt-3">
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-500 to-accent-400 rounded-full"
                        style={{ width: `${weekProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">第{currentTime.getDay()}天</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧装饰和学习技巧 */}
            <div className="lg:w-72 space-y-4">
              <div className="surface p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-3">
                  <Coffee className="w-5 h-5 text-secondary-400" />
                  <h3 className="font-medium text-white">学习技巧</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-primary-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-xs text-primary-400">1</span>
                    </div>
                    <p className="text-sm text-gray-400">番茄工作法：25分钟专注，5分钟休息</p>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-secondary-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-xs text-secondary-400">2</span>
                    </div>
                    <p className="text-sm text-gray-400">主动回顾：每天结束时花10分钟回顾重点</p>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-accent-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-xs text-accent-400">3</span>
                    </div>
                    <p className="text-sm text-gray-400">间隔重复：定期复习以加强长期记忆</p>
                  </li>
                </ul>
              </div>

              {/* 连续学习火焰 */}
              {dailyStats.currentStreak > 0 && (
                <div className="surface p-4 rounded-xl bg-gradient-to-b from-amber-900/10 to-transparent border border-amber-800/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl animate-pulse">🔥</div>
                      <div>
                        <div className="text-lg font-bold text-amber-300">{dailyStats.currentStreak}</div>
                        <div className="text-xs text-amber-400/80">连续学习天数</div>
                      </div>
                    </div>
                    {dailyStats.currentStreak > 7 && (
                      <div className="text-xs px-2 py-1 bg-amber-900/30 text-amber-300 rounded-full">
                        🎯 强者！
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-amber-400/60 mt-2">
                    你已经坚持学习{dailyStats.currentStreak}天，继续保持！
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeMessage