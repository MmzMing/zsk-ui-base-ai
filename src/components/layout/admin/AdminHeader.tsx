/**
 * 后台管理顶部栏组件
 * 包含面包屑、搜索、通知、用户菜单等
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Avatar,
  Badge,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent
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
  HiOutlineChevronRight,
  HiOutlineMenuAlt2
} from 'react-icons/hi'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useTheme } from '@/hooks/useTheme'
import ThemeDrawer from './ThemeDrawer'
import { cn } from '@/utils'

// 面包屑项类型
interface BreadcrumbItem {
  label: string
  path?: string
}

// 顶部栏属性
interface AdminHeaderProps {
  /** 面包屑数据 */
  breadcrumbs?: BreadcrumbItem[]
  /** 移动端菜单切换回调 */
  onMenuToggle?: () => void
  /** 是否显示移动端菜单按钮 */
  showMobileMenuButton?: boolean
  className?: string
}

export default function AdminHeader({ breadcrumbs = [], onMenuToggle, showMobileMenuButton, className }: AdminHeaderProps) {
  const navigate = useNavigate()
  const { userInfo, logout } = useUserStore()
  const { themeMode, showBreadcrumb, clickEffect } = useAppStore()
  const { setThemeMode } = useTheme()
  const [searchValue, setSearchValue] = useState('')
  const [themeDrawerOpen, setThemeDrawerOpen] = useState(false)

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

  return (
    <>
      <Navbar
        className={cn('h-14 px-4 border-b border-divider bg-content1', className)}
        maxWidth="full"
      >
        {/* 左侧：移动端菜单按钮 + 面包屑 */}
        <NavbarContent justify="start" className="flex-1 gap-0 md:gap-2">
          {/* 移动端菜单按钮 */}
          {showMobileMenuButton && (
            <NavbarItem className="md:hidden">
              <Button
                variant="light"
                isIconOnly
                onPress={onMenuToggle}
                className="text-default-500"
              >
                <HiOutlineMenuAlt2 className="text-lg" />
              </Button>
            </NavbarItem>
          )}
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
              size="sm"
              variant="flat"
              className="w-48"
              classNames={{
                input: 'text-sm',
                inputWrapper: 'bg-default-100'
              }}
            />
          </NavbarItem>

          {/* 主题切换 */}
          <NavbarItem>
            <Button
              variant="light"
              isIconOnly
              onPress={handleToggleTheme}
              className="text-default-500"
            >
              {getThemeIcon()}
            </Button>
          </NavbarItem>

          {/* 点击火花效果开关 */}
          <NavbarItem>
            <Popover placement="bottom">
              <PopoverTrigger>
                <Button
                  variant={clickEffect ? 'flat' : 'light'}
                  color={clickEffect ? 'primary' : 'default'}
                  isIconOnly
                  className="text-default-500"
                >
                  ✨
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-4 py-2">
                  <p className="text-sm font-medium">点击火花效果</p>
                  <p className="text-xs text-default-500 mt-1">
                    {clickEffect ? '已开启' : '已关闭'}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
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
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* 主题设置抽屉 */}
      <ThemeDrawer
        isOpen={themeDrawerOpen}
        onClose={() => setThemeDrawerOpen(false)}
      />
    </>
  )
}
