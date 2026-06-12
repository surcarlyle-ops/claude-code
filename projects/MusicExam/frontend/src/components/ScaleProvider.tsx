import { createContext, useContext, type ReactNode } from 'react'

interface ScaleContextValue {
  /** 当前缩放比，用于动态计算（如 Canvas 等无法用 CSS 控制的场景） */
  scale: number
}

const ScaleContext = createContext<ScaleContextValue>({ scale: 1 })

export function useScale() {
  return useContext(ScaleContext)
}

/**
 * ScaleProvider — 全局缩放上下文。
 *
 * 核心策略是通过 CSS 变量 + 响应式断点实现弹性布局，而非 scale() 变换。
 * - 容器宽度：`--container-max` 在 xl/2xl/3xl 断点逐步增大
 * - 在超大屏（>1920px）整体等比缩放通过 CSS clamp() 完成
 * - useScale() 提供 JS 侧动态值供 Canvas 等组件使用
 */
export default function ScaleProvider({ children }: { children: ReactNode }) {
  return (
    <ScaleContext.Provider value={{ scale: 1 }}>
      {children}
    </ScaleContext.Provider>
  )
}