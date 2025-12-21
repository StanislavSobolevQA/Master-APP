'use client'

import { ActivityItem } from './activity-item'
import { MyRequestsTab } from './my-requests-tab'
import { MyOffersTab } from './my-offers-tab'
import { CalendarTab } from './calendar-tab'
import { MapTab } from './map-tab'
import { PaymentsTab } from './payments-tab'
import { ReviewsTab } from './reviews-tab'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { SafeRequest } from '@/lib/types'

interface TabContentProps {
  activeTab: string
  recentActivity: any[]
  myRequests: SafeRequest[]
  myOffers: any[]
  offersOnMyRequests?: any[]
  allRequests: SafeRequest[]
}

export function TabContent({ activeTab, recentActivity, myRequests, myOffers, offersOnMyRequests = [], allRequests }: TabContentProps) {
  // Если выбран "Обзор", показываем последнюю активность
  if (activeTab === 'overview' || activeTab === '/dashboard' || !activeTab) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Последняя активность</h2>
          <Link href="/dashboard/activity" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
            Показать всё
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="space-y-2">
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">Пока нет активности</p>
          ) : (
            recentActivity.map((activity) => (
              <ActivityItem
                key={activity.id}
                type={activity.type}
                title={activity.title}
                description={activity.description}
                time={activity.time}
              />
            ))
          )}
        </div>
      </>
    )
  }

  // Для других вкладок показываем соответствующий контент
  switch (activeTab) {
    case 'requests':
    case '/dashboard/requests':
      return <MyRequestsTab requests={myRequests} />
    
    case 'offers':
    case '/dashboard/offers':
      return <MyOffersTab offers={myOffers} />
    
    case 'calendar':
    case '/dashboard/calendar':
      return <CalendarTab requests={allRequests} myOffers={myOffers} myRequests={myRequests} offersOnMyRequests={offersOnMyRequests} />
    
    case 'map':
    case '/dashboard?map=true':
      return <MapTab requests={allRequests} />
    
    case 'payments':
    case '/dashboard/payments':
      return <PaymentsTab />
    
    case 'reviews':
    case '/dashboard/reviews':
      return <ReviewsTab />
    
    default:
      return (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Последняя активность</h2>
            <Link href="/dashboard/activity" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              Показать всё
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-2">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center">Пока нет активности</p>
            ) : (
              recentActivity.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  type={activity.type}
                  title={activity.title}
                  description={activity.description}
                  time={activity.time}
                />
              ))
            )}
          </div>
        </>
      )
  }
}

