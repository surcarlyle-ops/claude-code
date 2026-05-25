import { useState, useMemo } from 'react'
import { StudyRecord } from '../types'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  Tags, Hash, Video, FileText, BookOpen, Globe, Youtube,
  Github, MessageSquare, FileCode, Award, Zap, Clock,
  Calendar, TrendingUp, Sparkles, Plus, Save, X, Check,
  Book, LucideIcon
} from 'lucide-react'

import {
  autoDetectContentType, autoDetectPlatform, autoExtractTags,
  structureContent, getContentTypeIcon, getPlatformIcon,
  CONTENT_TYPE_CONFIG, PLATFORM_CONFIG, type ContentType, type Platform
} from '../utils/contentTypeIcons'

interface SidebarRecordProps {
  onRecordAdded: (record: StudyRecord) => void
  records: StudyRecord[]
}

const SidebarRecord: React.FC<SidebarRecordProps> = ({ onRecordAdded, records }) => {
  const [content, setContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [feeling, setFeeling] = useState<StudyRecord['feeling']>('focused')
  const [contentType, setContentType] = useState<ContentType>('article')
  const [platform, setPlatform] = useState<Platform>('other')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // 结构化内容
  const structuredContent = useMemo(() => structureContent(content), [content])

  // 常用的标签建议 - 现代分类
  const tagCategories = {
    技术: ['React', 'TypeScript', 'Python', 'AI', 'DevOps', '云原生', '区块链', '前端', '后端', '全栈'],
    学科: ['数学', '物理', '化学', '生物', '英语', '历史', '哲学', '经济学', '心理学'],
    技能: ['设计', '写作', '演讲', '沟通', '领导力', '项目管理', '数据分析', '机器学习'],
    时间: ['早晨', '下午', '晚上', '深夜', '周末', '假期', '工作日'],
    类型: ['复习', '预习', '实践', '理论', '深度阅读', '快速浏览', '小组学习', '独自学习']
  }

  const allTagSuggestions = Object.values(tagCategories).flat()

  const getFeelingEmoji = (feeling: StudyRecord['feeling']): string => {
    const emojis = {
      focused: '💪',
      confused: '🤔',
      excited: '🎉',
      tired: '😴',
      breakthrough: '💡',
      neutral: '😊'
    }
    return emojis[feeling]
  }

  // 自动检测内容类型和平台
  const autoDetectSettings = () => {
    if (!content.trim()) return

    const detectedType = autoDetectContentType(content)
    const detectedPlatform = autoDetectPlatform(content)
    const autoTags = autoExtractTags(content)

    setContentType(detectedType)
    setPlatform(detectedPlatform)

    // 合并自动标签
    const manualTags = tagsInput.split(/[,，\s]+/).filter(t => t.trim())
    const allTags = [...new Set([...manualTags, ...autoTags])]
    setTagsInput(allTags.slice(0, 5).join(', '))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    // 处理标签：从输入框解析
    const tags = tagsInput.split(/[,，\s]+/).filter(tag => tag.trim())

    // 自动添加时间相关标签
    const now = new Date()
    const hour = now.getHours()
    if (hour < 12) tags.push('早晨')
    else if (hour < 17) tags.push('下午')
    else tags.push('晚上')

    // 添加星期标签
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    tags.push(days[now.getDay()])

    const newRecord: StudyRecord = {
      id: Date.now().toString(),
      content: content.trim(),
      tags: [...new Set(tags)], // 去重
      durationMinutes: 0, // 非计时记录的时长设为0
      feeling,
      contentType,
      platform,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onRecordAdded(newRecord)

    // 重置表单
    setContent('')
    setTagsInput('')
    setFeeling('focused')
    setContentType('article')
    setPlatform('other')

    // 显示成功消息
    showMessage('🎯 学习记录已保存到时间线', 'success')
  }

  const showMessage = (text: string, type: 'success' | 'warning' | 'info') => {
    const colors = {
      success: 'bg-green-900/30 text-green-300 border-green-800/50',
      warning: 'bg-amber-900/30 text-amber-300 border-amber-800/50',
      info: 'bg-blue-900/30 text-blue-300 border-blue-800/50'
    }

    const message = document.createElement('div')
    message.className = `fixed bottom-6 right-6 px-4 py-3 rounded-xl backdrop-blur-lg border ${colors[type]} shadow-2xl shadow-black/50 z-50 fade-in slide-up`
    message.textContent = text
    document.body.appendChild(message)

    setTimeout(() => {
      message.classList.add('animate-out', 'fade-out')
      setTimeout(() => message.remove(), 300)
    }, 2000)
  }

  const handleTagClick = (tag: string) => {
    const currentTags = tagsInput.split(/[,，\s]+/).filter(t => t.trim())
    if (currentTags.includes(tag)) {
      // 如果已存在就删除
      setTagsInput(currentTags.filter(t => t !== tag).join(', '))
    } else {
      // 如果不存在就添加
      setTagsInput([...currentTags, tag].join(', '))
    }
  }

  const ContentTypeIcon = getContentTypeIcon(contentType)
  const contentTypeConfig = CONTENT_TYPE_CONFIG[contentType]
  const platformConfig = PLATFORM_CONFIG[platform]

  return (
    <aside className="sidebar w-80 p-6 space-y-6 hidden lg:block">
      {/* 快速记录表单 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-700 to-secondary-600 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                学习速递
              </h2>
            </div>
            <p className="text-sm text-gray-400">
              {format(new Date(), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
            </p>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="btn-ghost text-xs px-3 py-1.5"
          >
            {showAdvanced ? '← 简化' : '高级选项 →'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 智能助手提示 */}
          <div className="surface p-4 rounded-xl border border-primary-500/20 bg-gradient-to-br from-primary-900/10 to-transparent">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-secondary-400" />
              <span className="text-sm font-medium text-gray-300">智能助手</span>
              <span className="text-xs text-gray-500">自动识别内容类型和关键词</span>
            </div>
            <button
              type="button"
              onClick={autoDetectSettings}
              disabled={!content.trim()}
              className="chip w-full justify-center text-sm"
            >
              <Brain className="w-4 h-4 mr-2" />
              智能分析内容
            </button>
          </div>

          {/* 内容输入区 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-300">
                今天学到了什么？
              </label>
              {content.length > 0 && structuredContent.bulletPoints.length > 0 && (
                <span className="text-xs text-gray-500">
                  {structuredContent.bulletPoints.length}个要点
                </span>
              )}
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享一下今天的学习内容、心得或遇到的问题，系统会帮你自动整理..."
              className="input-primary w-full h-40 resize-none"
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-500">
                {content.length}/500
              </div>
              {content.length > 50 && (
                <div className="text-xs text-primary-400 flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>可识别</span>
                </div>
              )}
            </div>
          </div>

          {/* 结构化小圆点预览 */}
          {structuredContent.bulletPoints.length > 0 && (
            <div className="surface-light p-4 rounded-xl">
              <div className="flex items-center space-x-2 mb-3">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">关键要点</span>
              </div>
              <div className="space-y-2">
                {structuredContent.bulletPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-700 to-secondary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-400 flex-1">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 内容类型选择 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-300 flex items-center space-x-2">
                <Video className="w-4 h-4" />
                <span>内容类型</span>
              </label>
              <div className={`${contentTypeConfig.bgColor} px-2 py-1 rounded-full border ${contentTypeConfig.color.replace('text-', 'border-')}/30`}>
                <span className={`text-xs ${contentTypeConfig.color}`}>{contentTypeConfig.label}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {Object.entries(CONTENT_TYPE_CONFIG).slice(0, 8).map(([type, config]) => {
                const Icon = config.icon
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setContentType(type as ContentType)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                      contentType === type
                        ? `${config.bgColor} border ${config.color.replace('text-', 'border-')}/50 scale-105`
                        : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${contentType === type ? config.color : 'text-gray-500'}`} />
                    <span className={`text-xs ${contentType === type ? 'text-gray-200' : 'text-gray-500'}`}>
                      {config.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 平台选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>学习平台</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {Object.entries(PLATFORM_CONFIG).slice(0, 6).map(([plat, config]) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => setPlatform(plat as Platform)}
                  className={`flex items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
                    platform === plat
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span className="text-sm mr-2">
                    {typeof config.icon === 'string' ? config.icon : config.icon}
                  </span>
                  <span className="text-xs">{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 感觉选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              学习时的感受
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['focused', 'confused', 'excited', 'tired', 'breakthrough', 'neutral'] as const).map((feelingOption) => (
                <button
                  key={feelingOption}
                  type="button"
                  onClick={() => setFeeling(feelingOption)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                    feeling === feelingOption
                      ? 'bg-primary-900/20 border-primary-500/50 scale-105'
                      : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  <span className="text-2xl mb-1">{getFeelingEmoji(feelingOption)}</span>
                  <span className={`text-xs ${
                    feeling === feelingOption ? 'text-primary-300' : 'text-gray-400'
                  }`}>
                    {feelingOption === 'focused' ? '专注' :
                     feelingOption === 'confused' ? '困惑' :
                     feelingOption === 'excited' ? '兴奋' :
                     feelingOption === 'tired' ? '疲惫' :
                     feelingOption === 'breakthrough' ? '突破' : '平常'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 标签系统 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-300 flex items-center space-x-2">
                <Tags className="w-4 h-4" />
                <span>标签</span>
              </label>
              <div className="text-xs text-gray-500">
                {tagsInput.split(/[,，\s]+/).filter(t => t.trim()).length}个标签
              </div>
            </div>

            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="输入标签，用逗号、空格或回车分隔"
              className="input-primary w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const tag = (e.target as HTMLInputElement).value.trim()
                  if (tag) {
                    const tags = tagsInput.split(/[,，\s]+/).filter(t => t.trim())
                    if (!tags.includes(tag)) {
                      setTagsInput([...tags, tag].join(', '))
                    }
                    ;(e.target as HTMLInputElement).value = ''
                  }
                }
              }}
            />

            {/* 标签类别选择 */}
            <div className="mt-4 space-y-3">
              {Object.entries(tagCategories).map(([category, tags]) => (
                <div key={category}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Hash className="w-3 h-3 text-gray-500" />
                    <span className="text-xs font-medium text-gray-400">{category}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className={`px-2 py-1 text-xs rounded-full transition-all ${
                          tagsInput.split(/[,，\s]+/).includes(tag)
                            ? 'bg-gradient-to-r from-primary-700 to-secondary-600 text-white border border-primary-500/50'
                            : 'chip hover:bg-gray-700 hover:text-gray-300'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={!content.trim()}
            className="btn-primary w-full py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform duration-200"
          >
            <div className="flex items-center justify-center space-x-2">
              <Save className="w-5 h-5" />
              <span>完成记录</span>
            </div>
          </button>
        </form>
      </div>

      {/* 最近记录 */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-secondary-700 to-secondary-600 rounded-xl">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">最近的学习</h3>
              <p className="text-xs text-gray-400">最近的{Math.min(records.length, 5)}条记录</p>
            </div>
          </div>
          <div className="text-xs px-3 py-1 bg-gray-800 text-gray-400 rounded-full">
            时间线
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {records.length === 0 ? (
            <div className="surface p-8 text-center rounded-xl">
              <div className="text-4xl mb-4 opacity-30">📝</div>
              <p className="text-gray-400 mb-2">还没有学习记录</p>
              <p className="text-sm text-gray-500">开始你的第一笔记录吧！</p>
            </div>
          ) : (
            records.slice(0, 5).map((record) => {
              const recordContentType = record.contentType || 'article'
              const contentTypeConfig = CONTENT_TYPE_CONFIG[recordContentType]
              const Icon = contentTypeConfig.icon

              return (
                <div
                  key={record.id}
                  className="surface p-4 rounded-xl hover:border-primary-500/30 transition-all duration-300 group"
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${contentTypeConfig.bgColor}`}>
                      <Icon className={`w-5 h-5 ${contentTypeConfig.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">
                          {format(new Date(record.createdAt), 'HH:mm')}
                        </span>
                        {record.durationMinutes > 0 && (
                          <span className="text-xs px-2 py-0.5 bg-secondary-900/30 text-secondary-400 rounded-full border border-secondary-800/30">
                            {record.durationMinutes}分钟
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${contentTypeConfig.color}`}>
                          {contentTypeConfig.label}
                        </span>
                        {record.platform && (
                          <span className="text-xs text-gray-500">
                            via {PLATFORM_CONFIG[record.platform].label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm line-clamp-3 mb-3 group-hover:text-gray-200 transition-colors">
                    {record.content}
                  </p>

                  {record.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {record.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="tag-badge"
                        >
                          {tag}
                        </span>
                      ))}
                      {record.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-800 text-gray-500 rounded-full border border-gray-700">
                          +{record.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getFeelingEmoji(record.feeling)}</span>
                      <span className="text-xs text-gray-500 capitalize">
                        {record.feeling === 'focused' ? '专注' :
                         record.feeling === 'confused' ? '困惑' :
                         record.feeling === 'excited' ? '兴奋' :
                         record.feeling === 'tired' ? '疲惫' :
                         record.feeling === 'breakthrough' ? '突破' : '平常'}
                      </span>
                    </div>
                    <button className="text-xs text-gray-500 hover:text-gray-400">
                      查看详情 →
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* 使用提示 */}
      <div className="surface p-4 rounded-xl border border-secondary-500/20">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-gradient-to-br from-accent-700 to-accent-600 rounded-xl">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">使用指导</h4>
            <p className="text-xs text-gray-400">高效记录，获得更多洞察</p>
          </div>
        </div>

        <div className="space-y-2">
          <TipItem
            emoji="🤖"
            title="AI智能识别"
            description="系统自动分析内容类型、平台和关键词"
          />
          <TipItem
            emoji="🎯"
            title="结构化整理"
            description="自动生成关键要点，帮助回顾重点"
          />
          <TipItem
            emoji="🏷️"
            title="智能标签"
            description="智能建议相关标签，方便分类检索"
          />
          <TipItem
            emoji="📊"
            title="可视化分析"
            description="数据自动汇总到热力图和统计面板"
          />
        </div>
      </div>
    </aside>
  )
}

// 辅助组件：提示项目
const TipItem: React.FC<{
  emoji: string
  title: string
  description: string
}> = ({ emoji, title, description }) => (
  <div className="flex items-start space-x-3">
    <span className="text-lg">{emoji}</span>
    <div>
      <div className="text-sm font-medium text-gray-300">{title}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  </div>
)

export default SidebarRecord