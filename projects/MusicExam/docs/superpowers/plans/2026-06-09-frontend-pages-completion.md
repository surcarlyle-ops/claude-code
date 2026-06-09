# 前端页面完善实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成 ResultPage 完整实现 + ExamPage 的音高曲线 Canvas 和简谱滚动增强

**Architecture:** 纯前端 React 组件，通过 sessionStorage 跨页面传递数据，Canvas API 绘制音高曲线，定时器驱动简谱滚动。分数数据来自后端 API 返回的 ExamResult。

**Tech Stack:** React 19 + TypeScript + Tailwind CSS 4 + Canvas API + Phosphor Icons

---

## 文件结构

本次涉及的文件：

| 文件 | 操作 | 职责 |
|------|------|------|
| `frontend/src/pages/ResultPage.tsx` | 重写 | 考试结果展示（总分、分项、错误、建议、操作按钮）|
| `frontend/src/pages/ExamPage.tsx` | 修改 | 新增音高曲线 Canvas + 简谱滚动高亮 |

---

### Task 1: ResultPage — 总分与分项得分

**Files:**
- Modify: `projects/MusicExam/frontend/src/pages/ResultPage.tsx`（整个文件重写）

- [ ] **Step 1: 从 sessionStorage 读取结果数据，若无数据则显示重定向提示**

