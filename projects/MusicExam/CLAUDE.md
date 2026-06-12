# CLAUDE.md — MusicExam 项目

## 项目简介
面向上海中小学生的音乐考试练习平台。学生对着摄像头唱指定曲目，系统通过 AI 模型做音准+节奏评分，实时反馈结果。

---

## 项目状态（2026-06-12）

| 模块 | 状态 | 说明 |
|------|------|------|
| 产品调研 | ✅ 完成 | 见 CLAUDE.md 调研结论 |
| 设计文档 | ✅ 完成 | `docs/superpowers/specs/2026-06-11-dual-mode-redesign.md` |
| 前端 UI（7 页） | ✅ 双模式 + 自适应布局 | 欢迎→登录→首页→选曲→演唱→结果→学习记录 |
| 后端 | ⬜ 暂不开发 | FastAPI 骨架已建 |

## 当前焦点 — 前端 UI 展示效果

### 双模式设计
- **练习模式**：歌词常驻、无评分、AI 小幽灵陪伴
- **考试模式**：歌词隐藏、完整评分、等级制结果页

### 自适应布局（2026-06-12 新增）
所有页面已使用弹性容器 + 响应式字体，在宽屏上自然扩展：
- `container-wide` CSS 类：xl/2xl/3xl/4xl 逐步扩展最大宽度
- `text-responsive-*` 系列类：`clamp()` 平滑字体缩放
- SongsPage 在 2xl 时增至 4 列网格
- 详情见 `docs/UI-REFERENCE-GUIDE.md`

---

## 7 个页面一览

1. **欢迎页** `/welcome` — 扁平矢量插画 + 品牌口号
2. **登录页** `/login` — 人脸采集弹窗 + 姓名 + 年级
3. **首页** `/home` — 看板形式：快捷入口卡片 + 最近练习
4. **选曲页** `/songs` — 难度筛选 + 卡片网格 + QQ 音乐风格播放弹窗
5. **演唱页** `/sing/practice` / `/sing/exam` — 山峦波浪进度条 + 歌词滚动 + 小幽灵
6. **结果页** `/result` — 等级制（A+~D）+ 分项评分 + 改进建议
7. **学习记录** `/trends` — 折线图 + 练习记录列表 + 摘要统计

核心流程：欢迎页 → 登录 → 首页 → 选曲 → 演唱 → 结果（再唱/换曲/查看记录）

---

## 调研结论摘要

- 考试形式：清唱一首歌，老师主观打分，每人约 30 秒评分时间
- 学生痛点：音准和节奏最难，起调问题，缺乏个体反馈，考试焦虑
- 竞品：「音乐星球」微信小程序（武汉试点）、「行者AI美育」商用方案
- 产品定位：「让学生自己对着电脑唱、即时看分、知道哪里错了」

---

## 快速启动

```bash
cd projects/MusicExam/frontend && npm run dev
```

打开 `http://localhost:5173/`，无需后端即可浏览所有页面。

---

## 技术栈

| 层 | 技术 |
| --- |---|
| 前端 | React 19 + TypeScript + Vite + Tailwind CSS 4 |
| 动画 | GSAP + @gsap/react |
| 后端 | Python FastAPI + SQLAlchemy + SQLite（暂不开发） |
| 图标 | Phosphor Icons |
| 字体 | Nunito + Caveat |

---

## 设计原则

1. **活泼亮眼** — 玫瑰粉主色调，马卡龙色系卡片，暖白背景
2. **游戏化反馈** — 山峦波浪进度条、彩色圆点、音符跳动，无负反馈
3. **自适应布局** — 弹性容器 + 响应式字体，大屏小屏都舒适
4. **桌面优先** — 使用 container-wide / 2xl 断点优化宽屏体验
5. **大圆角体系** — 卡片 20px、按钮 16px、输入框 14px

---

## 目录结构

```
projects/MusicExam/
├── CLAUDE.md                   ← 会话入口
├── frontend/src/
│   ├── App.tsx                 # 路由（8 条路由）
│   ├── index.css               # Tailwind v4 主题 + 自适应工具类
│   ├── components/
│   │   ├── BottomNav.tsx       # 底部导航栏
│   │   └── ScaleProvider.tsx   # 全局缩放上下文
│   ├── pages/                  # 7 个页面
│   ├── data/lyrics.ts          # 歌词数据
│   └── services/api.ts         # API 封装
├── backend/                    # 骨架，暂不开发
├── docs/
│   ├── UI-REFERENCE-GUIDE.md   # UI 参考图接入指南
│   ├── prd/PRD-v1.0.md
│   ├── specs/design-spec.md
│   └── superpowers/specs/2026-06-11-dual-mode-redesign.md
```

---

## 当前已知限制

- 评分数据是 `Math.random()` 模拟，非真实 CREPE 评分
- 人脸拍照只存图，无实际人脸识别/验证逻辑
- 数据库空，无种子曲目数据
- 后端 API 存在安全风险（IDOR 等），待后续处理

---

## 后续方向

- 接入真实评分引擎（CREPE + Librosa）
- 人脸检测功能（后端验证）
- 曲目数据填充
- 真实学生测试反馈