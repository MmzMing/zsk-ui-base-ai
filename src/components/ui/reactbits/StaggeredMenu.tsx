/**
 * StaggeredMenu - 交错动画菜单组件
 * 来源: React Bits (https://www.reactbits.dev/components/staggered-menu)
 * 使用 GSAP 实现交错动画效果的全屏菜单
 */

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

// 菜单项类型
export interface StaggeredMenuItem {
  label: string
  ariaLabel?: string
  link?: string
  onClick?: () => void
}

// 社交链接类型
export interface StaggeredMenuSocialItem {
  label: string
  link: string
  icon?: React.ReactNode
}

// 组件属性类型
export interface StaggeredMenuProps {
  /** 菜单位置 */
  position?: 'left' | 'right'
  /** 叠加层颜色 */
  colors?: string[]
  /** 菜单项 */
  items?: StaggeredMenuItem[]
  /** 社交链接 */
  socialItems?: StaggeredMenuSocialItem[]
  /** 是否显示社交链接 */
  displaySocials?: boolean
  /** 是否显示菜单编号 */
  displayItemNumbering?: boolean
  /** 自定义类名 */
  className?: string
  /** Logo URL */
  logoUrl?: string
  /** 菜单按钮颜色 */
  menuButtonColor?: string
  /** 打开状态按钮颜色 */
  openMenuButtonColor?: string
  /** 强调色 */
  accentColor?: string
  /** 是否固定定位 */
  isFixed?: boolean
  /** 打开时是否改变按钮颜色 */
  changeMenuColorOnOpen?: boolean
  /** 点击外部是否关闭 */
  closeOnClickAway?: boolean
  /** 菜单打开回调 */
  onMenuOpen?: () => void
  /** 菜单关闭回调 */
  onMenuClose?: () => void
  /** 自定义内容（替代默认菜单项） */
  children?: React.ReactNode
  /** 标题 */
  title?: string
  /** 是否受控模式 - 打开状态 */
  isOpen?: boolean
  /** 受控模式下的关闭回调 */
  onClose?: () => void
}

// Context 类型
interface StaggeredMenuContextType {
  isOpen: boolean
  toggleMenu: () => void
  openMenu: () => void
  closeMenu: () => void
}

// 创建 Context
const StaggeredMenuContext = createContext<StaggeredMenuContextType | null>(null)

// 使用 Context 的 Hook
export function useStaggeredMenu() {
  const context = useContext(StaggeredMenuContext)
  if (!context) {
    throw new Error('useStaggeredMenu must be used within a StaggeredMenuProvider')
  }
  return context
}

// Provider 组件
export function StaggeredMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const openMenu = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <StaggeredMenuContext.Provider value={{ isOpen, toggleMenu, openMenu, closeMenu }}>
      {children}
    </StaggeredMenuContext.Provider>
  )
}

