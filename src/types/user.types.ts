/**
 * 用户相关类型定义
 */

// 用户角色类型
export type UserRole = 'admin' | 'user' | 'guest'

// 用户基础信息
export interface UserInfo {
  /** 用户 ID */
  id: string
  /** 用户名 */
  name: string
  /** 邮箱 */
  email: string
  /** 头像地址 */
  avatar?: string
  /** 用户角色 */
  role: UserRole
  /** 用户状态 */
  status: 'active' | 'inactive' | 'banned'
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

// 登录请求参数
export interface LoginParams {
  /** 用户名/邮箱 */
  username: string
  /** 密码 */
  password: string
  /** 记住登录 */
  remember?: boolean
}

// 登录响应数据
export interface LoginResult {
  /** 访问令牌 */
  accessToken: string
  /** 刷新令牌 */
  refreshToken: string
  /** 过期时间（秒） */
  expiresIn: number
  /** 用户信息 */
  user: UserInfo
}

// 注册请求参数
export interface RegisterParams {
  /** 用户名 */
  name: string
  /** 邮箱 */
  email: string
  /** 密码 */
  password: string
  /** 确认密码 */
  confirmPassword: string
  /** 验证码 */
  captcha?: string
}

// Token 信息
export interface TokenInfo {
  /** 访问令牌 */
  accessToken: string
  /** 刷新令牌 */
  refreshToken: string
  /** 过期时间戳 */
  expiresAt: number
}
