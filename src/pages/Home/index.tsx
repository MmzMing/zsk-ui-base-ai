/**
 * 首页组件
 */

import { Button } from '@heroui/react'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const { t } = useTranslation('common')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">{t('app.name')}</h1>
      <p className="text-gray-500">{t('home.building')}</p>
      <Button color="default" variant="solid" className="font-medium">{t('home.explore')}</Button>
    </div>
  )
}
