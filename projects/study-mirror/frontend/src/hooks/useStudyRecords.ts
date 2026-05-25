import { useState, useEffect, useCallback } from 'react'
import { StudyRecord, DailyStats, UserStats } from '../types'
import { format, startOfDay, isSameDay, differenceInDays, eachDayOfInterval, subDays } from 'date-fns'

const STORAGE_KEY = 'learnwitness_study_records'

// 默认示例数据，用于演示
const SAMPLE_RECORDS: StudyRecord[] = [
  {
    id: '1',
    content: '学习了React Hooks，理解了useEffect的使用',
    tags: ['React', '前端', 'JavaScript'],
    durationMinutes: 45,
    feeling: 'focused',
    createdAt: format(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss")
  },
  {
    id: '2',
    content: '完成了数据可视化项目的原型设计',
    tags: ['设计', '数据可视化', '项目'],
    durationMinutes: 90,
    feeling: 'excited',
    createdAt: format(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss")
  },
  {
    id: '3',
    content: '数学公式推导遇到困难，需要更多练习',
    tags: ['数学', '微积分', '练习'],
    durationMinutes: 60,
    feeling: 'confused',
    createdAt: format(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss")
  },
  {
    id: '4',
    content: '早间英语阅读，掌握了几个新词汇',
    tags: ['英语', '阅读', '早晨'],
    durationMinutes: 30,
    feeling: 'breakthrough',
    createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
  }
]

export const useStudyRecords = () => {
  const [records, setRecords] = useState<StudyRecord[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 从localStorage加载数据
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setRecords(parsed)
      } else {
        // 首次使用，存储示例数据
        setRecords(SAMPLE_RECORDS)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_RECORDS))
      }
    } catch (error) {
      console.error('加载学习记录失败:', error)
      setRecords(SAMPLE_RECORDS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_RECORDS))
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // 保存到localStorage
  useEffect(() => {
    if (isLoaded && records.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    }
  }, [records, isLoaded])

  // 添加记录
  const addRecord = useCallback((record: StudyRecord) => {
    setRecords(prev => {
      const newRecord = {
        ...record,
        id: record.id || Date.now().toString(),
        updatedAt: new Date().toISOString()
      }

      // 避免重复id
      const existingIndex = prev.findIndex(r => r.id === newRecord.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = newRecord
        return updated
      }

      return [...prev, newRecord]
    })

    // 显示成功消息
    const message = document.createElement('div')
    message.className = 'fixed bottom-4 right-4 px-4 py-2 bg-green-100 text-green-800 rounded-lg shadow-lg z-50 animate-in fade-in'
    message.textContent = '✅ 学习记录已保存'
    document.body.appendChild(message)
    setTimeout(() => {
      message.classList.add('animate-out', 'fade-out')
      setTimeout(() => message.remove(), 300)
    }, 2000)
  }, [])

  // 更新记录
  const updateRecord = useCallback((updatedRecord: StudyRecord) => {
    setRecords(prev => prev.map(record =>
      record.id === updatedRecord.id ? updatedRecord : record
    ))
  }, [])

  // 删除记录
  const deleteRecord = useCallback((recordId: string) => {
    setRecords(prev => prev.filter(record => record.id !== recordId))
  }, [])

  // 获取某一天的记录
  const getRecordsByDate = useCallback((date: Date) => {
    return records.filter(record => {
      const recordDate = new Date(record.createdAt)
      return isSameDay(recordDate, date)
    })
  }, [records])

  // 计算每日统计数据
  const getDailyStats = useCallback(() => {
    const dailyStatsMap = new Map<string, DailyStats>()
    const today = new Date()
    const last30Days = eachDayOfInterval({
      start: subDays(today, 30),
      end: today
    })

    // 初始化最近30天
    last30Days.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd')
      dailyStatsMap.set(dateStr, {
        date,
        totalMinutes: 0,
        recordCount: 0,
        mainTags: [],
        avgFeeling: 0
      })
    })

    // 填充实际数据
    records.forEach(record => {
      const recordDate = new Date(record.createdAt)
      const dateStr = format(recordDate, 'yyyy-MM-dd')
      const existing = dailyStatsMap.get(dateStr) || {
        date: recordDate,
        totalMinutes: 0,
        recordCount: 0,
        mainTags: [],
        avgFeeling: 0
      }

      dailyStatsMap.set(dateStr, {
        date: recordDate,
        totalMinutes: existing.totalMinutes + record.durationMinutes,
        recordCount: existing.recordCount + 1,
        mainTags: [...new Set([...existing.mainTags, ...record.tags])],
        avgFeeling: (existing.avgFeeling * existing.recordCount + (['focused', 'excited', 'breakthrough', 'neutral', 'confused', 'tired'].indexOf(record.feeling) + 1)) / (existing.recordCount + 1)
      })
    })

    const dailyStats = Array.from(dailyStatsMap.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime())

    // 计算连续学习天数
    let currentStreak = 0
    let bestStreak = 0
    let tempStreak = 0

    // 按日期从最近到最早排序
    const sortedDates = [...dailyStats]
      .filter(stat => stat.totalMinutes > 0)
      .map(stat => stat.date)
      .sort((a, b) => b.getTime() - a.getTime())

    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        // 检查今天是否有学习
        const todayStats = dailyStats.find(stat => isSameDay(stat.date, today))
        if (todayStats && todayStats.totalMinutes > 0) {
          currentStreak = 1
          tempStreak = 1
        }
      } else {
        const prevDate = sortedDates[i - 1]
        const currentDate = sortedDates[i]
        const daysDiff = differenceInDays(prevDate, currentDate)

        if (daysDiff === 1) {
          tempStreak++
          if (currentStreak === tempStreak - 1) {
            currentStreak = tempStreak
          }
        } else {
          bestStreak = Math.max(bestStreak, tempStreak)
          tempStreak = 1
        }
      }
    }

    bestStreak = Math.max(bestStreak, tempStreak)

    return {
      dailyStats,
      currentStreak,
      bestStreak
    }
  }, [records])

  // 获取用户统计数据
  const getUserStats = useCallback((): UserStats => {
    const dailyStats = getDailyStats()
    const uniqueDays = new Set(records.map(r => format(new Date(r.createdAt), 'yyyy-MM-dd'))).size
    const totalHours = records.reduce((sum, r) => sum + r.durationMinutes, 0) / 60

    return {
      totalHours,
      totalDays: uniqueDays,
      currentStreak: dailyStats.currentStreak,
      bestStreak: dailyStats.bestStreak
    }
  }, [records, getDailyStats])

  // 获取标签统计
  const getTagStats = useCallback(() => {
    const tagMap = new Map<string, { count: number, totalMinutes: number }>()

    records.forEach(record => {
      record.tags.forEach(tag => {
        const existing = tagMap.get(tag) || { count: 0, totalMinutes: 0 }
        tagMap.set(tag, {
          count: existing.count + 1,
          totalMinutes: existing.totalMinutes + record.durationMinutes
        })
      })
    })

    return Array.from(tagMap.entries())
      .map(([tag, stats]) => ({ tag, ...stats }))
      .sort((a, b) => b.totalMinutes - a.totalMinutes)
  }, [records])

  // 导出数据
  const exportData = useCallback(() => {
    const data = {
      records,
      exportDate: new Date().toISOString(),
      stats: getUserStats()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `learnwitness_backup_${format(new Date(), 'yyyy-MM-dd')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    return true
  }, [records, getUserStats])

  // 导入数据
  const importData = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const data = JSON.parse(content)

          if (data.records && Array.isArray(data.records)) {
            setRecords(data.records)
            resolve()
          } else {
            reject(new Error('无效的数据格式'))
          }
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error('读取文件失败'))
      reader.readAsText(file)
    })
  }, [])

  // 清空数据
  const clearData = useCallback(() => {
    if (window.confirm('确定要清空所有学习记录吗？此操作不可撤销。')) {
      setRecords([])
      localStorage.removeItem(STORAGE_KEY)
      return true
    }
    return false
  }, [])

  return {
    records,
    isLoaded,
    addRecord,
    updateRecord,
    deleteRecord,
    getRecordsByDate,
    getDailyStats,
    getUserStats,
    getTagStats,
    exportData,
    importData,
    clearData
  }
}