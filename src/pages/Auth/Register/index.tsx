/**
 * 注册页面
 */

import { Button, Input } from '@heroui/react'
import { useTranslation } from 'react-i18next'

export default function RegisterPage() {
  const { t } = useTranslation('auth')

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-content1 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">{t('register.header')}</h1>
        <form className="space-y-4">
          <Input
            label={t('register.username')}
            placeholder={t('validation.usernameRequired')}
            variant="bordered"
          />
          <Input
            label={t('register.email')}
            placeholder={t('validation.emailRequired')}
            type="email"
            variant="bordered"
          />
          <Input
            label={t('register.password')}
            placeholder={t('validation.passwordRequired')}
            type="password"
            variant="bordered"
          />
          <Input
            label={t('register.confirmPassword')}
            placeholder={t('validation.rePasswordRequired')}
            type="password"
            variant="bordered"
          />
          <Button color="primary" className="w-full" type="submit">
            {t('register.submit')}
          </Button>
        </form>
      </div>
    </div>
  )
}
