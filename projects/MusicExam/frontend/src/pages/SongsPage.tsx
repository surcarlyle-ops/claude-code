import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause, CheckCircle, Star } from '@phosphor-icons/react'
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
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [confirmId, setConfirmId] = useState<number | null>(null)

  // Restore student info from session, redirect if missing
  useEffect(() => {
    const raw = sessionStorage.getItem('student')
    if (!raw) {
      navigate('/', { replace: true })
      return
    }
  }, [navigate])

  useEffect(() => {
    setLoading(true)
    listSongs(filter)
      .then(setSongs)
      .catch(() => setSongs([]))
      .finally(() => setLoading(false))
  }, [filter])

  const handlePlay = (id: number, midiUrl: string | null) => {
    if (playingId === id) {
      setPlayingId(null)
      return
    }
    setPlayingId(id)
    if (midiUrl) {
      const audio = new Audio(midiUrl)
      audio.play().then(() => {
        audio.onended = () => setPlayingId(null)
      })
    }
  }

  const handleSelect = (id: number) => {
    setSelectedId(id)
    setConfirmId(id)
  }

  const handleConfirm = () => {
    if (selectedId !== null) {
      sessionStorage.setItem('selectedSongId', String(selectedId))
      navigate('/exam')
    }
    setConfirmId(null)
  }

  const studentName: string = (() => {
    try {
      const s = JSON.parse(sessionStorage.getItem('student') ?? '{}')
      return s.name ?? ''
    } catch {
      return ''
    }
  })()

  return (
    <div className="min-h-screen bg-surface px-5 py-8 max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          className="flex items-center gap-1 text-text-muted hover:text-text-main transition-colors"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={20} />
          <span className="text-sm">返回</span>
        </button>
        <h1 className="text-[24px] font-bold text-text-main">选择曲目</h1>
        <div className="w-10 h-10 rounded-full bg-pink-soft flex items-center justify-center text-sm font-bold text-coral shadow-sm border-2 border-white">
          {studentName.charAt(0) || '?'}
        </div>
      </div>

      {/* Difficulty filter */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setFilter(d)}
            className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm"
            style={{
              backgroundColor: filter === d ? '#FADADD' : '#fff',
              color: filter === d ? '#FF6B6B' : '#636E72',
            }}
          >
            {DIFFICULTY_LABELS[d]}
          </button>
        ))}
      </div>

      {/* Song list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-card bg-white animate-pulse shadow-sm" />
          ))}
        </div>
      ) : songs.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <p className="text-lg">暂无该级别曲目</p>
        </div>
      ) : (
        <div className="space-y-4">
          {songs.map((song, i) => (
            <div
              key={song.id}
              className={`rounded-card p-5 ${CARD_COLORS[i % 3]} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer`}
              onClick={() => handleSelect(song.id)}
            >
              <div className="flex items-center gap-4">
                {/* Notation thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-2xl">🎵</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text-main text-lg truncate">
                      {song.title}
                    </h3>
                    {selectedId === song.id && (
                      <CheckCircle
                        size={18}
                        weight="fill"
                        className="text-teal-mint flex-shrink-0"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                      <Star size={14} weight="fill" className="text-yellow-500" />
                      {DIFFICULTY_STARS[song.difficulty]}
                    </span>
                    <span>
                      {Math.floor(song.duration / 60)}'
                      {Math.floor(song.duration % 60)
                        .toString()
                        .padStart(2, '0')}"
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlay(song.id, song.midi_url)
                    }}
                    className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-all duration-200 shadow-sm"
                    title={playingId === song.id ? '暂停试听' : '试听'}
                  >
                    {playingId === song.id ? (
                      <Pause size={16} weight="fill" className="text-coral" />
                    ) : (
                      <Play size={16} weight="fill" className="text-text-main" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect(song.id)
                    }}
                    className="px-4 py-2 rounded-btn bg-coral text-white text-sm font-semibold hover:opacity-90 hover:shadow-md transition-all duration-200"
                  >
                    选择
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm modal */}
      {confirmId !== null && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-5">
          <div className="bg-white rounded-card p-8 max-w-sm w-full shadow-lg text-center">
            <p className="text-4xl mb-4">🎤</p>
            <p className="text-lg text-text-main mb-2">
              即将开始考试：
              <span className="font-bold text-coral">
                {songs.find((s) => s.id === confirmId)?.title}
              </span>
            </p>
            <p className="text-text-muted text-sm mb-6">
              准备好了吗？
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="flex-1 py-3 rounded-btn border border-gray-200 text-text-muted font-medium hover:bg-gray-50 transition-all duration-200"
              >
                再想想
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-btn bg-gradient-to-r from-coral to-coral/90 text-white font-semibold hover:shadow-md transition-all duration-200"
              >
                准备好了！
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
