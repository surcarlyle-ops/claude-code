import { useState } from 'react'
import Header from './components/Header'
import WelcomeMessage from './components/WelcomeMessage'
import { UserStats } from './types'

function AppFallback() {
  // 简化统计
  const [stats] = useState<UserStats>({
    totalHours: 12.5,
    totalDays: 8,
    currentStreak: 3,
    bestStreak: 5
  })

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900">
      {/* 头部 */}
      <Header stats={stats} />

      {/* 主内容区 */}
      <div className="flex-1 flex">
        {/* 简化主内容 */}
        <main className="flex-1 p-6 space-y-6">
          {/* 欢迎语 */}
          <WelcomeMessage />

          {/* 展示卡片 */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">✅ UI改进已完成</h2>
              <div className="space-y-3 text-gray-300">
                <p>✓ 深色现代主题 - 专注型学习环境</p>
                <p>✓ 结构化功能增强 - 智能助手、自动标签提取</p>
                <p>✓ 图标系统 - 支持哔哩哔哩、YouTube等平台识别</p>
                <p>✓ 文案优化 - "完成记录"替代"保存记录"</p>
                <p>✓ 热力图增强 - 多视图分析、时段分布统计</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card">
                <h3 className="text-lg font-bold text-white mb-2">主要改动</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Header组件: 现代深色UI + 动态进度条</li>
                  <li>• WelcomeMessage: 重新设计 + 统计卡片</li>
                  <li>• SidebarRecord: 结构化处理 + 智能标签</li>
                  <li>• Timer: 专注领域选择 + 优化交互</li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold text-white mb-2">技术升级</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Lucide图标库: 现代化矢量图标</li>
                  <li>• 深色主题: 符合专注学习偏好</li>
                  <li>• 智能表单: 自动类型识别、标签提取</li>
                  <li>• 响应式设计: 全桌面端适配</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 快速统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="text-2xl font-bold text-white">{stats.totalHours.toFixed(1)}</div>
              <div className="text-sm text-gray-400">总学习时长（小时）</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-white">{stats.totalDays}</div>
              <div className="text-sm text-gray-400">学习天数</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
              <div className="text-sm text-gray-400">连续学习天数</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-white">{stats.bestStreak}</div>
              <div className="text-sm text-gray-400">最长连续天数</div>
            </div>
          </div>
        </main>
      </div>

      {/* 温馨提示 */}
      <div className="surface p-4 text-center text-sm text-gray-400 border-t border-gray-800">
        <p className="max-w-3xl mx-auto">
          🎨 UI改进已完成 - 请访问 <a href="http://localhost:3000" className="text-primary-400 hover:text-primary-300">http://localhost:3000</a> 查看深色现代主题、结构化功能和智能表单处理
        </p>
      </div>
    </div>
  )
}

export default AppFallback