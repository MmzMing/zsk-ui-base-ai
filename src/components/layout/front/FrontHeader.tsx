/**
 * 前台顶部导航栏组件
 * 使用 Aceternity UI 风格的滑动导航效果
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@heroui/react'
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineTag,
  HiOutlineUser
} from 'react-icons/hi'
import { cn } from '@/utils'
import { AnimatedThemeToggle } from '@/components/ui/AnimatedThemeToggle'

// 导航项类型
interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

// 默认导航配置
const NAV_ITEMS: NavItem[] = [
  { label: '首页', href: '/', icon: HiOutlineHome },
  { label: '文章', href: '/articles', icon: HiOutlineDocumentText },
  { label: '分类', href: '/categories', icon: HiOutlineTag },
  { label: '关于', href: '/about', icon: HiOutlineUser }
]

// 滑动高亮导航项
interface SlidingNavItemProps {
  item: NavItem
  isActive: boolean
  onClick: () => void
}

function SlidingNavItem({ item, isActive, onClick }: SlidingNavItemProps) {
  const Icon = item.icon
  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors',
        isActive ? 'text-primary' : 'text-default-600 hover:text-default-900'
      )}
    >
      {Icon && <Icon className="text-base" />}
      {item.label}
    </Link>
  )
}

// 前台头部属性
interface FrontHeaderProps {
  /** 自定义导航项 */
  navItems?: NavItem[]
  /** Logo 文字 */
  logoText?: string
  /** 是否显示搜索按钮 */
  showSearch?: boolean
  className?: string
}

export default function FrontHeader({
  navItems = NAV_ITEMS,
  logoText = '知识库小破站',
  showSearch = true,
  className
}: FrontHeaderProps) {
  const location = useLocation()
  const navRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 根据路径获取激活索引
  const getActiveIndex = useCallback(() => {
    const currentPath = location.pathname
    const index = navItems.findIndex(item => {
      if (item.href === '/') return currentPath === '/'
      return currentPath.startsWith(item.href)
    })
    return index >= 0 ? index : 0
  }, [location.pathname, navItems])

  // 更新指示器位置
  const updateIndicator = useCallback((index: number) => {
    if (!navRef.current) return

    const navButtons = navRef.current.querySelectorAll('a')
    const targetButton = navButtons[index]

    if (targetButton) {
      const navRect = navRef.current.getBoundingClientRect()
      const btnRect = targetButton.getBoundingClientRect()
      // 调整指示器位置，增加边距使其比文字稍长
      setIndicatorStyle({
        left: btnRect.left - navRect.left - 6,
        width: btnRect.width + 12
      })
    }
  }, [])

  // 初始化和路径变化时更新
  useEffect(() => {
    const index = getActiveIndex()
    setActiveIndex(index)
    updateIndicator(index)
  }, [getActiveIndex, updateIndicator])

  // 悬停时更新指示器
  useEffect(() => {
    if (hoverIndex !== null) {
      updateIndicator(hoverIndex)
    } else {
      updateIndicator(activeIndex)
    }
  }, [hoverIndex, activeIndex, updateIndicator])

  // 处理导航点击
  const handleNavClick = (index: number) => {
    setActiveIndex(index)
    setMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-divider bg-background/80 backdrop-blur-md',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-default-900"
          >
            <span className="text-default-900">
              {logoText}
            </span>
          </Link>

          {/* 桌面端导航 */}
          <nav
            ref={navRef}
            className="hidden md:relative md:flex md:items-center"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* 滑动指示器 */}
            <motion.div
              className="absolute -bottom-1 h-0.5 bg-primary rounded-full"
              initial={false}
              animate={{
                left: indicatorStyle.left,
                width: indicatorStyle.width
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />

            {/* 导航项 */}
            {navItems.map((item, index) => (
              <div
                key={item.href}
                onMouseEnter={() => setHoverIndex(index)}
              >
                <SlidingNavItem
                  item={item}
                  isActive={activeIndex === index}
                  onClick={() => handleNavClick(index)}
                />
              </div>
            ))}
          </nav>

          {/* 右侧工具栏 */}
          <div className="flex items-center gap-2">
            {/* 搜索按钮 */}
            {showSearch && (
              <Button
                variant="light"
                isIconOnly
                className="hidden md:flex"
              >
                <HiOutlineSearch className="text-lg" />
              </Button>
            )}

            {/* 主题切换按钮 */}
            <AnimatedThemeToggle className="hidden md:flex" />

            {/* 登录按钮 */}
            <Button
              variant="light"
              size="sm"
              as={Link}
              to="/login"
              className="hidden md:flex"
            >
              登录
            </Button>

            {/* 移动端菜单按钮 */}
            <Button
              variant="light"
              isIconOnly
              className="md:hidden"
              onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <HiOutlineX className="text-xl" />
              ) : (
                <HiOutlineMenu className="text-xl" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-divider bg-background"
          >
            <nav className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => handleNavClick(index)}
                      className={cn(
                        'px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                        activeIndex === index
                          ? 'bg-primary/10 text-primary'
                          : 'text-default-600 hover:bg-default-100'
                      )}
                    >
                      {Icon && <Icon className="text-base" />}
                      {item.label}
                    </Link>
                  )
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-divider">
                <Button
                  variant="flat"
                  fullWidth
                  as={Link}
                  to="/login"
                  onPress={() => setMobileMenuOpen(false)}
                >
                  登录
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
