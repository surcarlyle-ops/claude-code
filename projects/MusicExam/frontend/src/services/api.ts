// API service layer — typed wrappers around backend endpoints.

export interface Student {
  id: number
  name: string
  student_number: string
}

export interface Song {
  id: number
  title: string
  difficulty: 1 | 2 | 3
  duration: number
  notation_url: string | null
  midi_url: string | null
  reference_pitch?: [number, number][]
  reference_beats?: number[]
}

export interface ExamResult {
  id: number
  student_id: number
  song_id: number
  pitch_score: number
  rhythm_score: number
  total_score: number
  errors: ErrorItem[]
  suggestions: string[]
  created_at: string
}

export interface ErrorItem {
  bar: number
  type: 'pitch' | 'rhythm'
  detail: string
}

const BASE = '/api'

export async function registerStudent(
  name: string,
  student_number: string,
  face_image: File,
): Promise<Student> {
  const form = new FormData()
  form.append('name', name)
  form.append('student_number', student_number)
  form.append('face_image', face_image)
  const res = await fetch(`${BASE}/students/register`, { method: 'POST', body: form })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail ?? '注册失败')
  }
  return res.json()
}

export async function getStudent(id: number): Promise<Student> {
  const res = await fetch(`${BASE}/students/${id}`)
  if (!res.ok) throw new Error('考生不存在')
  return res.json()
}

export async function listSongs(difficulty?: number): Promise<Song[]> {
  const params = difficulty !== undefined ? `?difficulty=${difficulty}` : ''
  const res = await fetch(`${BASE}/songs/${params}`)
  return res.json()
}

export async function getSong(id: number): Promise<Song> {
  const res = await fetch(`${BASE}/songs/${id}`)
  return res.json()
}

export async function submitExam(
  student_id: number,
  song_id: number,
  audio: File,
): Promise<ExamResult> {
  const form = new FormData()
  form.append('student_id', String(student_id))
  form.append('song_id', String(song_id))
  form.append('audio', audio)
  const res = await fetch(`${BASE}/exams/submit`, { method: 'POST', body: form })
  if (!res.ok) throw new Error('提交失败')
  return res.json()
}

export async function getResult(id: number): Promise<ExamResult> {
  const res = await fetch(`${BASE}/results/${id}`)
  return res.json()
}

export async function getStudentHistory(student_id: number): Promise<ExamResult[]> {
  const res = await fetch(`${BASE}/results/student/${student_id}`)
  return res.json()
}