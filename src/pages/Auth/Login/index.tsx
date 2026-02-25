/**
 * 登录页面
 */

import { Button, Input } from '@heroui/react'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
  const { t } = useTranslation('auth')

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-content1 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">{t('login.header')}</h1>
        <form className="space-y-4">
          <Input
            label={t('login.account')}
            variant="bordered"
          />
          <Input
            label={t('login.password')}
            type="password"
            variant="bordered"
          />
          <Button color="primary" className="w-full" type="submit">
            {t('login.submit')}
          </Button>
        </form>
      </div>
    </div>
  )
}
