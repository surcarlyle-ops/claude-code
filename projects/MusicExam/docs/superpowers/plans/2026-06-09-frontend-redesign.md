# MusicExam 前端界面美化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 MusicExam 前端 4 个已有页面按马卡龙治愈风格美化，新增首页和趋势页

**Architecture:** 所有页面在现有 React + TypeScript + Vite + Tailwind CSS v4 框架内修改。新增页面放在 `src/pages/`，路由在 `App.tsx` 添加。`index.css` 主题变量保持不变。

**Tech Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Phosphor Icons + Nunito/Caveat fonts

---

## 文件结构

### 修改文件
- `frontend/src/App.tsx` — 添加 `/home` 和 `/trends` 路由
- `frontend/src/index.css` — 调整主题，增加新色值
- `frontend/src/pages/LoginPage.tsx` — 美化
- `frontend/src/pages/SongsPage.tsx` — 美化
- `frontend/src/pages/ExamPage.tsx` — 美化
- `frontend/src/pages/ResultPage.tsx` — 美化

### 新建文件
- `frontend/src/pages/HomePage.tsx` — 首页（新增）
- `frontend/src/pages/TrendsPage.tsx` — 趋势页（新增）
- `frontend/src/components/NavHeader.tsx` — 通用顶部栏组件（可选，如果多个页面共享顶部栏）

---

### Task 1: 首页 `/home`（新增）

**Files:**
- Create: `frontend/src/pages/HomePage.tsx`

布局从上到下：
1. 问候区："Hello, 学生名" + 圆形头像
2. 标签区：3个并排小卡片（性别/年级/上次得分），白底+浅灰边框+圆角
3. 进度双卡：粉色卡片（演唱练习进度，带进度条+数字）+ 黄色卡片（已完成曲目数）
4. 快捷功能：一排彩色圆按钮（演唱练习/视唱练耳/错题回顾/历史记录/+），灰色线条图标，点击占位提示
5. 待办任务：垂直彩色卡片列表，不同颜色区分，带时间/任务名/说明/右侧圆形勾选框
6. 底部留白

数据全部静态写死。

```typescript
// 示例数据结构
const MOCK_STUDENT = { name: '张三', gender: '男', grade: '初一', lastScore: 85 }
const MOCK_TASKS = [
  { id: 1, title: '期中演唱考试', subject: '小星星', time: '2024-06-15', color: 'bg-pink-200' },
  { id: 2, title: '视唱练习', subject: 'C大调音阶', time: '2024-06-14', color: 'bg-yellow-200' },
  { id: 3, title: '节奏训练', subject: '4/4拍基础节奏', time: '2024-06-13', color: 'bg-green-200' },
]
```

- [ ] **Step 1: 创建 HomePage.tsx** — 按上方布局写出完整组件，全部静态数据

- [ ] **Step 2: 在 App.tsx 添加路由** — `<Route path="/home" element={<HomePage />} />`

- [ ] **Step 3: 启动 `npm run dev` 验证首页能正常显示**

- [ ] **Step 4: Commit**

```bash
git add projects/MusicExam/frontend/src/pages/HomePage.tsx projects/MusicExam/frontend/src/App.tsx
git commit -m "feat: add home page with macaron-style layout"
```

---

### Task 2: 美化登录页 `/login`

**Files:**
- Modify: `frontend/src/pages/LoginPage.tsx`

美化点：
- 加大留白，标题区更大气
- 输入框圆角更大、内边距更足、聚焦边框色为珊瑚粉
- 头像拍照区按新风格（圆形容器浅粉底色 + 虚线边框珊瑚粉）
- 提交按钮加大圆角，渐变珊瑚粉色
- 演示按钮区视觉优化（三个按钮更精致）
- 整体按马卡龙风格调整阴影、间距

- [ ] **Step 1: 重新设计 LoginPage.tsx 的 JSX 结构** — 调整间距、圆角、配色

- [ ] **Step 2: 添加 hover/focus 过渡动画** — 输入框聚焦、按钮悬浮效果

- [ ] **Step 3: 启动 `npm run dev` 验证**

- [ ] **Step 4: Commit**

```bash
git add projects/MusicExam/frontend/src/pages/LoginPage.tsx
git commit -m "style: beautify login page with macaron style"
```

---

### Task 3: 美化选曲页 `/songs`

**Files:**
- Modify: `frontend/src/pages/SongsPage.tsx`

美化点：
- 顶部栏返回+标题+头像小圆
- 难度筛选标签加大圆角，选中态粉色底+珊瑚粉字
- 曲目卡片彩色底（天蓝/淡紫/奶油黄轮换）+ 白色内卡片区
- 试听按钮圆形白色半透明
- 选择按钮珊瑚粉色圆角
- 确认弹窗加大圆角，柔和阴影
- 增加卡片悬浮动效（轻微上浮+加深阴影）

- [ ] **Step 1: 重写 SongsPage.tsx 卡片布局和样式**

- [ ] **Step 2: 添加悬浮动效和过渡动画**

- [ ] **Step 3: 启动 `npm run dev` 验证**

