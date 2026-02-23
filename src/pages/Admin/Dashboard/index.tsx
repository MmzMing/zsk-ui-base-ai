/**
 * 后台管理仪表盘页面
 */

import { Card, CardBody, CardHeader } from '@heroui/react'
import {
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineEye,
  HiOutlineChartBar
} from 'react-icons/hi'

// 统计卡片数据
const stats = [
  {
    title: '文章总数',
    value: '128',
    icon: HiOutlineDocumentText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  {
    title: '用户数量',
    value: '1,234',
    icon: HiOutlineUserGroup,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950'
  },
  {
    title: '今日访问',
    value: '5,678',
    icon: HiOutlineEye,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950'
  },
  {
    title: '评论数量',
    value: '892',
    icon: HiOutlineChartBar,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950'
  }
]

// 快捷操作
const quickActions = [
  { title: '写文章', description: '创建新的文章', path: '/admin/content/articles/create' },
  { title: '用户管理', description: '管理用户权限', path: '/admin/user/users' },
  { title: '系统设置', description: '配置系统参数', path: '/admin/system/general' },
  { title: '数据分析', description: '查看统计报表', path: '/admin/analysis' }
]

import { useBreakpoint } from '@/hooks/useBreakpoint'

export default function Dashboard() {
  const { isMobile } = useBreakpoint()

  return (
    <div className={isMobile ? 'p-3' : 'p-4 md:p-6'}>
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-default-900">仪表盘</h1>
        <p className="text-default-500 mt-1">欢迎回来，今天是 {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="admin-card">
            <CardBody className="flex flex-row items-center gap-3 md:gap-4 p-3 md:p-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`text-2xl ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-default-500">{stat.title}</p>
                <p className="text-2xl font-semibold text-default-900">{stat.value}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* 快捷操作 */}
      <Card className="admin-card mb-6">
        <CardHeader className="px-4 md:px-6 py-3 md:py-4 border-b border-divider">
          <h2 className="text-lg font-semibold">快捷操作</h2>
        </CardHeader>
        <CardBody className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.title}
                className="p-4 text-left rounded-lg border border-divider hover:border-primary hover:bg-primary/5 transition-colors group"
              >
                <h3 className="font-medium text-default-900 group-hover:text-primary">
                  {action.title}
                </h3>
                <p className="text-sm text-default-500 mt-1">{action.description}</p>
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* 最近动态 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最新文章 */}
        <Card className="admin-card">
          <CardHeader className="px-4 md:px-6 py-3 md:py-4 border-b border-divider">
            <h2 className="text-lg font-semibold">最新文章</h2>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-divider">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="px-6 py-3 hover:bg-default-50 transition-colors cursor-pointer">
                  <h3 className="text-sm font-medium text-default-900 truncate">
                    示例文章标题 {i} - 如何使用 React 构建现代化应用
                  </h3>
                  <p className="text-xs text-default-400 mt-1">
                    {new Date(Date.now() - i * 3600000).toLocaleString('zh-CN')}
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* 最新评论 */}
        <Card className="admin-card">
          <CardHeader className="px-4 md:px-6 py-3 md:py-4 border-b border-divider">
            <h2 className="text-lg font-semibold">最新评论</h2>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-divider">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="px-6 py-3 hover:bg-default-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">用{i}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-default-700 truncate">
                        这是一段示例评论内容，非常精彩的文章！
                      </p>
                      <p className="text-xs text-default-400">
                        用户{i} · {new Date(Date.now() - i * 7200000).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
