import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Play, Pause, Star, X } from '@phosphor-icons/react'
import BottomNav from '../components/BottomNav'
import type { Song } from '../services/api'

const LOCAL_SONGS: Song[] = [
  { id: 1, title: '送别', difficulty: 1, duration: 80, notation_url: null, midi_url: null },
  { id: 2, title: '雪绒花', difficulty: 1, duration: 90, notation_url: null, midi_url: null },
  { id: 3, title: '让我们荡起双桨', difficulty: 1, duration: 110, notation_url: null, midi_url: null },
  { id: 4, title: '小红帽', difficulty: 1, duration: 60, notation_url: null, midi_url: null },
  { id: 5, title: '采蘑菇的小姑娘', difficulty: 1, duration: 75, notation_url: null, midi_url: null },
  { id: 6, title: '茉莉花', difficulty: 2, duration: 130, notation_url: null, midi_url: null },
  { id: 7, title: '友谊地久天长', difficulty: 2, duration: 105, notation_url: null, midi_url: null },
  { id: 8, title: '外婆的澎湖湾', difficulty: 2, duration: 140, notation_url: null, midi_url: null },
  { id: 9, title: '大海啊故乡', difficulty: 2, duration: 120, notation_url: null, midi_url: null },
  { id: 10, title: '我的中国心', difficulty: 2, duration: 150, notation_url: null, midi_url: null },
  { id: 11, title: '长江之歌', difficulty: 3, duration: 160, notation_url: null, midi_url: null },
  { id: 12, title: '歌唱祖国', difficulty: 3, duration: 140, notation_url: null, midi_url: null },
  { id: 13, title: '同一首歌', difficulty: 3, duration: 170, notation_url: null, midi_url: null },
  { id: 14, title: '我和我的祖国', difficulty: 3, duration: 180, notation_url: null, midi_url: null },
]

const DIFFICULTY_LABELS: Record<number, string> = { 1: '初级', 2: '中级', 3: '高级' }
const DIFFICULTY_STARS: Record<number, string> = { 1: '★☆☆', 2: '★★☆', 3: '★★★' }
const CARD_COLORS = ['bg-blue-sky', 'bg-purple-lavender', 'bg-yellow-cream', 'bg-mint']

export default function SongsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as Record<string, unknown> | null
  const mode = (state?.mode as string) || 'practice'
  const [songs, setSongs] = useState<Song[]>([])
  const [filter, setFilter] = useState(1)
  const [loading, setLoading] = useState(true)
  const [playingSong, setPlayingSong] = useState<Song | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('student')
    if (!raw) { navigate('/login', { replace: true }); return }
  }, [navigate])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setSongs(LOCAL_SONGS.filter((s) => s.difficulty === filter))
      setLoading(false)
    }, 200)
  }, [filter])

  const handleSelect = (id: number) => {
    sessionStorage.setItem('selectedSongId', String(id))
    const path = mode === 'exam' ? '/sing/exam' : '/sing/practice'
    navigate(path, { state: { songId: id, mode } })
  }

  const studentName: string = (() => {
    try { return JSON.parse(sessionStorage.getItem('student') ?? '{}').name ?? '' } catch { return '' }
  })()

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <button type="button" onClick={() => navigate('/home')} className="flex items-center gap-1 text-text-muted hover:text-text-main transition-colors">
              <ArrowLeft size={20} />
              <span className="text-sm">返回</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-text-main">选择曲目</h1>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                mode === 'exam'
                  ? 'bg-rose-100 text-rose-500'
                  : 'bg-rose-100 text-rose-500'
              }`}>
                {mode === 'exam' ? '🎯 考试模式' : '🎤 练习模式'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {studentName && <span className="text-xs text-text-muted">{studentName}</span>}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-300 to-purple-lavender flex items-center justify-center text-sm font-bold text-white shadow-sm">
                {studentName.charAt(0) || '?'}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Filter pills */}
          <div className="flex gap-3 mb-8">
            {[1, 2, 3].map((d) => (
              <button key={d} type="button" onClick={() => setFilter(d)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
                  filter === d ? 'bg-rose-400 text-white shadow-md' : 'bg-white text-text-muted hover:text-text-main hover:border-rose-200'
                }`}
              >{DIFFICULTY_LABELS[d]}</button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-card bg-white animate-pulse shadow-sm" />)}
            </div>
          ) : songs.length === 0 ? (
            <div className="text-center py-20 text-text-muted"><p className="text-lg">暂无该级别曲目</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {songs.map((song, i) => (
                <div key={song.id}
                  className="rounded-card p-5 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                  onClick={() => handleSelect(song.id)}
                >
                  <div className={`w-14 h-14 rounded-xl ${CARD_COLORS[i % 4]} flex items-center justify-center flex-shrink-0 mb-3 shadow-sm`}>
                    <span className="text-2xl">🎵</span>
                  </div>
                  <h3 className="font-semibold text-text-main text-lg mb-1">{song.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
                    <span className="flex items-center gap-1">
                      <Star size={14} weight="fill" className="text-yellow-400" />
                      {DIFFICULTY_STARS[song.difficulty]}
                    </span>
                    <span>{Math.floor(song.duration / 60)}'{Math.floor(song.duration % 60).toString().padStart(2, '0')}"</span>
                  </div>
                  <div className="mt-auto flex items-center gap-2">
                    <button type="button" onClick={(e) => { e.stopPropagation(); setPlayingSong(song) }}
                      className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center hover:bg-rose-100 transition-all shadow-sm"
                      title="试听"
                    >
                      <Play size={16} weight="fill" className="text-rose-400" />
                    </button>
                    <span className="text-xs text-rose-400 font-medium ml-auto">去演唱 →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />

      {/* Floating play modal */}
      {playingSong && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setPlayingSong(null)}
        >
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Art */}
            <div className="bg-gradient-to-br from-rose-200 via-mint to-blue-sky p-8 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/60 flex items-center justify-center shadow-lg">
                <span className="text-5xl">🎵</span>
              </div>
            </div>

            {/* Info */}
            <div className="px-6 pt-4 pb-2 text-center">
              <h3 className="font-bold text-text-main text-lg">{playingSong.title}</h3>
              <p className="text-text-muted text-xs">{DIFFICULTY_LABELS[playingSong.difficulty]} · {Math.floor(playingSong.duration / 60)}'{Math.floor(playingSong.duration % 60).toString().padStart(2, '0')}"</p>
            </div>

            {/* Controls */}
            <div className="px-6 py-4 flex items-center justify-center gap-6">
              <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="w-1/3 h-full rounded-full bg-gradient-to-r from-rose-300 to-rose-400" />
              </div>
              <button type="button"
                onClick={() => setPlayingSong(null)}
                className="w-12 h-12 rounded-full bg-rose-400 flex items-center justify-center text-white shadow-md hover:bg-rose-500 transition-all"
                title="暂停"
              >
                <Pause size={20} weight="fill" />
              </button>
              <div className="flex-1" />
            </div>

            {/* Close */}
            <div className="px-6 pb-4 flex justify-center">
              <button type="button" onClick={() => setPlayingSong(null)}
                className="text-xs text-text-muted hover:text-text-main transition-colors flex items-center gap-1"
              >
                <X size={14} /> 关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}