/**
 * 前台底部组件
 * 美观、简约的页脚设计
 */

import { Link } from 'react-router-dom'
import { Divider } from '@heroui/react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  MapPin, 
  Rss, 
  Github,
  Twitter,
  BookOpen,
  FileText,
  Compass,
  Info,
  Shield,
  Send
} from 'lucide-react'
import { cn } from '@/utils'
import { SiteLogo } from '@/components/ui/SiteLogo'

// 底部链接项类型
interface FooterLink {
  label: string
  href: string
  icon?: React.ReactNode
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
    title: '浏览',
    links: [
      { label: '首页', href: '/', icon: <BookOpen className="w-4 h-4" /> },
      { label: '文章', href: '/articles', icon: <FileText className="w-4 h-4" /> },
      { label: '分类', href: '/categories', icon: <Compass className="w-4 h-4" /> },
      { label: '关于', href: '/about', icon: <Info className="w-4 h-4" /> }
    ]
  },
  {
    title: '法律',
    links: [
      { label: '隐私政策', href: '/privacy', icon: <Shield className="w-4 h-4" /> },
      { label: '服务条款', href: '/terms', icon: <FileText className="w-4 h-4" /> }
    ]
  },
  {
    title: '联系',
    links: [
      { label: '反馈建议', href: '/feedback', icon: <Send className="w-4 h-4" /> },
      { label: '广告合作', href: '/cooperation', icon: <Mail className="w-4 h-4" /> }
    ]
  }
]

// 社交链接
const SOCIAL_LINKS: SocialLink[] = [
  { icon: <Github className="w-5 h-5" />, href: 'https://github.com', label: 'GitHub' },
  { icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com', label: 'Twitter' },
  { icon: <Mail className="w-5 h-5" />, href: 'mailto:contact@example.com', label: 'Email' }
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
  /** 公安备案号 */
  policeIcp?: string
  className?: string
}

export default function FrontFooter({
  sections = FOOTER_SECTIONS,
  socialLinks = SOCIAL_LINKS,
  siteName = '知识库小破站',
  siteDescription = '分享知识，记录成长。一个专注于技术分享与学习的知识平台。',
  icp = '',
  policeIcp = '',
  className
}: FrontFooterProps) {
  const currentYear = new Date().getFullYear()

  // 渲染链接
  const renderLink = (link: FooterLink) => {
    const content = (
      <>
        {link.icon && <span className="opacity-60">{link.icon}</span>}
        <span>{link.label}</span>
      </>
    )

    if (link.external) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-default-500 hover:text-primary transition-colors text-sm py-1"
        >
          {content}
        </a>
      )
    }

    return (
      <Link
        to={link.href}
        className="flex items-center gap-2 text-default-500 hover:text-primary transition-colors text-sm py-1"
      >
        {content}
      </Link>
    )
  }

  return (
    <footer
      className={cn(
        'w-full bg-background border-t border-divider/50',
        className
      )}
    >
      <div className="container mx-auto px-4">
        {/* 主要内容区域 */}
        <div className="py-16">
          {/* 顶部品牌区域 */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-12">
            {/* 品牌信息 */}
            <div className="max-w-sm">
              <Link to="/" className="inline-flex items-center gap-3 mb-4">
                <SiteLogo size="lg" />
                <span className="text-2xl font-bold text-default-900">
                  {siteName}
                </span>
              </Link>
              <p className="text-default-500 text-sm leading-relaxed mb-6">
                {siteDescription}
              </p>

              {/* 联系信息 */}
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:contact@example.com"
                  className="flex items-center gap-3 text-sm text-default-600 hover:text-primary transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-default-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>contact@example.com</span>
                </a>
                <div className="flex items-center gap-3 text-sm text-default-600">
                  <div className="w-8 h-8 rounded-lg bg-default-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>中国 · 北京</span>
                </div>
              </div>
            </div>

            {/* 链接分组 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-16">
              {sections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-semibold text-default-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full bg-primary" />
                    {section.title}
                  </h4>
                  <nav className="flex flex-col gap-1">
                    {section.links.map((link) => (
                      <div key={link.label}>
                        {renderLink(link)}
                      </div>
                    ))}
                  </nav>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 社交链接和订阅 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-8 border-t border-divider/50">
            {/* 社交链接 */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-default-500 mr-2">关注我们</span>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-default-100 text-default-600 hover:bg-primary hover:text-white transition-colors"
                  title={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* 右侧信息 */}
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
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Rss className="w-4 h-4" />
                <span>RSS</span>
              </a>
            </div>
          </div>
        </div>

        {/* 底部版权区域 */}
        <Divider className="mb-0" />

        <div className="py-4 flex flex-col items-center justify-center gap-2 text-sm text-default-500">
          <span>&copy; {currentYear} {siteName}</span>
          {/* 备案信息 */}
          {(icp || policeIcp) && (
            <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-default-400">
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
              {icp && policeIcp && <span>·</span>}
              {policeIcp && (
                <a
                  href="https://www.gov.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {policeIcp}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
