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
  /** 网站名称 */
  siteName?: string
  /** 网站描述 */
  siteDescription?: string
  /** 备案号 */
  icp?: string
  /** 公安备案号 */
  policeIcp?: string
  className?: string
}

export default function FrontLayout({
  showHeader = true,
  showFooter = true,
  siteName = import.meta.env.VITE_APP_TITLE || '知识库小破站',
  siteDescription = '分享知识，记录成长。一个专注于技术分享与学习的知识平台。',
  icp = import.meta.env.VITE_APP_ICP || '',
  policeIcp = import.meta.env.VITE_APP_POLICE_ICP || '',
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
      {showFooter && (
        <FrontFooter
          siteName={siteName}
          siteDescription={siteDescription}
          icp={icp}
          policeIcp={policeIcp}
        />
      )}
    </div>
  )
}