// 主组件
export default function StaggeredMenu({
  position = 'right',
  colors = ['#B19EEF', '#5227FF'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  accentColor = '#537BF9',
  isFixed = false,
  changeMenuColorOnOpen = true,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  children,
  title = '设置',
  isOpen: controlledIsOpen,
  onClose: controlledOnClose
}: StaggeredMenuProps) {
  // 是否为受控模式
  const isControlled = controlledIsOpen !== undefined
  
  // 内部状态（非受控模式使用）
  const [internalOpen, setInternalOpen] = useState(false)
  
  // 实际显示状态
  const open = isControlled ? controlledIsOpen : internalOpen
  
  // 动画是否初始化完成
  const isReadyRef = useRef(false)
  
  // 上一次的打开状态（用于检测变化）
  const prevOpenRef = useRef(open)

  const panelRef = useRef<HTMLDivElement | null>(null)
  const preLayersRef = useRef<HTMLDivElement | null>(null)
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null)
  const menuItemsRef = useRef<HTMLUListElement | null>(null)
  const socialsRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const openTlRef = useRef<gsap.core.Timeline | null>(null)
  const closeTlRef = useRef<gsap.core.Timeline | null>(null)

  // 初始化 GSAP 动画
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 打开动画时间线
      openTlRef.current = gsap.timeline({ paused: true })
      closeTlRef.current = gsap.timeline({ paused: true })

      const layers = preLayersRef.current?.children || []
      const menuItems = menuItemsRef.current?.children || []
      const socialItems = socialsRef.current?.children || []
      const contentChildren = contentRef.current?.children || []

      // 打开动画
      openTlRef.current
        .set(panelRef.current, { visibility: 'visible' })
        .to(layers, {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: { each: 0.1, from: position === 'left' ? 'start' : 'end' }
        }, 0)

      // 如果有自定义内容，对内容子元素做动画
      if (children && contentChildren.length > 0) {
        openTlRef.current.fromTo(contentChildren,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08 },
          0.3
        )
      } else {
        // 默认菜单项动画
        openTlRef.current
          .fromTo(menuItems,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1 },
            0.3
          )
          .fromTo(socialItems,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 },
            0.5
          )
      }

      // 关闭动画
      if (children && contentChildren.length > 0) {
        closeTlRef.current.to(contentChildren, {
          y: -20,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
          stagger: { each: 0.03, from: 'end' }
        }, 0)
      } else {
        closeTlRef.current
          .to(menuItems, {
            y: -30,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            stagger: { each: 0.05, from: 'end' }
          }, 0)
          .to(socialItems, {
            y: -10,
            opacity: 0,
            duration: 0.2,
            stagger: 0.03
          }, 0)
      }

      closeTlRef.current
        .to(layers, {
          yPercent: position === 'left' ? -100 : 100,
          rotate: position === 'left' ? -3 : 3,
          duration: 0.8,
          ease: 'power4.inOut',
          stagger: { each: 0.08, from: position === 'left' ? 'end' : 'start' }
        }, 0.2)
        .set(panelRef.current, { visibility: 'hidden' })
      
      // 标记动画初始化完成
      isReadyRef.current = true
    })

    return () => {
      ctx.revert()
      isReadyRef.current = false
    }
  }, [position, children])

  // 播放打开动画
  const playOpen = useCallback(() => {
    if (!openTlRef.current || !isReadyRef.current) return
    openTlRef.current.play(0)
  }, [])

  // 播放关闭动画
  const playClose = useCallback(() => {
    if (!closeTlRef.current || !isReadyRef.current) return
    closeTlRef.current.play(0)
  }, [])

  // 关闭菜单
  const closeMenu = useCallback(() => {
    if (isControlled) {
      controlledOnClose?.()
      onMenuClose?.()
    } else {
      setInternalOpen(false)
      onMenuClose?.()
    }
  }, [isControlled, controlledOnClose, onMenuClose])

  // 监听状态变化，触发动画
  useEffect(() => {
    if (!isReadyRef.current) return
    
    const prevOpen = prevOpenRef.current
    
    // 状态从关闭变为打开
    if (open && !prevOpen) {
      playOpen()
    }
    // 状态从打开变为关闭
    else if (!open && prevOpen) {
      playClose()
    }
    
    // 更新上一次状态
    prevOpenRef.current = open
  }, [open, playOpen, playClose])

  // 点击外部关闭
  useEffect(() => {
    if (!closeOnClickAway || !open) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(target)
      ) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeOnClickAway, open, closeMenu])

  // 非受控模式的切换函数
  const toggleMenu = useCallback(() => {
    if (isControlled) return
    
    if (internalOpen) {
      setInternalOpen(false)
      onMenuClose?.()
    } else {
      setInternalOpen(true)
      onMenuOpen?.()
    }
  }, [isControlled, internalOpen, onMenuOpen, onMenuClose])

  return (
    <div
      className={`staggered-menu-scope ${isFixed ? 'fixed top-0 left-0 w-full h-full overflow-hidden' : 'w-full h-full'} ${className || ''}`}
      style={{ '--sm-accent': accentColor } as React.CSSProperties}
      data-position={position}
      data-open={open || undefined}
    >
      {/* 预加载层 */}
      <div
        ref={preLayersRef}
        className="staggered-menu-layers absolute inset-0 pointer-events-none"
        aria-hidden
      >
        {colors.map((color, index) => (
          <div
            key={index}
            className="staggered-menu-layer absolute inset-0"
            style={{
              backgroundColor: color,
              transform: position === 'left'
                ? `translateY(${(colors.length - index) * 100}%) rotate(-${(colors.length - index) * 3}deg)`
                : `translateY(-${(colors.length - index) * 100}%) rotate(${(colors.length - index) * 3}deg)`
            }}
          />
        ))}
      </div>

      {/* Header - 仅非受控模式显示 */}
      {!isControlled && (
        <header className="staggered-menu-header absolute top-0 left-0 w-full flex items-center justify-between p-4 md:p-8 bg-transparent pointer-events-none z-20">
          {/* Logo */}
          <div className="flex items-center select-none pointer-events-auto">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8" />
            ) : (
              <span className="text-lg font-bold text-white">{title}</span>
            )}
          </div>

          {/* 切换按钮 */}
          <button
            ref={toggleBtnRef}
            className="sm-toggle relative inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer text-white p-2 transition-colors duration-300 hover:opacity-80 pointer-events-auto z-30"
            onClick={toggleMenu}
            aria-label={open ? '关闭菜单' : '打开菜单'}
            style={{ color: open && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor }}
          >
            <div className="sm-toggle-icon relative w-6 h-6 flex items-center justify-center">
              <span
                className={`absolute w-5 h-0.5 bg-current transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-1.5'}`}
              />
              <span
                className={`absolute w-5 h-0.5 bg-current transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`absolute w-5 h-0.5 bg-current transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-1.5'}`}
              />
            </div>
            <span className="text-sm font-medium hidden md:inline">
              {open ? '关闭' : '菜单'}
            </span>
          </button>
        </header>
      )}

      {/* 菜单面板 */}
      <aside
        ref={panelRef}
        id="staggered-menu-panel"
        className="staggered-menu-panel absolute top-0 h-full flex flex-col invisible z-10"
        style={{
          [position]: 0,
          width: '100%',
          maxWidth: '400px',
          backgroundColor: colors[colors.length - 1]
        }}
        role="dialog"
        aria-modal="true"
        aria-label="菜单"
      >
        {/* 自定义内容或默认菜单项 */}
        {children ? (
          <div ref={contentRef} className="h-full overflow-y-auto">
            {children}
          </div>
        ) : (
          <>
            <nav className="flex-1 p-16 pt-20">
              <ul ref={menuItemsRef} className="flex flex-col gap-2">
                {items.map((item, index) => (
                  <li key={index}>
                    <button
                      className="staggered-menu-item group relative w-full text-left py-3 px-4 text-white text-lg md:text-xl font-medium transition-all duration-200 hover:translate-x-2 hover:bg-white/10 rounded-lg"
                      onClick={() => {
                        item.onClick?.()
                        if (item.link) {
                          window.location.href = item.link
                        }
                      }}
                      aria-label={item.ariaLabel || item.label}
                    >
                      {displayItemNumbering && (
                        <span className="inline-block w-8 text-sm opacity-50 mr-2">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      )}
                      <span className="relative">
                        {item.label}
                        <span
                          className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"
                        />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 社交链接 */}
            {displaySocials && socialItems.length > 0 && (
              <div ref={socialsRef} className="flex items-center gap-4 p-16 pt-4 border-t border-white/20">
                {socialItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    aria-label={item.label}
                  >
                    {item.icon || item.label.charAt(0)}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </aside>

      {/* 内联样式 */}
      <style>{`
        .staggered-menu-scope {
          --sm-accent: ${accentColor};
        }
        .staggered-menu-item:hover span:last-child span {
          width: 100%;
        }
      `}</style>
    </div>
  )
}
