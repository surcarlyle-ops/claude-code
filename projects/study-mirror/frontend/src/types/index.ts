export type TimerState = 'idle' | 'running' | 'stopped' | 'paused'

export interface StudyRecord {
  id: string
  content: string
  tags: string[]
  durationMinutes: number
  feeling: 'focused' | 'confused' | 'excited' | 'tired' | 'breakthrough' | 'neutral'
  contentType?: 'video' | 'article' | 'paper' | 'tutorial' | 'documentation' | 'project' | 'meeting' | 'exercise'
  platform?: 'bilibili' | 'youtube' | 'notion' | 'github' | 'medium' | 'twitter' | 'reddit' | 'discord' | 'other'
  createdAt: string // ISO string
  updatedAt: string // ISO string
  startTime?: string // Optional for timer
  endTime?: string // Optional for timer
}

export interface DailyStats {
  date: Date
  totalMinutes: number
  recordCount: number
  mainTags: string[]
  avgFeeling: number
}

export interface UserStats {
  totalHours: number
  totalDays: number
  currentStreak: number
  bestStreak: number
}

export interface HeatMapData {
  date: string // YYYY-MM-DD
  count: number
  hours: number
}

export interface TagFrequency {
  tag: string
  count: number
  totalMinutes: number
}

export interface WelcomeMessage {
  id: string
  text: string
  emoji: string
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
}