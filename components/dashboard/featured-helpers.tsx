'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

interface FeaturedHelper {
  id: string
  name: string
  avatar: string | null
  services: string
  rating: number
  completedTasks: number
}

interface FeaturedHelpersProps {
  helpers: FeaturedHelper[]
}

export function FeaturedHelpers({ helpers }: FeaturedHelpersProps) {
  if (helpers.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Избранные исполнители</h3>
        <p className="text-sm text-gray-500">Пока нет исполнителей</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Избранные исполнители</h3>
      <div className="space-y-4">
        {helpers.map((helper) => (
          <div key={helper.id} className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={helper.avatar || ''} />
              <AvatarFallback>{helper.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">{helper.name}</p>
              <p className="text-xs text-gray-600 mt-1">{helper.services}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-700">{helper.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-gray-500">✓ {helper.completedTasks} задач</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

