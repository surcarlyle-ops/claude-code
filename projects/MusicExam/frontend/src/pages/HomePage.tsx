import { useNavigate } from 'react-router-dom'
import {
  Microphone,
  MusicNote,
  ClockCounterClockwise,
  BookOpen,
  Plus,
  CheckCircle,
  SignOut,
} from '@phosphor-icons/react'

const MOCK_STUDENT = {
  name: '张三',
  gender: '男',
  grade: '初一',
  lastScore: 85,
}

const QUICK_ACTIONS = [
  { icon: Microphone, label: '演唱练习', color: 'bg-pink-soft', path: '/songs' },
  { icon: MusicNote, label: '视唱练耳', color: 'bg-blue-sky', disabled: true },
  { icon: ClockCounterClockwise, label: '错题回顾', color: 'bg-yellow-cream', disabled: true },
  { icon: BookOpen, label: '历史记录', color: 'bg-purple-lavender', path: '/trends' },
]

const TASKS = [
  {
    id: 1,
    title: '期中演唱考试',
    subject: '小星星 (Twinkle Twinkle)',
    time: '明天 14:00',
    color: 'bg-pink-soft',
    done: false,
  },
  {
    id: 2,
    title: '视唱练习',
    subject: 'C大调音阶',
    time: '后天 10:00',
    color: 'bg-yellow-cream',
    done: false,
  },
  {
    id: 3,
    title: '节奏训练',
    subject: '4/4拍基础节奏',
    time: '2024-06-13',
    color: 'bg-mint',
    done: true,
  },
  {
    id: 4,
    title: '音准练习',
    subject: '三度音程听辨',
    time: '2024-06-12',
    color: 'bg-purple-lavender',
    done: true,
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-lg mx-auto px-5 py-8">
        {/* Header: Greeting + Avatar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-text-main">
              Hello,{' '}
              <span className="text-coral">{MOCK_STUDENT.name}</span>
            </h1>
            <p className="font-handwriting text-text-muted text-lg -mt-0.5">
              今天也要加油哦~
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-pink-soft flex items-center justify-center text-2xl font-bold text-coral shadow-sm border-2 border-white">
            {MOCK_STUDENT.name.charAt(0)}
          </div>
        </div>

        {/* Info tags */}
        <div className="flex gap-2 mb-8">
          {[
            { label: '性别', value: MOCK_STUDENT.gender },
            { label: '年级', value: MOCK_STUDENT.grade },
            { label: '上次得分', value: `${MOCK_STUDENT.lastScore}分` },
          ].map((tag) => (
            <div
              key={tag.label}
              className="flex-1 bg-white rounded-card py-3 px-3 text-center border border-gray-100 shadow-sm"
            >
              <p className="text-[11px] text-text-muted mb-0.5">{tag.label}</p>
              <p className="text-sm font-bold text-text-main">{tag.value}</p>
            </div>
          ))}
        </div>

        {/* Progress cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="rounded-card bg-gradient-to-br from-pink-soft to-pink-soft/70 p-5 shadow-sm">
            <p className="text-xs text-text-muted mb-2">演唱练习进度</p>
            <p className="text-[32px] font-bold text-text-main leading-none mb-1">
              3
              <span className="text-sm font-normal text-text-muted">/10</span>
            </p>
            <p className="text-[11px] text-text-muted mb-3">本周目标 10 次</p>
            <div className="h-2.5 rounded-full bg-white/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-coral to-pink-soft transition-all duration-700"
                style={{ width: '30%' }}
              />
            </div>
          </div>
          <div className="rounded-card bg-gradient-to-br from-yellow-cream to-yellow-cream/70 p-5 shadow-sm">
            <p className="text-xs text-text-muted mb-2">已完成曲目</p>
            <p className="text-[32px] font-bold text-text-main leading-none mb-1">
              7
              <span className="text-sm font-normal text-text-muted">首</span>
            </p>
            <p className="text-[11px] text-text-muted mb-3">总计 12 首曲目</p>
            <div className="h-2.5 rounded-full bg-white/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-mint to-mint transition-all duration-700"
                style={{ width: '58%' }}
              />
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text-main mb-3 px-1">
            快捷功能
          </h2>
          <div className="flex gap-4 justify-center">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => {
                  if (action.disabled) {
                    alert('功能即将上线，敬请期待～')
                  } else if (action.path) {
                    navigate(action.path)
                  }
                }}
                className={`flex flex-col items-center gap-1.5 transition-all duration-200 hover:-translate-y-1 ${
                  action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div
                  className={`w-14 h-14 ${action.color} rounded-[18px] flex items-center justify-center shadow-sm`}
                >
                  <action.icon size={24} className="text-text-main" />
                </div>
                <span className="text-[11px] text-text-muted whitespace-nowrap">
                  {action.label}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => alert('更多功能即将上线～')}
              className="flex flex-col items-center gap-1.5 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-14 h-14 bg-white rounded-[18px] flex items-center justify-center shadow-sm border-2 border-dashed border-gray-200">
                <Plus size={24} className="text-text-muted" />
              </div>
              <span className="text-[11px] text-text-muted">更多</span>
            </button>
          </div>
        </div>

        {/* Tasks section */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text-main mb-3 px-1">
            待办任务
          </h2>
          <div className="space-y-3">
            {TASKS.map((task) => (
              <div
                key={task.id}
                className={`rounded-card p-4 flex items-center gap-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  task.done ? 'opacity-60' : ''
                } ${task.color}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    task.done
                      ? 'bg-white text-teal-mint'
                      : 'bg-white/70 text-text-muted'
                  }`}
                >
                  {task.done ? (
                    <CheckCircle size={18} weight="fill" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-text-muted/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-semibold text-sm text-text-main ${
                        task.done ? 'line-through' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                  </div>
                  <p className="text-xs text-text-muted truncate">
                    {task.subject}
                  </p>
                </div>
                <div className="text-[11px] text-text-muted whitespace-nowrap flex-shrink-0">
                  {task.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: back to login */}
        <div className="text-center pb-4">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-main transition-colors"
          >
            <SignOut size={14} />
            切换账号
          </button>
        </div>
      </div>
    </div>
  )
}
