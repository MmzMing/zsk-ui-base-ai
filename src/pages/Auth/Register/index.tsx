/**
 * 注册页面
 */

import { Button, Input } from '@heroui/react'

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-content1 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">注册</h1>
        <form className="space-y-4">
          <Input
            label="用户名"
            placeholder="请输入用户名"
            variant="bordered"
          />
          <Input
            label="邮箱"
            placeholder="请输入邮箱"
            type="email"
            variant="bordered"
          />
          <Input
            label="密码"
            placeholder="请输入密码"
            type="password"
            variant="bordered"
          />
          <Input
            label="确认密码"
            placeholder="请再次输入密码"
            type="password"
            variant="bordered"
          />
          <Button color="primary" className="w-full" type="submit">
            注册
          </Button>
        </form>
      </div>
    </div>
  )
}
