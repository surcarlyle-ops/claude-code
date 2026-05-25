import React from 'react'
import {
  Video, FileText, BookOpen, Globe, Youtube, Github,
  MessageSquare, FileCode, Book, Tv, File, Newspaper,
  GraduationCap, Monitor, Terminal, Database, Cpu,
  Music, Paintbrush, Calculator, Languages, Code2,
  LucideIcon
} from 'lucide-react'

export type ContentType =
  | 'video' | 'article' | 'paper' | 'tutorial'
  | 'documentation' | 'project' | 'meeting' | 'exercise'
  | 'lecture' | 'workshop' | 'podcast' | 'blog'
  | 'code-review' | 'research' | 'design' | 'practice'

export type Platform =
  | 'bilibili' | 'youtube' | 'notion' | 'github'
  | 'medium' | 'twitter' | 'reddit' | 'discord'
  | 'coursera' | 'udemy' | 'edx' | 'khanacademy'
  | 'stackoverflow' | 'leetcode' | 'figma' | 'other'

interface ContentTypeConfig {
  icon: LucideIcon
  label: string
  color: string
  bgColor: string
}

interface PlatformConfig {
  icon: React.ReactNode
  label: string
  color: string
  domain?: string
}

export const CONTENT_TYPE_CONFIG: Record<ContentType, ContentTypeConfig> = {
  video: { icon: Video, label: '视频教程', color: 'text-red-400', bgColor: 'bg-red-900/20' },
  article: { icon: FileText, label: '文章', color: 'text-blue-400', bgColor: 'bg-blue-900/20' },
  paper: { icon: BookOpen, label: '学术论文', color: 'text-purple-400', bgColor: 'bg-purple-900/20' },
  tutorial: { icon: GraduationCap, label: '教程', color: 'text-green-400', bgColor: 'bg-green-900/20' },
  documentation: { icon: File, label: '文档', color: 'text-cyan-400', bgColor: 'bg-cyan-900/20' },
  project: { icon: Code2, label: '项目', color: 'text-orange-400', bgColor: 'bg-orange-900/20' },
  meeting: { icon: MessageSquare, label: '会议', color: 'text-pink-400', bgColor: 'bg-pink-900/20' },
  exercise: { icon: Calculator, label: '练习', color: 'text-yellow-400', bgColor: 'bg-yellow-900/20' },
  lecture: { icon: Tv, label: '讲座', color: 'text-indigo-400', bgColor: 'bg-indigo-900/20' },
  workshop: { icon: Monitor, label: '工作坊', color: 'text-teal-400', bgColor: 'bg-teal-900/20' },
  podcast: { icon: Music, label: '播客', color: 'text-lime-400', bgColor: 'bg-lime-900/20' },
  blog: { icon: Newspaper, label: '博客', color: 'text-amber-400', bgColor: 'bg-amber-900/20' },
  'code-review': { icon: Code2, label: '代码审查', color: 'text-emerald-400', bgColor: 'bg-emerald-900/20' },
  research: { icon: BookOpen, label: '研究', color: 'text-violet-400', bgColor: 'bg-violet-900/20' },
  design: { icon: Paintbrush, label: '设计', color: 'text-rose-400', bgColor: 'bg-rose-900/20' },
  practice: { icon: Terminal, label: '实践', color: 'text-fuchsia-400', bgColor: 'bg-fuchsia-900/20' }
}

export const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  bilibili: {
    icon: '🅱️',
    label: '哔哩哔哩',
    color: 'text-pink-400',
    domain: 'bilibili.com'
  },
  youtube: {
    icon: 'YT',
    label: 'YouTube',
    color: 'text-red-500',
    domain: 'youtube.com'
  },
  notion: {
    icon: 'N',
    label: 'Notion',
    color: 'text-gray-400',
    domain: 'notion.so'
  },
  github: {
    icon: 'GH',
    label: 'GitHub',
    color: 'text-gray-300',
    domain: 'github.com'
  },
  medium: {
    icon: 'M',
    label: 'Medium',
    color: 'text-gray-200',
    domain: 'medium.com'
  },
  twitter: {
    icon: '𝕏',
    label: 'Twitter',
    color: 'text-blue-400',
    domain: 'x.com'
  },
  reddit: {
    icon: 'R',
    label: 'Reddit',
    color: 'text-orange-500',
    domain: 'reddit.com'
  },
  discord: {
    icon: 'D',
    label: 'Discord',
    color: 'text-indigo-500',
    domain: 'discord.com'
  },
  coursera: {
    icon: 'C',
    label: 'Coursera',
    color: 'text-blue-600',
    domain: 'coursera.org'
  },
  udemy: {
    icon: 'U',
    label: 'Udemy',
    color: 'text-purple-600',
    domain: 'udemy.com'
  },
  edx: {
    icon: 'E',
    label: 'edX',
    color: 'text-green-600',
    domain: 'edx.org'
  },
  khanacademy: {
    icon: 'K',
    label: 'Khan Academy',
    color: 'text-teal-600',
    domain: 'khanacademy.org'
  },
  stackoverflow: {
    icon: 'S',
    label: 'Stack Overflow',
    color: 'text-orange-600',
    domain: 'stackoverflow.com'
  },
  leetcode: {
    icon: 'L',
    label: 'LeetCode',
    color: 'text-amber-600',
    domain: 'leetcode.com'
  },
  figma: {
    icon: 'F',
    label: 'Figma',
    color: 'text-purple-500',
    domain: 'figma.com'
  },
  other: {
    icon: '🌐',
    label: '其他平台',
    color: 'text-gray-500'
  }
}

