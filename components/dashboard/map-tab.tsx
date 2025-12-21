'use client'

import { YandexMap } from '@/components/yandex-map'
import type { SafeRequest } from '@/lib/types'

interface MapTabProps {
  requests: SafeRequest[]
}

export function MapTab({ requests }: MapTabProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Задачи на карте</h2>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <YandexMap 
          requests={requests.map(r => ({
            id: r.id,
            type: 'need' as const,
            title: r.title,
            category: r.category,
            urgency: r.urgency,
            reward: r.reward_type,
            amount: r.reward_amount || undefined,
            location: r.district,
            district: r.district,
            createdAt: new Date(r.created_at),
            description: r.description,
          }))}
          center={[55.7558, 37.6173]}
          zoom={11}
        />
      </div>
    </>
  )
}

