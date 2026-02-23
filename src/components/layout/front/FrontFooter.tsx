/**
 * 前台底部组件
 * 包含网站信息、链接、版权声明等
 */

import { Link } from 'react-router-dom'
import { Divider } from '@heroui/react'
import {
  HiOutlineRss,
  HiOutlineMail,
  HiOutlineLocationMarker
} from 'react-icons/hi'
import {
  FaGithub,
  FaTwitter,
  FaWeibo,
  FaZhihu
} from 'react-icons/fa'
import { cn } from '@/utils'

// 底部链接项类型
interface FooterLink {
  label: string
  href: string
  external?: boolean
}

// 底部分组类型
interface FooterSection {
  title: string
  links: FooterLink[]
}

// 社交链接类型
interface SocialLink {
  icon: React.ReactNode
  href: string
  label: string
}

// 默认底部链接
const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: '导航',
    links: [
      { label: '首页', href: '/' },
      { label: '文章', href: '/articles' },
      { label: '分类', href: '/categories' },
      { label: '关于', href: '/about' }
    ]
  },
  {
    title: '资源',
    links: [
      { label: 'API 文档', href: '/docs/api', external: true },
      { label: '开发指南', href: '/docs/guide', external: true },
      { label: '更新日志', href: '/changelog' }
    ]
  },
  {
    title: '关于',
    links: [
      { label: '关于我们', href: '/about' },
      { label: '联系方式', href: '/contact' },
      { label: '隐私政策', href: '/privacy' },
      { label: '服务条款', href: '/terms' }
    ]
  }
]

// 社交链接
const SOCIAL_LINKS: SocialLink[] = [
  { icon: <FaGithub />, href: 'https://github.com', label: 'GitHub' },
  { icon: <FaTwitter />, href: 'https://twitter.com', label: 'Twitter' },
  { icon: <FaWeibo />, href: 'https://weibo.com', label: '微博' },
  { icon: <FaZhihu />, href: 'https://zhihu.com', label: '知乎' }
]

// 前台底部属性
interface FrontFooterProps {
  /** 自定义底部链接分组 */
  sections?: FooterSection[]
  /** 自定义社交链接 */
  socialLinks?: SocialLink[]
  /** 网站名称 */
  siteName?: string
  /** 网站描述 */
  siteDescription?: string
  /** 备案号 */
  icp?: string
  className?: string
}

export default function FrontFooter({
  sections = FOOTER_SECTIONS,
  socialLinks = SOCIAL_LINKS,
  siteName = '知识库小破站',
  siteDescription = '分享知识，记录成长',
  icp = '',
  className
}: FrontFooterProps) {
  const currentYear = new Date().getFullYear()

  // 渲染链接
  const renderLink = (link: FooterLink) => {
    if (link.external) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-default-500 hover:text-primary transition-colors text-sm"
        >
          {link.label}
        </a>
      )
    }

    return (
      <Link
        to={link.href}
        className="text-default-500 hover:text-primary transition-colors text-sm"
      >
        {link.label}
      </Link>
    )
  }

  return (
    <footer
      className={cn(
        'w-full border-t border-divider bg-content1',
        className
      )}
    >
      <div className="container mx-auto px-4">
        {/* 主要内容区域 */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* 网站信息 */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {siteName}
              </span>
            </Link>
            <p className="text-default-500 text-sm mb-4 max-w-xs">
              {siteDescription}
            </p>

            {/* 联系信息 */}
            <div className="flex flex-col gap-2 text-sm text-default-500">
              <div className="flex items-center gap-2">
                <HiOutlineMail className="text-lg" />
                <span>contact@example.com</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineLocationMarker className="text-lg" />
                <span>中国</span>
              </div>
            </div>

            {/* 社交链接 */}
            <div className="flex items-center gap-3 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-default-100 text-default-500 hover:bg-primary hover:text-white transition-colors"
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 链接分组 */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-default-900 mb-4">{section.title}</h4>
              <nav className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <div key={link.label}>
                    {renderLink(link)}
                  </div>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <Divider />

        {/* 底部版权区域 */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-default-500">
            &copy; {currentYear} {siteName}. 保留所有权利。
          </p>

          <div className="flex items-center gap-4 text-sm text-default-500">
            {icp && (
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {icp}
              </a>
            )}
            <a
              href="/rss"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <HiOutlineRss className="text-lg" />
              <span>RSS</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
