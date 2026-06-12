import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Microphone, TrendUp, BookOpen, Clock, CheckCircle,
  Star, CaretRight, User, Calendar, Trophy, MusicNote
} from '@phosphor-icons/react'
import BottomNav from '../components/BottomNav'
import { useScale } from '../components/ScaleProvider'

interface Student {
  id: string
  name: string
  gender: string
  grade: string
  avatar?: string
}

interface TodoItem {
  id: number
  title: string
  description: string
  time: string
  color: 'pink' | 'yellow' | 'blue' | 'green' | 'purple'
  completed: boolean
}

const DEMO_STUDENT: Student = {
  id: 'demo-001',
  name: '张同学',
  gender: '男',
  grade: '七年级'
}

const DEMO_TODOS: TodoItem[] = [
  { id: 1, title: '演唱练习', description: '《茉莉花》完整演唱', time: '今天 14:00', color: 'pink', completed: false },
  { id: 2, title: '视唱练耳', description: 'C大调音阶练习', time: '今天 16:30', color: 'yellow', completed: false },
  { id: 3, title: '错题回顾', description: '上周考试错题复习', time: '明天 10:00', color: 'blue', completed: false },
  { id: 4, title: '乐理知识', description: '节拍与节奏基础', time: '明天 14:00', color: 'green', completed: true },
]

const COLOR_MAP = {
  pink: { bg: 'bg-card-pink', accent: 'text-pink-bright', dot: 'bg-pink-bright' },
  yellow: { bg: 'bg-card-yellow', accent: 'text-yellow-bright', dot: 'bg-yellow-bright' },
  blue: { bg: 'bg-card-blue', accent: 'text-blue-bright', dot: 'bg-blue-bright' },
  green: { bg: 'bg-card-green', accent: 'text-mint-bright', dot: 'bg-mint-bright' },
  purple: { bg: 'bg-card-purple', accent: 'text-purple-bright', dot: 'bg-purple-bright' },
}

export default function HomePage() {
  const navigate = useNavigate()
  const { isDemo } = useScale()
  const [student, setStudent] = useState<Student | null>(null)
  const [todos, setTodos] = useState<TodoItem[]>(DEMO_TODOS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('student')
    if (stored) {
      try {
        setStudent(JSON.parse(stored))
      } catch {
        setStudent(DEMO_STUDENT)
      }
    } else if (isDemo) {
      setStudent(DEMO_STUDENT)
    }
    setLoading(false)
  }, [isDemo])

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin text-4xl">🎵</div>
      </div>
    )
  }

  const displayStudent = student || DEMO_STUDENT
  const completedCount = todos.filter(t => t.completed).length
  const progressPercent = Math.round((completedCount / todos.length) * 100)

  return (
    <div className="min-h-screen bg-surface pb-24">
      <div className="container-wide py-6 lg:py-8">
        {/* ── Header: Hello + Avatar ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-text-light text-responsive-sm mb-1">Good morning,</p>
            <h1 className="text-responsive-3xl font-black text-text-main">
              Hello, {displayStudent.name}
            </h1>
          </div>
          <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-pink-soft to-purple-lavender flex items-center justify-center shadow-md">
            <User size={28} weight="bold" className="text-text-main" />
          </div>
        </div>

        {/* ── Info Pills ── */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="pill-tag bg-card-pink">
            <User size={12} className="text-pink-bright" />
            {displayStudent.gender}
          </span>
          <span className="pill-tag bg-card-yellow">
            <Calendar size={12} className="text-yellow-bright" />
            {displayStudent.grade}
          </span>
          <span className="pill-tag bg-card-green">
            <Trophy size={12} className="text-mint-bright" />
            上次: 85分
          </span>
        </div>

        {/* ── Progress Cards ── */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Practice Progress - Pink */}
          <div className="card-dopamine bg-card-pink">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-pink-soft flex items-center justify-center">
                <Microphone size={16} weight="bold" className="text-pink-bright" />
              </div>
              <span className="text-sm font-semibold text-text-muted">练习进度</span>
            </div>
            <div className="text-responsive-3xl font-black text-text-main mb-1">
              {progressPercent}%
            </div>
            <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-bright to-coral rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-text-light text-xs mt-2">{completedCount}/{todos.length} 已完成</p>
          </div>

          {/* Completed Songs - Yellow */}
          <div className="card-dopamine bg-card-yellow">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-yellow-cream flex items-center justify-center">
                <MusicNote size={16} weight="bold" className="text-yellow-bright" />
              </div>
              <span className="text-sm font-semibold text-text-muted">已完成</span>
            </div>
            <div className="text-responsive-3xl font-black text-text-main mb-1">
              12
            </div>
            <p className="text-text-light text-xs">首曲目</p>
            <div className="flex items-center gap-1 mt-2 text-yellow-bright">
              <TrendUp size={14} weight="bold" />
              <span className="text-xs font-semibold">+3 本周</span>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="mb-6">
          <h2 className="text-responsive-xl font-bold text-text-main mb-4">快捷功能</h2>
          <div className="flex justify-between gap-3">
            {[
              { icon: Microphone, label: '演唱练习', color: 'bg-pink-soft', iconColor: 'text-pink-bright', action: () => navigate('/songs') },
              { icon: BookOpen, label: '视唱练耳', color: 'bg-yellow-cream', iconColor: 'text-yellow-bright', action: () => {} },
              { icon: Star, label: '错题回顾', color: 'bg-blue-sky', iconColor: 'text-blue-bright', action: () => {} },
              { icon: TrendUp, label: '历史记录', color: 'bg-mint', iconColor: 'text-mint-bright', action: () => navigate('/trends') },
              { icon: Clock, label: '更多', color: 'bg-purple-lavender', iconColor: 'text-purple-bright', action: () => {} },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`icon-btn-color ${item.color} ${item.iconColor} shadow-sm`}>
                  <item.icon size={24} weight="bold" />
                </div>
                <span className="text-xs font-semibold text-text-muted group-hover:text-text-main transition-colors">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Todo List ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-responsive-xl font-bold text-text-main">今日任务</h2>
            <span className="text-sm text-text-light">{completedCount}/{todos.length} 完成</span>
          </div>

          <div className="space-y-3">
            {todos.map((todo) => {
              const colors = COLOR_MAP[todo.color]
              return (
                <div
                  key={todo.id}
                  className={`card-dopamine ${colors.bg} flex items-center gap-4 ${todo.completed ? 'opacity-60' : ''}`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      todo.completed
                        ? 'bg-mint-bright border-mint-bright'
                        : 'border-text-light hover:border-text-main'
                    }`}
                  >
                    {todo.completed && <CheckCircle size={14} weight="bold" className="text-white" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-text-main text-responsive-base ${todo.completed ? 'line-through' : ''}`}>
                      {todo.title}
                    </h3>
                    <p className="text-text-light text-sm truncate">{todo.description}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-text-light flex items-center gap-1">
                      <Clock size={12} />
                      {todo.time}
                    </span>
                    <CaretRight size={16} className="text-text-light" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
