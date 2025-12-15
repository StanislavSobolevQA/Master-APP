import { getRequests } from '@/app/actions/requests'
import { DashboardClient } from './page-client'
import { Navbar } from '@/components/navbar'

export default async function DashboardPage() {
  // ВРЕМЕННО: убрана проверка авторизации
  
  // Загружаем запросы
  let requests = []
  try {
    requests = await getRequests({
      status: 'open',
    })
  } catch (error) {
    // ВРЕМЕННО: игнорируем ошибки загрузки (база данных может быть не настроена)
    console.error('Error loading requests (ignored):', error)
    requests = []
  }

  return (
    <DashboardClient 
      initialRequests={requests as any}
      userDistrict={undefined}
    />
  )
}
