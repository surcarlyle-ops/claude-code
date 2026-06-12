import { useNavigate, useLocation } from 'react-router-dom'
import { House, MusicNote, ChartLine, User } from '@phosphor-icons/react'

const NAV_ITEMS = [
  { path: '/home', label: '首页', icon: House },
  { path: '/songs', label: '选曲', icon: MusicNote },
  { path: '/trends', label: '记录', icon: ChartLine },
  { path: '/login', label: '我', icon: User },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="border-t border-rose-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-rose-400'
                  : 'text-gray-300 hover:text-text-muted'
              }`}
            >
              <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}