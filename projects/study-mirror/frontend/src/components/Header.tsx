import { UserStats } from '../types'
import { useStudyRecords } from '../hooks/useStudyRecords'
import { Moon, Sun, Download, Trash2, RefreshCw, Activity, Calendar, Target, Zap } from 'lucide-react'

interface HeaderProps {
  stats: UserStats
}

const Header: React.FC<HeaderProps> = ({ stats }) => {
  const { exportData, clearData } = useStudyRecords()

  const handleExport = () => {
    exportData()
    showMessage('🎯 数据已导出', 'success')
  }

  const handleClear = () => {
    if (clearData()) {
      showMessage('🔄 数据已清空', 'warning')
    }
  }

  const showMessage = (text: string, type: 'success' | 'warning' | 'info') => {
    const colors = {
      success: 'bg-green-900/30 text-green-300 border-green-800/50',
      warning: 'bg-amber-900/30 text-amber-300 border-amber-800/50',
      info: 'bg-blue-900/30 text-blue-300 border-blue-800/50'
    }

    const message = document.createElement('div')
    message.className = `fixed bottom-6 right-6 px-4 py-3 rounded-xl backdrop-blur-lg border ${colors[type]} shadow-2xl shadow-black/50 z-50 fade-in slide-up`
    message.textContent = text
    document.body.appendChild(message)

    setTimeout(() => {
      message.classList.add('animate-out', 'fade-out')
      setTimeout(() => message.remove(), 300)
    }, 2000)
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800 shadow-2xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo和标题 */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="relative w-12 h-12 bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-900/30">
                <span className="text-2xl">📚</span>
                {/* 装饰性光环 */}
                <div className="absolute -inset-2 border border-primary-500/30 rounded-2xl animate-spin-slow"></div>
              </div>
              {/* 在线状态指示器 */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full border-2 border-gray-900 animate-pulse shadow-lg"></div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  <span className="bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
                    学迹
                  </span>
                </h1>
                <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary-900/30 text-primary-300 border border-primary-800/30">
                  v1.0
                </span>
              </div>
              <p className="text-sm text-gray-400">
                你的学习见证者 · 记录每一步成长
              </p>
            </div>
          </div>

          {/* 统计信息和操作按钮 */}
          <div className="flex items-center space-x-8">
            {/* 迷你统计 - 深色现代风格 */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="relative">
                <div className="flex items-center space-x-3 surface px-4 py-2 rounded-xl hover:border-primary-500/30 transition-all duration-300 group">
                  <Activity className="w-5 h-5 text-primary-400 group-hover:text-primary-300 transition-colors" />
                  <div>
                    <div className="text-lg font-bold text-white">{stats.totalHours.toFixed(1)}</div>
                    <div className="text-xs text-gray-400">总学习时长</div>
                  </div>
                  {stats.totalHours > 10 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-xs text-white shadow-lg">
                      ✨
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 surface px-4 py-2 rounded-xl hover:border-primary-500/30 transition-all duration-300 group">
                <Calendar className="w-5 h-5 text-secondary-400 group-hover:text-secondary-300 transition-colors" />
                <div>
                  <div className="text-lg font-bold text-white">{stats.currentStreak}</div>
                  <div className="text-xs text-gray-400">连续学习</div>
                </div>
                {stats.currentStreak > 0 && (
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(stats.currentStreak, 3) }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-6 w-px bg-gradient-to-b from-gray-700 to-transparent"></div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="btn-ghost flex items-center space-x-2 px-3 py-2"
                title="导出学习数据"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">导出</span>
              </button>

              <button
                onClick={handleClear}
                className="btn-ghost flex items-center space-x-2 px-3 py-2 text-amber-300 hover:text-amber-200 hover:border-amber-600/30"
                title="清空所有数据"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">清空</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                className="btn-primary flex items-center space-x-2 px-4 py-2"
                title="刷新页面"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">刷新</span>
              </button>

              {/* 主题切换占位 */}
              <button
                className="surface-light p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                title="切换主题"
                onClick={() => showMessage('主题切换功能开发中', 'info')}
              >
                <Moon className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        {/* 今日目标栏 */}
        <div className="mt-4 pt-4 border-t border-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="surface-light px-3 py-1.5 rounded-lg flex items-center space-x-2">
                <Target className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-gray-300">今日目标</span>
                <span className="text-xs text-gray-400">1.5小时</span>
              </div>

              <div className="surface-light px-3 py-1.5 rounded-lg flex items-center space-x-2">
                <Zap className="w-4 h-4 text-secondary-400" />
                <span className="text-sm text-gray-300">学习能量</span>
                <span className="text-xs text-gray-400">85%</span>
              </div>
            </div>

            {/* 鼓励性进度条 */}
            <div className="flex-1 max-w-md">
              <div className="flex items-center space-x-3">
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (stats.totalHours / 2) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">
                  {stats.totalHours.toFixed(1)} / 2小时
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡 每天进步一点点，时间会给你最好的答案
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header