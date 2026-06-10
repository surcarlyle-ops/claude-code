import { chromium } from 'playwright'

const BASE = 'http://localhost:5173'

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }) // iPhone 14 size for mobile-ish preview

async function snap(path, label) {
  const page = await ctx.newPage()
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `/Users/carlyle/claude code/projects/MusicExam/frontend/screenshots/${label}.png`, fullPage: true })
  console.log(`✅ ${label}`)
  await page.close()
}

import { mkdirSync } from 'fs'
mkdirSync('/Users/carlyle/claude code/projects/MusicExam/frontend/screenshots', { recursive: true })

// Page 1: Login — inject sessionStorage to prevent redirect
const p1 = await ctx.newPage()
await p1.goto(BASE + '/', { waitUntil: 'networkidle' })
await p1.waitForTimeout(500)
await p1.screenshot({ path: '/Users/carlyle/claude code/projects/MusicExam/frontend/screenshots/01-login.png', fullPage: true })
console.log('✅ 01-login')
await p1.close()

// Page 2: Songs — inject student data into sessionStorage first
const p2 = await ctx.newPage()
await p2.goto(BASE + '/', { waitUntil: 'networkidle' })
await p2.evaluate(() => {
  sessionStorage.setItem('student', JSON.stringify({ id: 1, name: '张三', student_number: '2024001' }))
})
await p2.goto(BASE + '/songs', { waitUntil: 'networkidle' })
await p2.waitForTimeout(500)
await p2.screenshot({ path: '/Users/carlyle/claude code/projects/MusicExam/frontend/screenshots/02-songs.png', fullPage: true })
console.log('✅ 02-songs')
await p2.close()

// Page 3: Exam — inject student + songId
const p3 = await ctx.newPage()
await p3.goto(BASE + '/', { waitUntil: 'networkidle' })
await p3.evaluate(() => {
  sessionStorage.setItem('student', JSON.stringify({ id: 1, name: '张三', student_number: '2024001' }))
  sessionStorage.setItem('selectedSongId', '1')
})
await p3.goto(BASE + '/exam', { waitUntil: 'networkidle' })
await p3.waitForTimeout(500)
// Click "开始演唱" to enter singing phase so canvas + notation highlight are visible
await p3.click('button:has-text("开始演唱")')
await p3.waitForTimeout(2500) // wait for countdown to finish + some singing data
await p3.screenshot({ path: '/Users/carlyle/claude code/projects/MusicExam/frontend/screenshots/03-exam-singing.png', fullPage: true })
console.log('✅ 03-exam-singing')
await p3.close()

// Page 4: Result — inject full mock result
const p4 = await ctx.newPage()
await p4.goto(BASE + '/', { waitUntil: 'networkidle' })
await p4.evaluate(() => {
  sessionStorage.setItem('student', JSON.stringify({ id: 1, name: '张三', student_number: '2024001' }))
  sessionStorage.setItem('lastResult', JSON.stringify({
    id: 1, student_id: 1, song_id: 1,
    pitch_score: 92, rhythm_score: 85, total_score: 89.2,
    errors: [
      { bar: 3, type: 'pitch', detail: '音高偏低，偏低了大二度' },
      { bar: 8, type: 'rhythm', detail: '节奏偏快，比参考快0.3秒' },
      { bar: 12, type: 'pitch', detail: '音高偏高' },
    ],
    suggestions: [
      '第3-5小节音准偏低，建议单独慢速练习',
      '中段节奏偏快，可以跟着节拍器先练',
      '高音部分不错，继续保持！',
    ],
    created_at: '2026-06-09T10:30:00',
  }))
})
await p4.goto(BASE + '/result', { waitUntil: 'networkidle' })
await p4.waitForTimeout(500)
await p4.screenshot({ path: '/Users/carlyle/claude code/projects/MusicExam/frontend/screenshots/04-result.png', fullPage: true })
console.log('✅ 04-result')
await p4.close()

await browser.close()
console.log('\n🎉 All screenshots saved to screenshots/')