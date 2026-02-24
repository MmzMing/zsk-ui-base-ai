/**
 * 后台管理顶部栏组件
 * 包含面包屑、搜索、通知、用户菜单等
 */

import { useState, useCallback, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Avatar,
  Badge,
  Divider,
  Kbd
} from '@heroui/react'
import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineCog,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineAdjustments,
  HiOutlineHome,
  HiOutlineChevronRight
} from 'react-icons/hi'
import { Search, Menu } from 'lucide-react'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useTheme } from '@/hooks/useTheme'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { ADMIN_MENUS, getSortedMenus } from '@/constants/menu'
import ThemeDrawer from './ThemeDrawer'
import { cn } from '@/utils'
import { SiteLogo } from '@/components/ui/SiteLogo'
import { AnimatedThemeToggle } from '@/components/ui/AnimatedThemeToggle'

// 面包屑项类型
interface BreadcrumbItem {
  label: string
  path?: string
}

// 顶部栏属性
interface AdminHeaderProps {
  /** 面包屑数据 */
  breadcrumbs?: BreadcrumbItem[]
  className?: string
}

export default function AdminHeader({ breadcrumbs = [], className }: AdminHeaderProps) {
  const navigate = useNavigate()
  const { userInfo, logout } = useUserStore()
  const { adminSettings } = useAppStore()
  const { themeMode, showBreadcrumb } = adminSettings
  const { setThemeMode } = useTheme()
  const { isMobile } = useBreakpoint()
  const [searchValue, setSearchValue] = useState('')
  const [themeDrawerOpen, setThemeDrawerOpen] = useState(false)
  const [logoHovered, setLogoHovered] = useState(false)

  // 切换主题
  const handleToggleTheme = useCallback(() => {
    const modes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(themeMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setThemeMode(modes[nextIndex])
  }, [themeMode, setThemeMode])

  // 处理搜索
  const handleSearch = useCallback((value: string) => {
    console.info('搜索：', value)
    // TODO: 实现搜索功能
  }, [])

  // 处理登出
  const handleLogout = useCallback(() => {
    logout()
    navigate('/login')
  }, [logout, navigate])

  // 获取主题图标
  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <HiOutlineSun className="text-lg" />
      case 'dark':
        return <HiOutlineMoon className="text-lg" />
      default:
        return <HiOutlineAdjustments className="text-lg" />
    }
  }

  // 获取排序后的菜单
  const sortedMenus = useMemo(() => getSortedMenus(ADMIN_MENUS), [])

  // 菜单项下拉列表
  const MenuDropdownContent = () => (
    <DropdownMenu 
      aria-label="后台管理导航菜单" 
      variant="flat"
      onAction={(key) => navigate(key as string)}
    >
      {sortedMenus.map((menu) => {
        if (menu.children && menu.children.length > 0) {
          return (
            <DropdownSection key={menu.key} title={menu.label} showDivider>
              {menu.children.map((child) => (
                <DropdownItem
                  key={child.path || child.key}
                  startContent={child.icon && <child.icon className="text-lg" />}
                >
                  {child.label}
                </DropdownItem>
              ))}
            </DropdownSection>
          )
        }
        return (
          <DropdownItem
            key={menu.path || menu.key}
            startContent={menu.icon && <menu.icon className="text-lg" />}
          >
            {menu.label}
          </DropdownItem>
        )
      })}
    </DropdownMenu>
  )

  // 用户下拉菜单内容
  const UserMenuContent = () => (
    <DropdownMenu aria-label="用户菜单" variant="flat">
      <DropdownItem
        key="profile"
        startContent={<HiOutlineUser className="text-lg" />}
        onPress={() => navigate('/admin/profile')}
      >
        个人中心
      </DropdownItem>
      <DropdownItem
        key="settings"
        startContent={<HiOutlineCog className="text-lg" />}
        onPress={() => navigate('/admin/system/general')}
      >
        系统设置
      </DropdownItem>
      <DropdownItem
        key="theme"
        startContent={<HiOutlineAdjustments className="text-lg" />}
        onPress={() => setThemeDrawerOpen(true)}
      >
        主题设置
      </DropdownItem>
      <DropdownItem
        key="theme-toggle"
        startContent={getThemeIcon()}
        onPress={handleToggleTheme}
      >
        切换主题 ({themeMode === 'system' ? '跟随系统' : themeMode === 'dark' ? '深色' : '浅色'})
      </DropdownItem>
      <DropdownItem key="divider" className="h-0 p-0">
        <Divider />
      </DropdownItem>
      <DropdownItem
        key="logout"
        color="danger"
        startContent={<HiOutlineLogout className="text-lg" />}
        onPress={handleLogout}
      >
        退出登录
      </DropdownItem>
    </DropdownMenu>
  )

  return (
    <>
      <AnimatePresence mode="wait">
        {isMobile ? (
          // 移动端：双容器布局（跟前台一样）
          <motion.header
            key="mobile-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn('sticky top-0 z-50 w-full py-3 px-4 flex justify-between items-center gap-4', className)}
          >
            {/* 左侧容器：Logo */}
            <motion.div
              initial={{ scale: 0.8, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-background/90 backdrop-blur-xl border border-divider/50 shadow-lg cursor-pointer"
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
            >
              <Link to="/admin/dashboard" className="flex items-center justify-center">
                <SiteLogo size="sm" />
              </Link>
              
              {/* 悬停展开的文字 */}
              <AnimatePresence>
                {logoHovered && (
                  <motion.span
                    initial={{ width: 0, opacity: 0, x: -10 }}
                    animate={{ width: 'auto', opacity: 1, x: 0 }}
                    exit={{ width: 0, opacity: 0, x: -10 }}
                    className="absolute left-full ml-2 overflow-hidden whitespace-nowrap text-sm font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent"
                  >
                    后台管理
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 右侧容器：工具栏 + 菜单 */}
            <motion.div
              initial={{ scale: 0.8, x: 20 }}
              animate={{ scale: 1, x: 0 }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-background/90 backdrop-blur-xl border border-divider/50 shadow-lg"
            >
              {/* 搜索按钮 */}
              <Button
                variant="light"
                isIconOnly
                size="sm"
                className="min-w-8 w-8 h-8 rounded-full"
                onPress={() => console.info('移动端搜索')}
              >
                <Search size={18} className="text-default-500" />
              </Button>

              {/* 主题切换 */}
              <AnimatedThemeToggle className="w-8 h-8 !min-w-8 rounded-full" />

              {/* 用户下拉框 */}
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button variant="light" isIconOnly size="sm" className="min-w-8 w-8 h-8 rounded-full">
                    <Avatar
                      name={userInfo?.name || '用户'}
                      size="sm"
                      className="w-7 h-7"
                    />
                  </Button>
                </DropdownTrigger>
                <UserMenuContent />
              </Dropdown>

              {/* 分隔线 */}
              <div className="w-px h-4 bg-divider/50 mx-0.5" />

              {/* 菜单下拉框 - 替换原有的侧边栏按钮 */}
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    variant="light"
                    isIconOnly
                    size="sm"
                    className="min-w-8 w-8 h-8 rounded-full"
                  >
                    <Menu size={20} className="text-default-500" />
                  </Button>
                </DropdownTrigger>
                <MenuDropdownContent />
              </Dropdown>
            </motion.div>
          </motion.header>
        ) : (
          // 桌面端：标准 Navbar
          <motion.div
            key="desktop-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Navbar
              className={cn('h-14 px-4 border-b border-divider bg-content1', className)}
              maxWidth="full"
            >
              {/* 左侧：移动端菜单按钮 + 面包屑 */}
              <NavbarContent justify="start" className="flex-1 gap-0 md:gap-2">
                {showBreadcrumb && breadcrumbs.length > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Button
                      variant="light"
                      size="sm"
                      isIconOnly
                      onPress={() => navigate('/admin/dashboard')}
                    >
                      <HiOutlineHome className="text-lg" />
                    </Button>
                    {breadcrumbs.map((item, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <HiOutlineChevronRight className="text-default-400 text-xs" />
                        {item.path ? (
                          <Button
                            variant="light"
                            size="sm"
                            className="h-6 min-w-0 px-2"
                            onPress={() => navigate(item.path!)}
                          >
                            {item.label}
                          </Button>
                        ) : (
                          <span className="text-default-foreground font-medium">{item.label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </NavbarContent>

              {/* 右侧：工具栏 */}
              <NavbarContent justify="end" className="gap-1">
                {/* 搜索框 */}
                <NavbarItem className="hidden lg:flex">
                  <Input
                    placeholder="搜索..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchValue)}
                    startContent={<HiOutlineSearch className="text-default-400" />}
                    endContent={
                      <Kbd className="hidden lg:inline-flex" keys={['command']}>
                        K
                      </Kbd>
                    }
                    size="sm"
                    variant="flat"
                    className="w-56"
                    classNames={{
                      input: 'text-sm',
                      inputWrapper: 'bg-default-100'
                    }}
                  />
                </NavbarItem>

                {/* 通知 */}
                <NavbarItem>
                  <Badge content="3" size="sm" color="danger">
                    <Button variant="light" isIconOnly className="text-default-500">
                      <HiOutlineBell className="text-lg" />
                    </Button>
                  </Badge>
                </NavbarItem>

                {/* 设置按钮 */}
                <NavbarItem>
                  <Button
                    variant="light"
                    isIconOnly
                    onPress={() => setThemeDrawerOpen(true)}
                    className="text-default-500"
                  >
                    <HiOutlineCog className="text-lg" />
                  </Button>
                </NavbarItem>

                <Divider orientation="vertical" className="h-6 mx-1" />

                {/* 用户菜单 */}
                <NavbarItem>
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <Button variant="light" className="gap-2 px-2">
                        <Avatar
                          name={userInfo?.name || '用户'}
                          size="sm"
                          className="cursor-pointer"
                        />
                        <span className="hidden sm:inline text-sm">{userInfo?.name || '用户'}</span>
                      </Button>
                    </DropdownTrigger>
                    <UserMenuContent />
                  </Dropdown>
                </NavbarItem>
              </NavbarContent>
            </Navbar>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主题设置抽屉 */}
      <ThemeDrawer
        isOpen={themeDrawerOpen}
        onClose={() => setThemeDrawerOpen(false)}
      />
    </>
  )
}
