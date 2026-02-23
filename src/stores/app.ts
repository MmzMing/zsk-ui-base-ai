/**
 * 应用设置状态管理
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 主题模式类型
export type ThemeMode = 'light' | 'dark' | 'system'

// 菜单布局类型（后台管理）
export type MenuLayout = 'vertical' | 'horizontal' | 'mixed' | 'dual' | 'dock'

// 页面切换动效类型
export type PageTransition = 'none' | 'fade' | 'slide' | 'scale' | 'layered'

// 语言类型
export type Language = 'zh-CN' | 'en-US'

// 应用设置接口
interface AppSettings {
  /** 主题模式 */
  themeMode: ThemeMode
  /** 主色调 */
  primaryColor: string
  /** 菜单布局 */
  menuLayout: MenuLayout
  /** 语言 */
  language: Language
  /** 启用边框 */
  enableBorder: boolean
  /** 启用阴影 */
  enableShadow: boolean
  /** 多标签页 */
  multiTab: boolean
  /** 显示顶栏 */
  showHeader: boolean
  /** 面包屑导航 */
  showBreadcrumb: boolean
  /** 侧边栏手风琴 */
  sidebarAccordion: boolean
  /** 允许选择文字 */
  allowTextSelection: boolean
  /** 色弱模式 */
  colorWeak: boolean
  /** 点击动效 */
  clickEffect: boolean
  /** 菜单宽度 */
  menuWidth: number
  /** 全局圆角 */
  borderRadius: number
  /** 字体大小 */
  fontSize: number
  /** 内容区边距 */
  contentPadding: number
  /** 页面切换动效 */
  pageTransition: PageTransition
}

// 应用状态接口
interface AppState extends AppSettings {
  /** 侧边栏折叠状态 */
  sidebarCollapsed: boolean
  /** 是否全屏 */
  isFullscreen: boolean

  // Actions
  /** 更新设置 */
  updateSettings: (settings: Partial<AppSettings>) => void
  /** 重置设置 */
  resetSettings: () => void
  /** 切换侧边栏 */
  toggleSidebar: () => void
  /** 设置侧边栏状态 */
  setSidebarCollapsed: (collapsed: boolean) => void
  /** 切换全屏 */
  toggleFullscreen: () => void
}

// 默认设置
const defaultSettings: AppSettings = {
  themeMode: 'system',
  primaryColor: '#537BF9',
  menuLayout: 'vertical',
  language: 'zh-CN',
  enableBorder: false,
  enableShadow: false,
  multiTab: false,
  showHeader: true,
  showBreadcrumb: false,
  sidebarAccordion: true,
  allowTextSelection: false,
  colorWeak: false,
  clickEffect: true,
  menuWidth: 220,
  borderRadius: 12,
  fontSize: 14,
  contentPadding: 16,
  pageTransition: 'fade',
}

// 创建应用 Store
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      sidebarCollapsed: false,
      isFullscreen: false,

      updateSettings: (newSettings) =>
        set((state) => ({
          ...state,
          ...newSettings,
        })),

      resetSettings: () =>
        set((state) => ({
          ...state,
          ...defaultSettings,
        })),

      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      setSidebarCollapsed: (collapsed) =>
        set({
          sidebarCollapsed: collapsed,
        }),

      toggleFullscreen: () => {
        if (typeof document === 'undefined') return

        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen()
          set({ isFullscreen: true })
        } else {
          document.exitFullscreen()
          set({ isFullscreen: false })
        }
      },
    }),
    {
      name: 'zsk-app-settings',
      partialize: (state) => ({
        themeMode: state.themeMode,
        primaryColor: state.primaryColor,
        menuLayout: state.menuLayout,
        language: state.language,
        enableBorder: state.enableBorder,
        enableShadow: state.enableShadow,
        multiTab: state.multiTab,
        showHeader: state.showHeader,
        showBreadcrumb: state.showBreadcrumb,
        sidebarAccordion: state.sidebarAccordion,
        allowTextSelection: state.allowTextSelection,
        colorWeak: state.colorWeak,
        clickEffect: state.clickEffect,
        menuWidth: state.menuWidth,
        borderRadius: state.borderRadius,
        fontSize: state.fontSize,
        contentPadding: state.contentPadding,
        pageTransition: state.pageTransition,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)
