import { useLocation, useNavigate } from 'react-router-dom'
import { House, BookOpen, Microphone, ChartBar, User } from '@phosphor-icons/react'

const navItems = [
  { path: '/home', label: '首页', icon: House },
  { path: '/songs', label: '曲目', icon: BookOpen },
  { path: '/sing', label: '演唱', icon: Microphone },
  { path: '/trends', label: '趋势', icon: ChartBar },
  { path: '/profile', label: '我的', icon: User },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-dark rounded-full px-2 py-2 shadow-xl flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = currentPath.startsWith(item.path)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-white/15'
                  : 'hover:bg-white/5'
              }`}
            >
              <item.icon
                size={22}
                weight={isActive ? 'fill' : 'regular'}
                className={isActive ? 'text-white' : 'text-white/50'}
              />
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-white' : 'text-white/40'}`}>
                {item.label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-coral" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
