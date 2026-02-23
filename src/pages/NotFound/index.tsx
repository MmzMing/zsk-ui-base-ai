/**
 * 404 页面
 */

import { Button } from '@heroui/react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl text-gray-500">页面不存在</p>
      <Button as={Link} to="/" color="primary">
        返回首页
      </Button>
    </div>
  )
}
