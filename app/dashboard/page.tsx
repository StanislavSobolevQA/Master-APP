import { getRequests, getUserProfile, getMyOffers, getUserOfferIds, getDashboardStats, getRecentActivity, getFeaturedHelpers } from '@/app/actions/requests'
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

  // Загружаем профиль пользователя
  let userProfile: any = null
  try {
    userProfile = await getUserProfile(user.id)
  } catch (error) {
    logger.error('Error loading user profile', error, { userId: user.id })
  }

  // Загружаем статистику дашборда
  let dashboardStats = null
  try {
    dashboardStats = await getDashboardStats()
  } catch (error) {
    logger.error('Error loading dashboard stats', error, { userId: user.id })
  }

  // Загружаем последнюю активность
  let recentActivity: any[] = []
  try {
    recentActivity = await getRecentActivity()
  } catch (error) {
    logger.error('Error loading recent activity', error, { userId: user.id })
  }

  // Загружаем избранных исполнителей
  let featuredHelpers: any[] = []
  try {
    featuredHelpers = await getFeaturedHelpers()
  } catch (error) {
    logger.error('Error loading featured helpers', error, { userId: user.id })
  }

  // Загружаем открытые запросы (для таба "Нужна помощь")
  let requests: SafeRequest[] = []
  try {
    const fetchedRequests = await getRequests(undefined, 'open')
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

  // Загружаем запросы пользователя (Мои запросы)
  let myRequests: SafeRequest[] = []
  try {
    const { data: userRequests, error } = await supabase
      .from('requests')
      .select('*')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching user requests', error, { userId: user.id })
    } else {
      myRequests = sanitizeRequests(userRequests || [])
    }
  } catch (error) {
    logger.error('Error loading my requests', error, { userId: user.id })
  }

  // Загружаем отклики с полной информацией (для календаря)
  // 1. Мои отклики (где я исполнитель)
  let myOffersFull: any[] = []
  try {
    const { data: offersData, error } = await supabase
      .from('offers')
      .select(`
        *,
        requests(*),
        profiles!offers_helper_id_fkey(display_name, avatar_url)
      `)
      .eq('helper_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching offers', error, { userId: user.id })
    } else {
      myOffersFull = offersData || []
    }
  } catch (error) {
    logger.error('Error loading offers', error, { userId: user.id })
  }

  // 2. Отклики на мои запросы (где я автор запроса)
  let offersOnMyRequests: any[] = []
  try {
    const myRequestIds = myRequests.map(r => r.id)
    if (myRequestIds.length > 0) {
      const { data: offersData, error } = await supabase
        .from('offers')
        .select(`
          *,
          requests!inner(*),
          profiles!offers_helper_id_fkey(display_name, avatar_url)
        `)
        .in('request_id', myRequestIds)
        .order('created_at', { ascending: false })

      if (error) {
        logger.error('Error fetching offers on my requests', error, { userId: user.id })
      } else {
        offersOnMyRequests = offersData || []
      }
    }
  } catch (error) {
    logger.error('Error loading offers on my requests', error, { userId: user.id })
  }

  return (
    <DashboardClient
      user={user}
      userProfile={userProfile}
      dashboardStats={dashboardStats}
      recentActivity={recentActivity}
      featuredHelpers={featuredHelpers}
      initialRequests={requests}
      initialMyOffers={myOffersFull}
      initialMyRequests={myRequests}
      offersOnMyRequests={offersOnMyRequests}
      userOfferIds={userOfferIds}
      userDistrict={userProfile?.district}
    />
  )
}
