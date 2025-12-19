import { getRequests } from '@/app/actions/requests'
import { sanitizeRequests } from '@/lib/utils'
import { HomeClient } from './page-client'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

// ISR: обновление каждые 60 секунд
export const revalidate = 60

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Загружаем открытые запросы для главной страницы
  try {
    const requests = await getRequests(undefined, 'open') // Только открытые запросы
    // Удаляем contact_value для безопасности (не передаем в клиентский компонент)
    const safeRequests = Array.isArray(requests) 
      ? sanitizeRequests(requests)
      : sanitizeRequests(requests.data || [])
    return <HomeClient initialRequests={safeRequests} user={user} />
  } catch (error) {
    logger.error('Error loading requests on home page', error)
    // Возвращаем пустой массив если ошибка (таблицы еще не созданы)
    return <HomeClient initialRequests={[]} user={user} />
  }
}