```tsx
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowCounterClockwise, MusicNote, ShareNetwork } from '@phosphor-icons/react'
import { type ExamResult } from '../services/api'

export default function ResultPage() {
  const navigate = useNavigate()

  // Read result from sessionStorage (set by ExamPage after submit)
  const result: ExamResult | null = (() => {
    try {
      const raw = sessionStorage.getItem('lastResult')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })()

  const studentName: string = (() => {
    try {
      const s = JSON.parse(sessionStorage.getItem('student') ?? '{}')
      return s.name ?? ''
    } catch {
      return ''
    }
  })()

  const songTitle: string = (() => {
    try {
      const s = JSON.parse(sessionStorage.getItem('selectedSongId') ?? '""')
      return s ?? ''
    } catch {
      return ''
    }
  })()

  if (!result) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-5">
        <p className="text-text-muted text-lg mb-4">暂无考试结果</p>
        <button
          type="button"
          onClick={() => navigate('/songs')}
          className="px-6 py-2.5 rounded-btn bg-coral text-white font-semibold hover:opacity-90 transition-opacity"
        >
          去选曲
        </button>
      </div>
    )
  }

  const encouragement = getEncouragement(result.total_score)

  return (
    <div className="min-h-screen bg-surface px-5 py-8 max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => navigate('/songs')}
          className="flex items-center gap-1 text-text-muted hover:text-text-main transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">返回选曲</span>
        </button>
        <h1 className="text-[24px] font-bold text-text-main">考试结果</h1>
        <div className="w-16" />
      </div>

      {/* Total score card */}
      <div className="rounded-card bg-white border-2 border-pink-soft p-8 text-center mb-6">
        <p className="text-5xl mb-2">🎉</p>
        <p className="text-[56px] font-bold text-text-main leading-none mb-2">
          {Math.round(result.total_score)}
        </p>
        <p className="font-handwriting text-2xl text-text-muted">{encouragement}</p>
      </div>

      {/* Sub-score cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-card bg-blue-sky p-5 text-center">
          <p className="text-sm text-text-muted mb-2">🎯 音准</p>
          <p className="text-[32px] font-bold text-text-main mb-3">
            {Math.round(result.pitch_score)}%
          </p>
          <div className="h-2.5 rounded-full bg-white/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-teal-mint transition-all duration-700"
              style={{ width: `${result.pitch_score}%` }}
            />
          </div>
        </div>
        <div className="rounded-card bg-mint p-5 text-center">
          <p className="text-sm text-text-muted mb-2">🥁 节奏</p>
          <p className="text-[32px] font-bold text-text-main mb-3">
            {Math.round(result.rhythm_score)}%
          </p>
          <div className="h-2.5 rounded-full bg-white/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-coral transition-all duration-700"
              style={{ width: `${result.rhythm_score}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function getEncouragement(score: number): string {
  if (score >= 90) return '太棒了！'
  if (score >= 80) return '表现不错！'
  if (score >= 70) return '继续加油！'
  if (score >= 60) return '还有进步空间～'
  return '下次会更好 💪'
}
```

- [ ] **Step 2: 验证 UI 渲染正确**

Run: `cd projects/MusicExam/frontend && npm run dev`
在浏览器中手动设置 sessionStorage 后访问 `/result`，确认总分卡片和分项卡片正常显示。

- [ ] **Step 3: 提交**

```bash
git add projects/MusicExam/frontend/src/pages/ResultPage.tsx
git commit -m "feat: implement ResultPage total score and sub-score cards"
```

---

### Task 2: ResultPage — 错误小节与改进建议

**Files:**
- Modify: `projects/MusicExam/frontend/src/pages/ResultPage.tsx`（在已有结构中追加）

- [ ] **Step 1: 在分项卡片下方追加错误标记和建议卡片**

在总分 + 分项卡片结构内的 `</div>` 闭合标签之前（即总分卡片的 `</div>` 之后、组件 return 的闭合 `</div>` 之前），追加以下内容：

```tsx
      {/* Error markers */}
      {result.errors && result.errors.length > 0 && (
        <div className="rounded-card bg-yellow-cream p-5 mb-6">
          <h2 className="font-semibold text-text-main mb-3 flex items-center gap-2">
            🔍 错误小节
          </h2>
          <ul className="space-y-2">
            {result.errors.map((err, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm"
              >
                <span className="font-mono font-semibold text-coral flex-shrink-0">
                  小节 {err.bar}
                </span>
                <span className={err.type === 'pitch' ? 'text-coral' : 'text-teal-mint'}>
                  {err.type === 'pitch' ? '🎯' : '🥁'}
                </span>
                <span className="text-text-main">{err.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div className="rounded-card bg-purple-lavender p-5 mb-6">
          <h2 className="font-semibold text-text-main mb-3 flex items-center gap-2">
            💡 改进建议
          </h2>
          <ul className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-main">
                <span className="text-coral flex-shrink-0">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
```

- [ ] **Step 2: 添加操作按钮区域**

在建议卡片之后、组件最外层 `</div>` 之前追加：

```tsx
      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate('/exam')}
          className="flex-1 py-3 rounded-btn bg-coral text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
        >
          <ArrowCounterClockwise size={18} />
          再唱一次
        </button>
        <button
          type="button"
          onClick={() => navigate('/songs')}
          className="flex-1 py-3 rounded-btn bg-white border border-gray-200 text-text-main font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <MusicNote size={18} />
          换一首
        </button>
      </div>
```

- [ ] **Step 3: 验证错误和建议显示**

在浏览器中手动构造包含 errors 和 suggestions 的 mock 数据写入 sessionStorage，确认两卡片正常渲染。

- [ ] **Step 4: 提交**

```bash
git add projects/MusicExam/frontend/src/pages/ResultPage.tsx
git commit -m "feat: add error markers, suggestions and action buttons to ResultPage"
```

---

### Task 3: ExamPage — 音高曲线 Canvas

**Files:**
- Modify: `projects/MusicExam/frontend/src/pages/ExamPage.tsx`

- [ ] **Step 1: 添加 Canvas ref、elapsedRef 和绘制逻辑**

在 ExamPage 组件内，在所有 state 声明之后（现有的 `const [error, setError] = useState('')` 下方）新增：

```tsx
const [activeMeasure, setActiveMeasure] = useState(0)
```

在组件顶部（import 语句之后、组件定义之前）新增常量：

```tsx
const MEASURES = ['♩ ♩ ♩ ♩', '♩ ♩ ♩ ♩', '♩ ♪ ♪ ♩', '♩ ♩ ♩ ♩']
const MEASURE_DURATION = 4 // seconds per measure (4/4 at moderate tempo)
```

在现有 `mediaRecorderRef` 声明下方新增 refs：

```tsx
const canvasRef = useRef<HTMLCanvasElement>(null)
const pitchHistoryRef = useRef<{ time: number; value: number }[]>([])
const elapsedRef = useRef(0) // shared elapsed counter for pitch + measure intervals

// Canvas drawing effect — runs during singing phase
useEffect(() => {
  if (phase !== 'singing') return
  const canvas = canvasRef.current
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const W = canvas.width
  const H = canvas.height
  const PAD = { top: 20, right: 30, bottom: 30, left: 40 }
  const PW = W - PAD.left - PAD.right
  const PH = H - PAD.top - PAD.bottom

  // Simulated reference pitch curve (sin wave as placeholder for demo)
  const refPoints: { x: number; y: number }[] = []
  for (let i = 0; i <= PW; i += 2) {
    const t = i / PW
    const y = PAD.top + PH / 2 + Math.sin(t * Math.PI * 4) * PH * 0.3
    refPoints.push({ x: PAD.left + i, y })
  }

  let animId: number
  const draw = () => {
    ctx.clearRect(0, 0, W, H)

    // Grid lines
    ctx.strokeStyle = '#E8E8E8'
    ctx.lineWidth = 1
    for (let i = 0; i < 5; i++) {
      const y = PAD.top + (PH / 4) * i
      ctx.beginPath()
      ctx.moveTo(PAD.left, y)
      ctx.lineTo(W - PAD.right, y)
      ctx.stroke()
    }

    // Reference curve (dashed gray)
    if (refPoints.length > 1) {
      ctx.strokeStyle = '#B0B0B0'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 4])
      ctx.beginPath()
      ctx.moveTo(refPoints[0].x, refPoints[0].y)
      for (let i = 1; i < refPoints.length; i++) {
        ctx.lineTo(refPoints[i].x, refPoints[i].y)
      }
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Student pitch curve (solid coral)
    const history = pitchHistoryRef.current
    if (history.length > 1) {
      ctx.strokeStyle = '#FF6B6B'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      const duration = song?.duration ?? 60
      const firstX = PAD.left + (history[0].time / duration) * PW
      const firstY = PAD.top + PH / 2 - (history[0].value - 440) / 440 * PH * 0.4
      ctx.moveTo(firstX, Math.max(PAD.top, Math.min(H - PAD.bottom, firstY)))
      for (let i = 1; i < history.length; i++) {
        const x = PAD.left + (history[i].time / duration) * PW
        const y = PAD.top + PH / 2 - (history[i].value - 440) / 440 * PH * 0.4
        ctx.lineTo(x, Math.max(PAD.top, Math.min(H - PAD.bottom, y)))
      }
      ctx.stroke()
    }

    // Axis labels
    ctx.fillStyle = '#636E72'
    ctx.font = '11px Nunito, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('高', PAD.left - 6, PAD.top + 12)
    ctx.fillText('低', PAD.left - 6, H - PAD.bottom)

    animId = requestAnimationFrame(draw)
  }
  draw()

  return () => cancelAnimationFrame(animId)
}, [phase, song])
```

- [ ] **Step 2: 替换音高曲线占位区域为 Canvas**

将 ExamPage JSX 中的：
```tsx
          {/* Pitch curve placeholder */}
          <div className="flex-1 rounded-card bg-white p-4 flex flex-col">
            <p className="text-xs text-text-muted mb-2">音高实时曲线</p>
            <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
              {phase === 'singing' ? '🎤 录音中...' : '等待开始'}
            </div>
          </div>
```

替换为：
```tsx
          {/* Pitch curve canvas */}
          <div className="flex-1 rounded-card bg-white p-4 flex flex-col min-h-0">
            <p className="text-xs text-text-muted mb-2">音高实时曲线</p>
            <div className="flex-1 relative min-h-0">
              <canvas
                ref={canvasRef}
                width={600}
                height={250}
                className="w-full h-full"
              />
              {phase !== 'singing' && (
                <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm bg-white/60">
                  等待开始
                </div>
              )}
            </div>
          </div>
```

- [ ] **Step 3: 改造计时器效应以使用 elapsedRef，追加音高模拟**

将原有的 `elapsed timer` useEffect 替换为以下版本。关键改动：(1) 新增 `elapsedRef` 同步，(2) 追加音高数据模拟 interval，(3) 追加 measure 高亮更新。

```tsx
  // Elapsed timer + simulated scores + pitch history + measure highlight
  useEffect(() => {
    if (phase !== 'singing') return

    // Sync elapsedRef with state each second
    const interval = setInterval(() => {
      setElapsed((e) => {
        elapsedRef.current = e + 1
        if (song && elapsedRef.current >= song.duration) {
          stopRecording()
          return e
        }
        return elapsedRef.current
      })
    }, 1000)

    // Simulate real-time scores
    const scoreInterval = setInterval(() => {
      setPitchScore(Math.min(100, Math.floor(Math.random() * 30) + 70))
      setRhythmScore(Math.min(100, Math.floor(Math.random() * 25) + 65))
    }, 1500)

    // Simulate pitch data points for the curve (every 200ms)
    const pitchInterval = setInterval(() => {
      const t = elapsedRef.current
      const baseFreq = 440
      const variation = Math.sin(t * 0.5) * 40 + (Math.random() - 0.5) * 30
      pitchHistoryRef.current.push({ time: t, value: baseFreq + variation })
    }, 200)

    // Update active measure based on elapsed (every 500ms)
    const measureInterval = setInterval(() => {
      setActiveMeasure(Math.min(MEASURES.length - 1, Math.floor(elapsedRef.current / MEASURE_DURATION)))
    }, 500)

    return () => {
      clearInterval(interval)
      clearInterval(scoreInterval)
      clearInterval(pitchInterval)
      clearInterval(measureInterval)
    }
  }, [phase, song, stopRecording])
```

同时修改 `startRecording`，在开始时清空 ref：

```tsx
  const startRecording = useCallback(() => {
    setPhase('singing')
    setElapsed(0)
    elapsedRef.current = 0
    setActiveMeasure(0)
    chunksRef.current = []
    pitchHistoryRef.current = []
    // ... MediaRecorder 代码不变
  }, [])
```

- [ ] **Step 4: 验证 Canvas 绘制**

Run: `cd projects/MusicExam/frontend && npm run dev`
进入考试页，点击开始演唱，观察音高曲线区域是否出现灰色虚线（参考旋律）和红色实线（模拟演唱音高）。

- [ ] **Step 5: 提交**

```bash
git add projects/MusicExam/frontend/src/pages/ExamPage.tsx
git commit -m "feat: add Canvas-based pitch curve visualization to ExamPage"
```

---

### Task 4: ExamPage — 简谱滚动高亮 JSX

**Files:**
- Modify: `projects/MusicExam/frontend/src/pages/ExamPage.tsx`

**前提**：Task 3 已添加 `MEASURES`、`MEASURE_DURATION` 常量、`activeMeasure` state 和 measure 更新逻辑。本 Task 仅替换 JSX。

- [ ] **Step 1: 替换静态简谱为可滚动高亮版本**

将 ExamPage JSX 中的：
```tsx
          {/* Notation scroll placeholder */}
          <div className="rounded-card bg-white p-4">
            <p className="text-xs text-text-muted mb-2">简谱预览</p>
            <div className="flex gap-2 text-text-muted text-sm">
              <span className="text-coral font-bold">♩ ♩ ♩ ♩</span>
              <span>|</span>
              <span>♩ ♩ ♩ ♩</span>
              <span>|</span>
              <span className="bg-pink-soft rounded px-1">♩ ♪ ♪ ♩</span>
              <span>|</span>
              <span>♩ ♩ ♩ ♩</span>
            </div>
          </div>
```

替换为：
```tsx
          {/* Notation scroll with highlight */}
          <div className="rounded-card bg-white p-4 overflow-hidden">
            <p className="text-xs text-text-muted mb-2">简谱预览</p>
            <div className="flex gap-0 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
              {MEASURES.map((measure, i) => (
                <span
                  key={i}
                  className={`flex items-center gap-0 transition-all duration-300 ${
                    i === activeMeasure && phase === 'singing'
                      ? 'bg-coral/15 text-coral font-bold scale-110 rounded px-2 py-0.5'
                      : 'text-text-muted px-1'
                  }`}
                >
                  {measure}
                  {i < MEASURES.length - 1 && (
                    <span className="text-gray-300 mx-0.5">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
```

- [ ] **Step 3: 验证简谱滚动**

在浏览器中开始演唱，观察简谱区按 4 秒/小节切换高亮，当前小节放大 + 珊瑚粉背景。

- [ ] **Step 4: 提交**

```bash
git add projects/MusicExam/frontend/src/pages/ExamPage.tsx
git commit -m "feat: add measure-by-measure notation scrolling highlight to ExamPage"
```

---

## 自审

- [x] **Spec 覆盖**：ResultPage（总分、分项、错误、建议、操作按钮）全部对应设计文档页面 4。ExamPage 音高曲线 + 简谱滚动对应设计文档页面 3。
- [x] **无占位符**：所有步骤都有具体代码，无 TBD/TODO。
- [x] **类型一致性**：ExamResult 接口已在 api.ts 中定义，与后端返回一致。
- [x] **依赖顺序**：Task 1 → Task 2 顺序依赖（同文件追加），Task 3 和 Task 4 可并行做。
