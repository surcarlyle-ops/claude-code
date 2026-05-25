import { useState, useEffect } from 'react'
import SidebarRecord from './components/SidebarRecord'
import Timer from './components/Timer'
import HeatMap from './components/HeatMap'
import Header from './components/Header'
import WelcomeMessage from './components/WelcomeMessage'
import { StudyRecord, TimerState, UserStats } from './types'
import { useStudyRecords } from './hooks/useStudyRecords'

function App() {
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [currentRecord, setCurrentRecord] = useState<StudyRecord | null>(null)
  const { records, addRecord, getDailyStats } = useStudyRecords()

  // 计算统计数据
  const [stats, setStats] = useState<UserStats>({
    totalHours: 0,
    totalDays: 0,
    currentStreak: 0,
    bestStreak: 0
  })

  useEffect(() => {
    // 初始化时计算统计数据
    const dailyStats = getDailyStats()
    setStats({
      totalHours: records.reduce((sum, r) => sum + r.durationMinutes, 0) / 60,
      totalDays: new Set(records.map(r => new Date(r.createdAt).toDateString())).size,
      currentStreak: dailyStats.currentStreak,
      bestStreak: dailyStats.bestStreak
    })
  }, [records, getDailyStats])

  // 开始学习计时
  const handleStartTimer = () => {
    setTimerState('running')
    const newRecord: StudyRecord = {
      id: Date.now().toString(),
      content: '',
      tags: [],
      durationMinutes: 0,
      feeling: 'focused',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setCurrentRecord(newRecord)
  }

  // 停止学习计时并保存
  const handleStopTimer = (durationMinutes: number, content: string, tags: string[], feeling: string) => {
    if (currentRecord) {
      const finalRecord: StudyRecord = {
        ...currentRecord,
        content,
        tags,
        durationMinutes,
        feeling,
        updatedAt: new Date().toISOString()
      }
      addRecord(finalRecord)
    }
    setTimerState('stopped')
    setCurrentRecord(null)
  }

  // 取消计时
  const handleCancelTimer = () => {
    setTimerState('idle')
    setCurrentRecord(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 头部 */}
      <Header stats={stats} />

      {/* 主内容区 */}
      <div className="flex-1 flex">
        {/* 侧边栏记录区 */}
        <SidebarRecord
          onRecordAdded={addRecord}
          records={records.slice(0, 5)} // 显示最近5条
        />

        {/* 中间主要内容 */}
        <main className="flex-1 p-6 space-y-6">
          {/* 欢迎语 */}
          <WelcomeMessage />

          {/* 计时器 */}
          <div className="card max-w-md mx-auto">
            <Timer
              state={timerState}
              onStart={handleStartTimer}
              onStop={handleStopTimer}
              onCancel={handleCancelTimer}
              currentRecord={currentRecord}
            />
          </div>

          {/* 学习热图 */}
          <div className="card">
            <HeatMap records={records} />
          </div>

          {/* 快速统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="text-2xl font-bold text-warm-600">{stats.totalHours.toFixed(1)}</div>
              <div className="text-sm text-gray-600">总学习时长（小时）</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-warm-600">{stats.totalDays}</div>
              <div className="text-sm text-gray-600">学习天数</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-warm-600">{stats.currentStreak}</div>
              <div className="text-sm text-gray-600">连续学习天数</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-warm-600">{stats.bestStreak}</div>
              <div className="text-sm text-gray-600">最长连续天数</div>
            </div>
          </div>
        </main>
      </div>

      {/* 温馨提示 */}
      <div className="bg-gradient-to-r from-warm-50/80 to-calm-50/80 border-t border-warm-200/50 p-4 text-center text-sm text-gray-600">
        <p className="max-w-3xl mx-auto">
          💡 小提示：学习就像是种树，每天浇一点水，时间会见证它的成长。
          不着急，慢慢来，你已经做得很棒了！
        </p>
      </div>
    </div>
  )
}

export default App