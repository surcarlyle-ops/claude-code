# CLAUDE.md - study-mirror 项目

## 项目简介
学习记录/时间管理 Web 应用，支持计时、热力图、内容类型记录。

## 技术栈
- **前端**：React 18 + TypeScript + Vite + Tailwind CSS
- **后端**：未实现（骨架结构：controllers/middleware/models/routes/services/utils）
- **数据库**：PostgreSQL（schema 在 `shared/schema.sql`）

## 前端启动
```bash
cd frontend
npm run dev
```

## 目录说明
```
study-mirror/
├── frontend/          # React 前端
│   ├── src/
│   │   ├── components/   # Header, HeatMap, Timer, SidebarRecord, WelcomeMessage
│   │   ├── hooks/        # useStudyRecords
│   │   ├── styles/       # global.css
│   │   ├── types/        # 类型定义
│   │   └── utils/        # 工具函数
│   └── public/icons/     # SVG 图标
├── backend/           # 后端骨架（待实现）
├── shared/schema.sql  # 数据库 schema
└── examples/          # 需求文档
```