import { MyRequestsClient } from './my-requests-client'
import { Navbar } from '@/components/navbar'

export default async function MyRequestsPage() {
  // ВРЕМЕННО: убрана проверка авторизации
  
  // Загружаем запросы (пока без фильтрации по пользователю)
  return (
    <>
      <Navbar />
      <MyRequestsClient initialRequests={[]} />
    </>
  )
}

