# CLAUDE.md - 项目级配置

## 目录结构
```
claude code/
├── CLAUDE.md              # 本文件 - 项目级总管
├── projects/              # 活跃项目（每个子文件夹一个项目）
│   ├── study-mirror/      # 学习记录/时间管理应用
│   └── MusicExam/         # 音乐考试评分系统
├── _archived/             # 已归档的旧项目
│   └── old-fullstack-project/
└── tools/                 # 跨项目共享脚本/工具
```

## 项目管理规范
- 新项目统一在 `projects/` 下建文件夹
- 已结束的项目移入 `_archived/`
- 跨项目可复用的脚本放到 `tools/`

## Git 流程
- 每次完成功能修改后由 Claude 执行提交流程
- 提交信息简洁描述本次改动（中英文均可）
- 每次开始新任务前先 `git pull`