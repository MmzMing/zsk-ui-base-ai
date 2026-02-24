/**
 * 前台顶部导航栏组件
 * 使用 Aceternity UI 风格的滑动导航效果
 * 支持 Logo 悬停展开和滚动分裂收缩动效
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
import { SiteLogo } from '@/components/ui/SiteLogo'
import { useScrollPosition } from '@/hooks'

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

// 收缩状态的图标导航项
interface CollapsedNavItemProps {
  item: NavItem
  isActive: boolean
  onClick: () => void
}

function CollapsedNavItem({ item, isActive, onClick }: CollapsedNavItemProps) {
  const Icon = item.icon
  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center w-8 h-8 rounded-full transition-colors',
        isActive
          ? 'bg-primary/20 text-primary'
          : 'text-default-600 hover:bg-default-200/50 hover:text-default-900'
      )}
      title={item.label}
    >
      {Icon && <Icon className="text-base" />}
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
  /** 滚动收缩阈值（像素） */
  scrollThreshold?: number
  className?: string
}

export default function FrontHeader({
  navItems = NAV_ITEMS,
  logoText = '知识库小破站',
  showSearch = true,
  scrollThreshold = 80,
  className
}: FrontHeaderProps) {
  const location = useLocation()
  const navRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoHovered, setLogoHovered] = useState(false)

  // 滚动监听
  const { isScrolled } = useScrollPosition({ threshold: scrollThreshold })

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
    if (!navRef.current || isScrolled) return

    const navButtons = navRef.current.querySelectorAll('a')
    const targetButton = navButtons[index]

    if (targetButton) {
      const navRect = navRef.current.getBoundingClientRect()
      const btnRect = targetButton.getBoundingClientRect()
      setIndicatorStyle({
        left: btnRect.left - navRect.left - 6,
        width: btnRect.width + 12
      })
    }
  }, [isScrolled])

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
        'sticky top-0 z-50 w-full',
        isScrolled ? 'py-2 px-4' : '',
        'transition-all duration-300',
        className
      )}
    >
      {/* 展开状态 - 单一容器 */}
      <AnimatePresence mode="wait">
        {!isScrolled ? (
          <motion.div
            key="expanded-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full border-b border-divider bg-background/80 backdrop-blur-md"
          >
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                {/* 左侧 Logo 区域 - 使用固定宽度避免影响中间 */}
                <div className="w-[200px] flex-shrink-0">
                  <Link
                    to="/"
                    className="relative flex items-center gap-2 text-xl font-bold text-default-900"
                    onMouseEnter={() => setLogoHovered(true)}
                    onMouseLeave={() => setLogoHovered(false)}
                  >
                    <SiteLogo size="md" className="flex-shrink-0" />

                    {/* 悬停展开的文字 - 绝对定位不影响布局 */}
                    <AnimatePresence>
                      {logoHovered && (
                        <motion.span
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 'auto', opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="overflow-hidden whitespace-nowrap bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent"
                        >
                          {logoText}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </div>

                {/* 中间导航区域 - 居中固定 */}
                <nav
                  ref={navRef}
                  className="flex-1 flex justify-center items-center relative"
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

                {/* 右侧工具栏 - 固定宽度 */}
                <div className="w-[200px] flex-shrink-0 flex justify-end items-center gap-2">
                  {showSearch && (
                    <Button variant="light" isIconOnly>
                      <HiOutlineSearch className="text-lg" />
                    </Button>
                  )}

                  <AnimatedThemeToggle />

                  <Button variant="light" size="sm" as={Link} to="/login">
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
          </motion.div>
        ) : (
          // 收缩状态 - 分裂成两个椭圆容器
          <motion.div
            key="collapsed-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-center px-4"
          >
            {/* 左侧圆形容器 - Logo */}
            <motion.div
              initial={{ scale: 0.8, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-background/90 backdrop-blur-xl border border-divider/50 shadow-lg"
            >
              <Link to="/" className="flex items-center justify-center">
                <SiteLogo size="sm" />
              </Link>
            </motion.div>

            {/* 右侧椭圆形容器 - 导航 + 工具栏 */}
            <motion.div
              initial={{ scale: 0.8, x: 20 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-xl border border-divider/50 shadow-lg"
            >
              {/* 导航图标 */}
              <div className="hidden md:flex items-center gap-0.5 mr-1">
                {navItems.map((item, index) => (
                  <CollapsedNavItem
                    key={item.href}
                    item={item}
                    isActive={activeIndex === index}
                    onClick={() => handleNavClick(index)}
                  />
                ))}
              </div>

              {/* 分隔线 */}
              <div className="hidden md:block w-px h-5 bg-divider/50 mx-1" />

              {/* 工具栏 */}
              <div className="flex items-center gap-0.5">
                {showSearch && (
                  <Button
                    variant="light"
                    isIconOnly
                    size="sm"
                    className="min-w-8 w-8 h-8 rounded-full"
                  >
                    <HiOutlineSearch className="text-base" />
                  </Button>
                )}

                <AnimatedThemeToggle className="w-8 h-8 !min-w-8 rounded-full" />

                {/* 移动端菜单按钮 */}
                <Button
                  variant="light"
                  isIconOnly
                  size="sm"
                  className="md:hidden min-w-8 w-8 h-8 rounded-full"
                  onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <HiOutlineX className="text-base" />
                  ) : (
                    <HiOutlineMenu className="text-base" />
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'md:hidden border-t border-divider bg-background/95 backdrop-blur-xl',
              isScrolled ? 'mt-2 rounded-2xl shadow-lg mx-4' : ''
            )}
          >
            <nav className={cn('container mx-auto', isScrolled ? 'p-4' : 'px-4 py-4')}>
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
