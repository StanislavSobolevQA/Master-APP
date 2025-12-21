'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { TopNavbar } from '@/components/dashboard/top-navbar'
import { Sidebar } from '@/components/dashboard/sidebar'
import { MetricCard } from '@/components/dashboard/metric-card'
import { TabContent } from '@/components/dashboard/tab-content'
import { FeaturedHelpers } from '@/components/dashboard/featured-helpers'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { CheckCircle2, Users, DollarSign, Star } from 'lucide-react'
import type { SafeRequest } from '@/lib/types'

interface DashboardClientProps {
  user: any
  userProfile: any
  dashboardStats: any
  recentActivity: any[]
  featuredHelpers: any[]
  initialRequests: SafeRequest[]
  initialMyOffers?: any[]
  initialMyRequests?: SafeRequest[]
  offersOnMyRequests?: any[]
  userOfferIds?: string[]
  userDistrict?: string
  onCreateRequest?: () => void
}

export function DashboardClient({
  user,
  userProfile,
  dashboardStats,
  recentActivity,
  featuredHelpers,
  initialRequests,
  initialMyOffers = [],
  initialMyRequests = [],
  offersOnMyRequests = [],
  userOfferIds = [],
  userDistrict,
  onCreateRequest
}: DashboardClientProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<string>('/dashboard')
  
  useEffect(() => {
    // Определяем активную вкладку на основе URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('map') === 'true') {
        setActiveTab('/dashboard?map=true')
      } else if (pathname === '/dashboard/requests') {
        setActiveTab('/dashboard/requests')
      } else if (pathname === '/dashboard/offers') {
        setActiveTab('/dashboard/offers')
      } else if (pathname === '/dashboard/calendar') {
        setActiveTab('/dashboard/calendar')
      } else if (pathname === '/dashboard/create') {
        setActiveTab('/dashboard/create')
      } else if (pathname === '/dashboard/payments') {
        setActiveTab('/dashboard/payments')
      } else if (pathname === '/dashboard/reviews') {
        setActiveTab('/dashboard/reviews')
      } else if (pathname === '/dashboard') {
        setActiveTab('/dashboard')
      }
    }
  }, [pathname])

  const displayName = userProfile?.display_name || user?.email?.split('@')[0] || 'Пользователь'

  // Форматируем месячные расходы
  const monthlySpending = dashboardStats?.monthlySpending || 0
  const formattedSpending = new Intl.NumberFormat('ru-RU').format(monthlySpending)

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      
      <div className="flex">
        {/* Левая боковая панель */}
        <Sidebar 
          user={user} 
          userProfile={userProfile} 
          onCreateRequest={onCreateRequest}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Основной контент */}
        <main className="flex-1 p-8">
          {/* Приветствие */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Добро пожаловать, {displayName}! 👋
            </h1>
            <p className="text-gray-600">
              Вот что происходит с вашими задачами сегодня
            </p>
            </div>

          {/* Карточки метрик */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Активные задачи"
              value={dashboardStats?.activeTasks || 0}
              change={dashboardStats?.activeTasksWeekChange ? `↑ ${dashboardStats.activeTasksWeekChange} за неделю` : undefined}
              icon={CheckCircle2}
              iconColor="bg-green-500"
              bgColor="bg-green-50 border-green-100"
            />
            <MetricCard
              title="Постоянные исполнители"
              value={dashboardStats?.helpers || 0}
              change={dashboardStats?.newHelpers ? `↑ ${dashboardStats.newHelpers} новый` : undefined}
              icon={Users}
              iconColor="bg-red-500"
              bgColor="bg-red-50 border-red-100"
            />
            <MetricCard
              title="Месячные расходы"
              value={`${formattedSpending}₽`}
              change="+12% экономия"
              icon={DollarSign}
              iconColor="bg-blue-500"
              bgColor="bg-blue-50 border-blue-100"
            />
            <MetricCard
              title="Средний рейтинг"
              value={dashboardStats?.averageRating?.toFixed(1) || '4.9'}
              change={dashboardStats?.averageRatingChange ? `↑ ${dashboardStats.averageRatingChange} балла` : undefined}
              icon={Star}
              iconColor="bg-amber-500"
              bgColor="bg-amber-50 border-amber-100"
            />
              </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Центральная область - Контент вкладки */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
              <TabContent
                activeTab={activeTab}
                recentActivity={recentActivity}
                myRequests={initialMyRequests}
                myOffers={initialMyOffers}
                offersOnMyRequests={offersOnMyRequests}
                allRequests={initialRequests}
                userDistrict={userDistrict}
                />
              </div>

            {/* Правая боковая панель */}
            <div className="space-y-6">
              <FeaturedHelpers helpers={featuredHelpers} />
              <QuickActions onTabChange={setActiveTab} />
                </div>
              </div>
        </main>
            </div>
    </div>
  )
}
