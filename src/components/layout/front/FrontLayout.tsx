/**
 * 前台页面布局组件
 * 包含 Header、Footer 和内容区域
 */

import { Outlet } from 'react-router-dom'
import { ScrollShadow } from '@heroui/react'
import FrontHeader from './FrontHeader'
import FrontFooter from './FrontFooter'
import { cn } from '@/utils'

// 前台布局属性
interface FrontLayoutProps {
  /** 是否显示 Header */
  showHeader?: boolean
  /** 是否显示 Footer */
  showFooter?: boolean
  className?: string
}

export default function FrontLayout({
  showHeader = true,
  showFooter = true,
  className
}: FrontLayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col bg-background', className)}>
      {/* 顶部导航 */}
      {showHeader && <FrontHeader />}

      {/* 主内容区域 */}
      <ScrollShadow className="flex-1">
        <main className="flex-1">
          <Outlet />
        </main>
      </ScrollShadow>

      {/* 底部 */}
      {showFooter && <FrontFooter />}
    </div>
  )
}