- [ ] **Step 4: Commit**

```bash
git add projects/MusicExam/frontend/src/pages/SongsPage.tsx
git commit -m "style: beautify songs page with macaron style"
```

---

### Task 4: 美化考试页 `/exam`

**Files:**
- Modify: `frontend/src/pages/ExamPage.tsx`

美化点：
- 顶部栏紧凑优雅
- 三张分数卡（音准=天蓝/节奏=薄荷绿/总分=淡紫），加大圆角，数字醒目
- 音高曲线 Canvas 区域：白色圆角卡片底，参考线灰色虚线，学生线珊瑚粉实线
- 简谱滚动区：圆角白卡，高亮小节珊瑚粉底色
- 进度条：灰色底+珊瑚粉到浅粉渐变
- 开始/结束按钮：珊瑚粉大按钮+圆角
- 倒计时：大号珊瑚粉数字+呼吸动画
- 状态：等待开始/演唱中/评分中 各自不同视觉

- [ ] **Step 1: 重写 ExamPage.tsx 的样式类名和布局结构**

- [ ] **Step 2: 调整 Canvas 和简谱滚动区的视觉风格**

- [ ] **Step 3: 启动 `npm run dev` 验证**

- [ ] **Step 4: Commit**

```bash
git add projects/MusicExam/frontend/src/pages/ExamPage.tsx
git commit -m "style: beautify exam page with macaron style"
```

---

### Task 5: 美化结果页 `/result`

**Files:**
- Modify: `frontend/src/pages/ResultPage.tsx`

美化点：
- 总分大卡：白底+粉色边框，大数字+鼓励语（手写体Caveat），顶部🎉装饰
- 分项双卡：音准（天蓝）+ 节奏（薄荷绿），带进度条
- 错误小节卡：奶油黄底，粉标音准+绿标节奏
- 改进建议卡：淡紫底，bullet 珊瑚粉色
- 按钮组："再唱一次"珊瑚粉+ "换一首"白底灰边框
- 增加总分数字滚动入场动画

- [ ] **Step 1: 重写 ResultPage.tsx 的样式和布局**

- [ ] **Step 2: 添加总分数字滚动动画效果**

- [ ] **Step 3: 启动 `npm run dev` 验证**

- [ ] **Step 4: Commit**

```bash
git add projects/MusicExam/frontend/src/pages/ResultPage.tsx
git commit -m "style: beautify result page with macaron style"
```

---

### Task 6: 趋势页 `/trends`（新增）

**Files:**
- Create: `frontend/src/pages/TrendsPage.tsx`

布局：
1. 顶部栏：返回箭头 + "学习趋势"标题
2. 时间筛选："7天""30天""自定义" 圆角标签
3. Canvas 折线图：X轴=日期，Y轴=得分，柔和浅色填充区域，数据点+标签
4. 练习记录列表：按日期排列的评分卡片

Canvas 绘制逻辑：
- 静态示例数据（7天得分数组）
- 浅灰色网格线
- 浅色渐变填充区域（粉色/蓝色过渡）
- 数据点用小圆圈标记
- 柔和阴影

```typescript
// 示例数据
const MOCK_SCORES = [
  { date: '06-03', score: 72 },
  { date: '06-04', score: 78 },
  { date: '06-05', score: 65 },
  { date: '06-06', score: 82 },
  { date: '06-07', score: 80 },
  { date: '06-08', score: 88 },
  { date: '06-09', score: 85 },
]
```

- [ ] **Step 1: 创建 TrendsPage.tsx** — 完整页面，包含 Canvas 图表

- [ ] **Step 2: 在 App.tsx 添加路由** — `<Route path="/trends" element={<TrendsPage />} />`

- [ ] **Step 3: 启动 `npm run dev` 验证**

- [ ] **Step 4: Commit**

```bash
git add projects/MusicExam/frontend/src/pages/TrendsPage.tsx projects/MusicExam/frontend/src/App.tsx
git commit -m "feat: add trends page with canvas chart"
```

---

### Task 7: 全局样式调整 + 交互流程优化

**Files:**
- Modify: `frontend/src/index.css` — 添加需要的额外主题色
- Modify: `frontend/src/App.tsx` — 确认所有路由正确，默认跳转到 `/home`
- Modify: 登录页演示模式按钮 — 修改演示按钮指向 `/home` 而不是 `/songs`

- [ ] **Step 1: 调整 index.css 主题变量** — 添加额外色值

- [ ] **Step 2: 调整 App.tsx 默认路由** — 根路径 `/` 改为指向 HomePage（或登录后重定向到 HomePage）

- [ ] **Step 3: 更新演示模式按钮的导航路径** — 登录页演示按钮指向 `/home`

- [ ] **Step 4: 启动 `npm run dev` 整体走一遍流程验证**

- [ ] **Step 5: Commit**

```bash
git add projects/MusicExam/frontend/src/index.css projects/MusicExam/frontend/src/App.tsx projects/MusicExam/frontend/src/pages/LoginPage.tsx
git commit -m "chore: adjust global styles and routing for new pages"
```
