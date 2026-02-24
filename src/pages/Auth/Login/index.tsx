/**
 * 登录页面
 */

import { Button, Input } from '@heroui/react'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-content1 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">登录</h1>
        <form className="space-y-4">
          <Input
            label="用户名/邮箱"
            variant="bordered"
          />
          <Input
            label="密码"
            type="password"
            variant="bordered"
          />
          <Button color="primary" className="w-full" type="submit">
            登录
          </Button>
        </form>
      </div>
    </div>
  )
}