// 基于内容自动推荐内容类型
export function autoDetectContentType(content: string): ContentType {
  const lowerContent = content.toLowerCase()

  if (/(视频|教程|youtube|b站|bilibili|直播|录播)/.test(lowerContent)) {
    return 'video'
  } else if (/(文章|博客|medium|知乎|公众号)/.test(lowerContent)) {
    return 'article'
  } else if (/(论文|学术|研究|期刊|conference)/.test(lowerContent)) {
    return 'paper'
  } else if (/(代码|编程|github|git|仓库|项目)/.test(lowerContent)) {
    return 'project'
  } else if (/(练习|刷题|leetcode|算法|编程题)/.test(lowerContent)) {
    return 'exercise'
  } else if (/(文档|readme|api|手册)/.test(lowerContent)) {
    return 'documentation'
  } else if (/(会议|讨论|开会|standup)/.test(lowerContent)) {
    return 'meeting'
  } else if (/(教程|新手|入门|guide)/.test(lowerContent)) {
    return 'tutorial'
  }

  return 'article'
}

// 基于内容自动推荐平台
export function autoDetectPlatform(content: string): Platform {
  const lowerContent = content.toLowerCase()

  if (/(b站|bilibili|哔哩哔哩)/.test(lowerContent)) {
    return 'bilibili'
  } else if (/(youtube|油管)/.test(lowerContent)) {
    return 'youtube'
  } else if (/(github|git|仓库)/.test(lowerContent)) {
    return 'github'
  } else if (/(notion|文档|笔记)/.test(lowerContent)) {
    return 'notion'
  } else if (/(medium|博客)/.test(lowerContent)) {
    return 'medium'
  } else if (/(coursera|课程)/.test(lowerContent)) {
    return 'coursera'
  } else if (/(leetcode|刷题)/.test(lowerContent)) {
    return 'leetcode'
  } else if (/(stackoverflow|stack)/.test(lowerContent)) {
    return 'stackoverflow'
  } else if (/(udemy|课程)/.test(lowerContent)) {
    return 'udemy'
  } else if (/(discord|讨论)/.test(lowerContent)) {
    return 'discord'
  } else if (/(twitter|推特)/.test(lowerContent)) {
    return 'twitter'
  } else if (/(reddit|社区)/.test(lowerContent)) {
    return 'reddit'
  }

  return 'other'
}

// 基于内容自动提取标签
export function autoExtractTags(content: string): string[] {
  const tags: Set<string> = new Set()
  const lowerContent = content.toLowerCase()

  // 技术相关
  const techKeywords = [
    'react', 'javascript', 'typescript', 'python', 'java', 'go',
    '前端', '后端', '全栈', '数据库', '算法', '数据结构',
    'html', 'css', 'nodejs', 'vue', 'angular', 'flutter',
    '人工智能', '机器学习', '深度学习', '大数据', '区块链',
    'docker', 'kubernetes', 'devops', '微服务', '云计算'
  ]

  techKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword.toLowerCase())) {
      tags.add(keyword)
    }
  })

  // 主题相关
  const topicKeywords = [
    '数学', '物理', '化学', '生物', '历史', '地理',
    '英语', '中文', '日语', '韩语', '法语', '德语',
    '经济学', '心理学', '哲学', '社会学', '政治学',
    '设计', '绘画', '音乐', '电影', '摄影', '写作',
    '健身', '运动', '瑜伽', '冥想', '营养', '健康'
  ]

  topicKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword.toLowerCase())) {
      tags.add(keyword)
    }
  })

  // 时间相关
  const now = new Date()
  const hour = now.getHours()
  if (hour < 12) tags.add('早晨')
  else if (hour < 17) tags.add('下午')
  else tags.add('晚上')

  // 持续时间相关
  if (content.length > 100) tags.add('深度阅读')
  if (content.includes('复习') || content.includes('review')) tags.add('复习')
  if (content.includes('预习') || content.includes('preview')) tags.add('预习')
  if (content.includes('项目') || content.includes('项目')) tags.add('项目实践')

  return Array.from(tags).slice(0, 5)
}

// 结构化处理内容
export function structureContent(content: string): {
  content: string
  bulletPoints: string[]
  summary?: string
} {
  const sentences = content.split(/[。！？.!?]/).filter(s => s.trim())

  const bulletPoints = sentences.slice(0, 3).map(sentence =>
    sentence.trim().replace(/^([•\-*]\s*)?/, '• ')
  )

  const summary = sentences.length > 3
    ? `${sentences[0]}...(${sentences.length}个要点)`
    : undefined

  return {
    content,
    bulletPoints,
    summary
  }
}

// 获取图标组件
export function getContentTypeIcon(type?: ContentType) {
  return type ? CONTENT_TYPE_CONFIG[type].icon : FileText
}

export function getPlatformIcon(platform?: Platform) {
  return platform ? PLATFORM_CONFIG[platform].icon : Globe
}