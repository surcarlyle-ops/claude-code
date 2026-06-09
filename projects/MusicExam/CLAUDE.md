# CLAUDE.md — MusicExam 项目

## 项目简介
面向初高中生的音乐初级考试评分系统。学生对着摄像头唱指定曲目，系统通过 AI 模型做音准+节奏评分，实时反馈结果。

---

## 项目状态（2026-06-09）

| 模块 | 状态 | 说明 |
|------|------|------|
| 产品设计 | ✅ 完成 | PRD + 设计规范，详见 `docs/` |
| 前端 UI（4 页） | ✅ 完成 | 登录→选曲→考试→结果，全部可演示 |
| 后端 API 路由 | ⚠️ 骨架完成 | FastAPI 路由就绪，评分引擎 stub |
| 评分引擎 | ⬜ 未接入 | CREPE + Librosa 待接入 |
| 人脸检测 | ⬜ 未接入 | 前端 UI 就绪，后端仅存图 |

**重要决策**：用户要先审前端 UI，满意后再做后端。在此之前不碰后端代码。

---

## 快速启动（演示）

```bash
cd projects/MusicExam/frontend && npm run dev
```

打开 `http://localhost:5173/`，登录页底部有「演示模式」三个按钮，**无需后端**即可浏览所有页面。

---

## 4 个页面一览

### 1. 登录页 `/login`
- 姓名 + 学号输入
- 摄像头拍照绑定人脸
- 底部演示按钮：直接考试 / 选曲页 / 结果页

### 2. 选曲页 `/songs`
- 难度筛选（初/中/高级）
- 曲目卡片（简谱缩略图 + 试听按钮 + 时长）
- 选择确认弹窗

### 3. 考试页 `/exam`（核心）
- 左栏：摄像头画面 + 人脸在位状态
- 右栏上方：三张分项分数卡（音准/节奏/总分）
- 右栏中间：Canvas 音高曲线（灰色虚线 = 参考旋律，红色实线 = 学生音高）
- 右栏下方：简谱逐小节滚动高亮
- 底部：珊瑚粉渐变进度条 + 开始/结束按钮
- 3-2-1 倒计时后自动开始

### 4. 结果页 `/result`
- 总分大卡片 + 鼓励语
- 音准/节奏分项卡片（带进度条）
- 错误小节列表（小节号 + 类型 + 说明）
- 改进建议卡片
- 操作按钮：再唱一次 / 换一首

---

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 19 + TypeScript + Vite + Tailwind CSS 4 |
| 后端 | Python FastAPI + SQLAlchemy + SQLite |
| 音高模型 | CREPE（MIT License）— 待接入 |
| 节奏分析 | Librosa（ISC License）— 待接入 |
| 人脸检测 | OpenCV / MediaPipe — 待接入 |
| 图标 | Phosphor Icons |
| 字体 | Nunito + Caveat（Google Fonts） |

---

## 设计体系

- **风格**：明亮清新、白底、卡片式布局
- **主色**：浅粉 `#FADADD`、奶油黄 `#FDF4D0`、浅天蓝 `#D6ECFB`、薄荷绿 `#D5F5E3`、淡紫 `#E8DAEF`
- **点缀色**：珊瑚粉 `#FF6B6B`（错误/按钮）、青蓝 `#4ECDC4`（正确/成功）
- **圆角**：大卡片 20-24px、按钮 16px
- 完整设计规范见 `docs/specs/design-spec.md`

---

## 目录结构

```
projects/MusicExam/
├── CLAUDE.md              ← 本文件（会话入口）
├── frontend/
│   └── src/
│       ├── App.tsx         # 路由
│       ├── index.css       # Tailwind v4 主题
│       ├── main.tsx
│       ├── pages/
│       │   ├── LoginPage.tsx
│       │   ├── SongsPage.tsx
│       │   ├── ExamPage.tsx
│       │   └── ResultPage.tsx
│       └── services/api.ts # API 封装
├── backend/
│   └── app/
│       ├── api/            # FastAPI 路由
│       ├── models/         # SQLAlchemy 模型
│       ├── services/
│       │   ├── scoring_engine.py  # stub
│       │   └── face_service.py    # stub
│       └── db/database.py
└── docs/
    ├── prd/
    │   └── PRD-v1.0.md          # 产品需求文档（模板1输出）
    ├── specs/
    │   └── design-spec.md       # 设计规范（PRD + 设计体系 + 4页面布局）
    └── superpowers/plans/
        └── 2026-06-09-frontend-pages-completion.md
```

---

## 当前已知限制

- 考试页分数是 `Math.random()` 模拟，非真实评分
- 音高曲线数据是正弦波模拟，非真实音频分析
- 提交评分会调后端 API，但后端返回硬编码结果
- `faceLost` 状态已就位但无人脸检测逻辑触发
- 数据库目前是空的（无种子曲目数据）

---

## 下个 Session 入口

> 继续推进 MusicExam 项目

我会读取本文件恢复上下文。如果是修改前端 UI，请同时告诉我具体需求。
