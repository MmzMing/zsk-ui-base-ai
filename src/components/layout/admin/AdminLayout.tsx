/**
 * 后台管理布局组件
 * T形布局：左侧侧边栏 + 顶部顶栏 + 右侧内容区
 */

import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollShadow } from '@heroui/react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import MultiTabs from './MultiTabs'
import { useAppStore, type PageTransition } from '@/stores/app'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { cn } from '@/utils'
import ClickSpark from '@/components/ui/reactbits/ClickSpark'

// 页面切换动画类型
interface TransitionVariant {
  initial?: { opacity?: number; x?: number; y?: number; scale?: number }
  animate?: { opacity?: number; x?: number; y?: number; scale?: number }
  exit?: { opacity?: number; x?: number; y?: number; scale?: number }
}
// 页面切换动画配置
const pageTransitionVariants: Record<PageTransition, TransitionVariant> = {
  none: {},
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  },
  layered: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  }
}

// 布局属性
interface AdminLayoutProps {
  className?: string
}

export default function AdminLayout({ className }: AdminLayoutProps) {
  const location = useLocation()
  const {
    showHeader,
    clickEffect,
    contentPadding,
    pageTransition,
    allowTextSelection,
    colorWeak,
    multiTab
  } = useAppStore()

  // 根据路径生成面包屑
  const breadcrumbs = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    if (pathSegments.length <= 1) return []

    // 简单的面包屑生成逻辑
    return pathSegments.slice(1).map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: index === pathSegments.length - 2 ? undefined : `/${pathSegments.slice(0, index + 2).join('/')}`
    }))
  }, [location.pathname])

  // 处理色弱模式
  useEffect(() => {
    if (colorWeak) {
      document.documentElement.style.filter = 'grayscale(80%)'
    } else {
      document.documentElement.style.filter = ''
    }
    return () => {
      document.documentElement.style.filter = ''
    }
  }, [colorWeak])

  // 处理文字选择
  useEffect(() => {
    if (!allowTextSelection) {
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.userSelect = ''
    }
    return () => {
      document.body.style.userSelect = ''
    }
  }, [allowTextSelection])

  // 获取当前动画配置
  const currentTransition = pageTransitionVariants[pageTransition]
  const { isMobile } = useBreakpoint()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // 内容区域
  const content = (
    <div 
        data-admin-layout
        className={cn('flex h-screen overflow-hidden bg-background', className)}>
      {/* 侧边栏 - 桌面端显示，移动端隐藏 */}
      <div className={isMobile ? 'hidden md:block' : 'block'}>
        <AdminSidebar />
      </div>
      {/* 移动端侧边栏遮罩 */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* 移动端侧边栏抽屉 */}
      {isMobile && (
        <div
          className={cn(
            'fixed left-0 top-0 bottom-0 z-50 w-64 transition-transform duration-300',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <AdminSidebar />
        </div>
      )}

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 */}
        {showHeader && (
          <AdminHeader 
            breadcrumbs={breadcrumbs} 
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            showMobileMenuButton={isMobile}
          />
        )}

        {/* 多标签页 */}
        {multiTab && <MultiTabs />}

        {/* 内容区域 */}
        <ScrollShadow className="flex-1">
          <main
            className="p-4 md:p-6"
            style={{ padding: contentPadding }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={pageTransition !== 'none' ? currentTransition.initial : undefined}
                animate={pageTransition !== 'none' ? currentTransition.animate : undefined}
                exit={pageTransition !== 'none' ? currentTransition.exit : undefined}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </ScrollShadow>
      </div>
    </div>
  )

  // 如果启用点击火花效果，包装组件
  if (clickEffect) {
    return (
      <ClickSpark
        sparkColor="#537BF9"
        sparkCount={8}
        sparkSize={10}
        duration={400}
      >
        {content}
      </ClickSpark>
    )
  }

  return content
}
