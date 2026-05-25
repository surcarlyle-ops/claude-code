import { useState, useMemo } from 'react'
import { StudyRecord, HeatMapData, TagFrequency } from '../types'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subMonths } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  Calendar, BarChart3, TrendingUp, Clock, Target, Award,
  Sun, Moon, Coffee, Activity, PieChart, Zap,
  ChevronLeft, ChevronRight, Info
} from 'lucide-react'

// 颜色等级 - 深色主题
const colorScales = [
  'bg-gray-800',           // 无学习
  'bg-primary-900/40',     // 等级1
  'bg-primary-800/60',     // 等级2
  'bg-primary-700',        // 等级3
  'bg-primary-600',        // 等级4
  'bg-primary-500',        // 等级5
]

// 时段标签
const timeLabels = [
  { label: '清晨\n5-8', emoji: '🌅' },
  { label: '上午\n8-12', emoji: '☀️' },
  { label: '下午\n12-17', emoji: '🌤️' },
  { label: '晚上\n17-22', emoji: '🌙' },
  { label: '深夜\n22-5', emoji: '🌃' }
]

interface StudyHour {
  time: string
  hour: number
  count: number
}

interface HeatMapProps {
  records: StudyRecord[]
}

const HeatMap: React.FC<HeatMapProps> = ({ records }) => {
  const [hoveredDay, setHoveredDay] = useState<HeatMapData | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
  const [view, setView] = useState<'calendar' | 'distribution' | 'topics'>('calendar')
  const [selectedWeek, setSelectedWeek] = useState<number>(0) // 0 = 最近一周

  // 生成6个月的数据
  const months = useMemo(() => {
    const result = []
    const today = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(today, i)
      result.push({
        name: format(date, 'MMM', { locale: zhCN }),
        year: format(date, 'yyyy'),
        month: date.getMonth(),
        fullDate: date
      })
    }
    return result
  }, [])

  // 聚合每天的记录数据
  const heatmapData = useMemo(() => {
    const dataMap = new Map<string, HeatMapData>()
    const today = new Date()
    const sixMonthsAgo = subMonths(today, 6)

    // 初始化最近6个月的所有日期
    const allDays = eachDayOfInterval({
      start: sixMonthsAgo,
      end: today
    })

    allDays.forEach(day => {
      const key = format(day, 'yyyy-MM-dd')
      dataMap.set(key, {
        date: key,
        count: 0,
        hours: 0
      })
    })

    // 填充实际记录数据
    records.forEach(record => {
      const recordDate = new Date(record.createdAt)
      const key = format(recordDate, 'yyyy-MM-dd')
      const existingData = dataMap.get(key) || { date: key, count: 0, hours: 0 }

      dataMap.set(key, {
        ...existingData,
        count: existingData.count + 1,
        hours: existingData.hours + (record.durationMinutes / 60)
      })
    })

    return Array.from(dataMap.values())
  }, [records])

  // 获取某个月的数据用于显示
  const monthData = useMemo(() => {
    const selectedMonthData = months.find(m => m.month === selectedMonth)
    if (!selectedMonthData) return []

    const firstDay = new Date(selectedMonthData.year, selectedMonth, 1)
    const lastDay = new Date(selectedMonthData.year, selectedMonth + 1, 0)

    const weekStart = startOfWeek(firstDay, { weekStartsOn: 1 }) // 周一开始
    const weekEnd = endOfWeek(lastDay, { weekStartsOn: 1 })

    const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

    return allDays.map(day => {
      const key = format(day, 'yyyy-MM-dd')
      const data = heatmapData.find(d => d.date === key)
      return {
        date: day,
        key,
        count: data?.count || 0,
        hours: data?.hours || 0
      }
    })
  }, [selectedMonth, heatmapData, months])

  // 计算颜色等级
  const getIntensityColor = (hours: number, count: number) => {
    if (hours === 0 && count === 0) return 'bg-warm-100' // 无学习

    const totalValue = hours * 10 + count // 结合时长和次数

    if (totalValue < 2) return 'bg-warm-200'
    if (totalValue < 5) return 'bg-warm-300'
    if (totalValue < 10) return 'bg-warm-400'
    if (totalValue < 20) return 'bg-warm-500'
    return 'bg-warm-600'
  }

  // 获取星期几的标签
  const weekdayLabels = ['一', '二', '三', '四', '五', '六', '日']

  // 计算月度统计
  const monthStats = useMemo(() => {
    const monthRecords = monthData.filter(day =>
      new Date(day.date).getMonth() === selectedMonth
    )

    const daysWithLearning = monthRecords.filter(day => day.hours > 0).length
    const totalHours = monthRecords.reduce((sum, day) => sum + day.hours, 0)
    const totalRecords = monthRecords.reduce((sum, day) => sum + day.count, 0)

    return { daysWithLearning, totalHours, totalRecords }
  }, [monthData, selectedMonth])

  return (
    <div className="space-y-6">
      {/* 标题和月份选择 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-warm-700">📅 学习热力图</h2>
          <p className="text-sm text-gray-600 mt-1">
            像GitHub贡献图一样，可视化你的学习时间分布
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="input-primary text-sm"
          >
            {months.map((month, index) => (
              <option key={index} value={month.month}>
                {month.year}年{month.name}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-700">
            <span className="font-medium">{monthStats.totalHours.toFixed(1)}小时</span>
            <span className="mx-2">•</span>
            <span>{monthStats.daysWithLearning}天</span>
          </div>
        </div>
      </div>

      {/* 热图主体 */}
      <div className="bg-white/60 rounded-xl p-6 border border-warm-200/50">
        <div className="flex">
          {/* 星期标签 */}
          <div className="w-8 mr-4 flex flex-col items-center">
            {weekdayLabels.map((label, i) => (
              <div key={i} className="h-8 flex items-center justify-center">
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>

          {/* 月历网格 */}
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-1">
              {monthData.map((dayData, index) => {
                const isCurrentMonth = new Date(dayData.date).getMonth() === selectedMonth
                const isToday = format(new Date(dayData.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

                return (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-md transition-all duration-200
                      ${getIntensityColor(dayData.hours, dayData.count)}
                      ${!isCurrentMonth ? 'opacity-40' : ''}
                      ${isToday ? 'ring-2 ring-calm-400 ring-offset-2' : ''}
                      ${dayData.hours > 0 ? 'cursor-pointer hover:scale-105' : ''}`}
                    onMouseEnter={() => setHoveredDay({
                      date: dayData.key,
                      count: dayData.count,
                      hours: dayData.hours
                    })}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {/* 日期标签（仅当月显示） */}
                    {isCurrentMonth && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                        {format(new Date(dayData.date), 'd号')}
                      </div>
                    )}

                    {/* 学习指示 */}
                    {dayData.hours > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 图例 */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">学习强度：</span>
            <div className="flex items-center space-x-1">
              <div className="w-6 h-3 bg-warm-100 rounded-sm" title="无学习"></div>
              <div className="w-6 h-3 bg-warm-200 rounded-sm" title="较少"></div>
              <div className="w-6 h-3 bg-warm-300 rounded-sm" title="一般"></div>
              <div className="w-6 h-3 bg-warm-400 rounded-sm" title="较好"></div>
              <div className="w-6 h-3 bg-warm-500 rounded-sm" title="很投入"></div>
              <div className="w-6 h-3 bg-warm-600 rounded-sm" title="非常投入"></div>
              <div className="text-xs text-gray-500">→ 高强度</div>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            最近6个月 · 点击方块查看详情
          </div>
        </div>
      </div>

      {/* 详情卡片 */}
      {hoveredDay && hoveredDay.hours > 0 && (
        <div className="fixed md:absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-warm-200 z-10 max-w-xs animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center text-warm-700">
              📚
            </div>
            <div className="flex-1">
              <div className="font-medium text-warm-800 mb-1">
                {format(new Date(hoveredDay.date), 'yyyy年MM月dd日', { locale: zhCN })}
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 bg-calm-100 text-calm-700 rounded-full flex items-center justify-center text-xs">
                    ⏱️
                  </div>
                  <span>学习时长：<strong>{hoveredDay.hours.toFixed(1)}</strong>小时</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 bg-warm-100 text-warm-700 rounded-full flex items-center justify-center text-xs">
                    📝
                  </div>
                  <span>学习次数：<strong>{hoveredDay.count}</strong>次</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  {hoveredDay.hours >= 3 ? '🔥 非常高效的一天！' :
                   hoveredDay.hours >= 1 ? '✨ 很有收获的一天！' :
                   '🌱 有在学习，继续保持！'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-warm-600">
            {heatmapData.filter(d => d.hours > 0).length}
          </div>
          <div className="text-sm text-gray-600">最近6个月学习天数</div>
          <div className="mt-2 text-xs text-gray-500">
            {((heatmapData.filter(d => d.hours > 0).length / heatmapData.length) * 100).toFixed(1)}% 的日期在学习
          </div>
        </div>

        <div className="card text-center">
          <div className="text-2xl font-bold text-warm-600">
            {heatmapData.reduce((sum, d) => sum + d.hours, 0).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">最近6个月总时长（小时）</div>
          <div className="mt-2 text-xs text-gray-500">
            日均 {(heatmapData.reduce((sum, d) => sum + d.hours, 0) / heatmapData.length).toFixed(2)} 小时
          </div>
        </div>

        <div className="card text-center">
          <div className="text-2xl font-bold text-warm-600">
            {heatmapData.filter(d => d.hours >= 1).length}
          </div>
          <div className="text-sm text-gray-600">专注学习≥1小时的天数</div>
          <div className="mt-2 text-xs text-gray-500">
            {((heatmapData.filter(d => d.hours >= 1).length / heatmapData.length) * 100).toFixed(1)}% 的日期专注学习1小时以上
          </div>
        </div>
      </div>

      {/* 分析提示 */}
      <div className="bg-gradient-to-r from-warm-50/60 to-calm -50/60 rounded-lg p-4 border border-warm-200/50">
        <div className="flex items-start space-x-3">
          <div className="text-xl">💡</div>
          <div>
            <h4 className="font-medium text-warm-700 mb-1">热力图分析小贴士</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-start">
                <span className="text-warm-500 mr-1">•</span>
                空白处代表没有学习，不用焦虑，休息也很重要
              </li>
              <li className="flex items-start">
                <span className="text-warm-500 mr-1">•</span>
                颜色越深，代表学习投入越多，看看你的高光时刻在哪里？
              </li>
              <li className="flex items-start">
                <span className="text-warm-500 mr-1">•</span>
                形成连续的学习习惯会让热图更加连贯美观
              </li>
              <li className="flex items-start">
                <span className="text-warm-500 mr-1">•</span>
                这个图仅自己可见，是纯粹的自我成长见证
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeatMap