import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause, Star } from '@phosphor-icons/react'
import { listSongs, type Song } from '../services/api'

const DIFFICULTY_LABELS: Record<number, string> = { 1: '初级', 2: '中级', 3: '高级' }
const DIFFICULTY_STARS: Record<number, string> = { 1: '★☆☆', 2: '★★☆', 3: '★★★' }
const CARD_COLORS = ['bg-blue-sky', 'bg-purple-lavender', 'bg-yellow-cream']

export default function SongsPage() {
  const navigate = useNavigate()
  const [songs, setSongs] = useState<Song[]>([])
  const [filter, setFilter] = useState(1)
  const [loading, setLoading] = useState(true)
  const [playingId, setPlayingId] = useState<number | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('student')
    if (!raw) { navigate('/login', { replace: true }); return }
  }, [navigate])

  useEffect(() => {
    setLoading(true)
    listSongs(filter).then(setSongs).catch(() => setSongs([])).finally(() => setLoading(false))
  }, [filter])

  const handlePlay = (id: number, midiUrl: string | null) => {
    if (playingId === id) { setPlayingId(null); return }
    setPlayingId(id)
    if (midiUrl) {
      const audio = new Audio(midiUrl)
      audio.play().then(() => { audio.onended = () => setPlayingId(null) })
    }
  }

  const handleSelect = (id: number) => {
    sessionStorage.setItem('selectedSongId', String(id))
    navigate('/exam')
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button type="button" onClick={() => navigate('/')} className="flex items-center gap-1 text-text-muted hover:text-text-main transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm">返回</span>
          </button>
          <h1 className="text-xl font-bold text-text-main">选择曲目</h1>
          <div className="w-12 h-12 rounded-full bg-pink-soft flex items-center justify-center text-base font-bold text-coral shadow-sm border-2 border-white">
            {(() => { try { return JSON.parse(sessionStorage.getItem('student') ?? '{}').name?.charAt(0) ?? '?' } catch { return '?' } })()}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Filter */}
        <div className="flex gap-3 mb-8">
          {[1, 2, 3].map((d) => (
            <button key={d} type="button" onClick={() => setFilter(d)}
              className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm"
              style={{ backgroundColor: filter === d ? '#FADADD' : '#fff', color: filter === d ? '#FF6B6B' : '#636E72' }}
            >{DIFFICULTY_LABELS[d]}</button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-card bg-white animate-pulse shadow-sm" />)}
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-20 text-text-muted"><p className="text-lg">暂无该级别曲目</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {songs.map((song, i) => (
              <div key={song.id}
                className={`rounded-card p-5 ${CARD_COLORS[i % 3]} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col`}
                onClick={() => handleSelect(song.id)}
              >
                <div className="w-14 h-14 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0 mb-3 shadow-sm">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="font-semibold text-text-main text-lg mb-1">{song.title}</h3>
                <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
                  <span className="flex items-center gap-1">
                    <Star size={14} weight="fill" className="text-yellow-500" />
                    {DIFFICULTY_STARS[song.difficulty]}
                  </span>
                  <span>{Math.floor(song.duration / 60)}'{Math.floor(song.duration % 60).toString().padStart(2, '0')}"</span>
                </div>
                <div className="mt-auto flex items-center gap-2">
                  <button type="button" onClick={(e) => { e.stopPropagation(); handlePlay(song.id, song.midi_url) }}
                    className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-all shadow-sm"
                    title={playingId === song.id ? '暂停' : '试听'}
                  >
                    {playingId === song.id ? <Pause size={16} weight="fill" className="text-coral" /> : <Play size={16} weight="fill" className="text-text-main" />}
                  </button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleSelect(song.id) }}
                    className="px-4 py-2 rounded-btn bg-coral text-white text-sm font-semibold hover:opacity-90 hover:shadow-md transition-all"
                  >开始演唱</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}