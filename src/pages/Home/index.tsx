/**
 * 首页组件
 */

import { Button } from '@heroui/react'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">知识库小破站</h1>
      <p className="text-gray-500">前端框架搭建中...</p>
      <Button color="default" variant="solid" className="font-medium">开始探索</Button>
    </div>
  )
}
