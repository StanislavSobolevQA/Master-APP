import { getRequests, getUserProfile, getMyOffers, getUserOfferIds } from '@/app/actions/requests'
import { sanitizeRequests } from '@/lib/utils'
import { DashboardClient } from './page-client'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { SafeRequest } from '@/lib/types'
import { logger } from '@/lib/logger'

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Загружаем профиль пользователя для получения района
  let userDistrict: string | undefined
  try {
    const profile = await getUserProfile(user.id)
    userDistrict = profile?.district
  } catch (error) {
    logger.error('Error loading user profile', error, { userId: user.id })
  }

  // Загружаем открытые запросы (для таба "Нужна помощь")
  let requests: SafeRequest[] = []
  try {
    const fetchedRequests = await getRequests(undefined, 'open')
    // Удаляем contact_value для безопасности (не передаем в клиентский компонент)
    const requestsData = Array.isArray(fetchedRequests) ? fetchedRequests : fetchedRequests.data || []
    requests = sanitizeRequests(requestsData)
  } catch (error) {
    logger.error('Error loading requests', error, { userId: user.id })
    requests = []
  }

  // Загружаем запросы, на которые пользователь откликнулся (для таба "Могу помочь")
  let myOffers: SafeRequest[] = []
  let userOfferIds: string[] = []
  try {
    const fetchedMyOffers = await getMyOffers()
    myOffers = sanitizeRequests(fetchedMyOffers)
    userOfferIds = await getUserOfferIds()
  } catch (error) {
    logger.error('Error loading my offers', error, { userId: user.id })
    myOffers = []
  }

  return (
    <DashboardClient
      initialRequests={requests}
      initialMyOffers={myOffers}
      userOfferIds={userOfferIds}
      userDistrict={userDistrict}
    />
  )
}
