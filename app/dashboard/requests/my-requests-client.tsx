'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, ArrowRight } from 'lucide-react'
import type { SafeRequest } from '@/lib/types'

function formatTimeAgo(date: string): string {
  const now = new Date()
  const dateObj = new Date(date)
  const diffMs = now.getTime() - dateObj.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins} мин назад`
  if (diffHours < 24) return `${diffHours} ч назад`
  return `${diffDays} дн назад`
}

interface MyRequestsClientProps {
  initialRequests: SafeRequest[]
}

export function MyRequestsClient({ initialRequests }: MyRequestsClientProps) {
  const [requests] = useState<SafeRequest[]>(initialRequests)

  const statusLabels: Record<string, string> = {
    open: 'Открыт',
    in_progress: 'В работе',
    closed: 'Закрыт',
  }

  const statusColors: Record<string, string> = {
    open: 'bg-green-100 text-green-700',
    in_progress: 'bg-blue-100 text-blue-700',
    closed: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Мои запросы</h1>

        {requests.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">У вас пока нет запросов</p>
            <Button asChild>
              <a href="/dashboard/create">Создать поручение</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(request => (
              <Link
                key={request.id}
                href={`/requests/${request.id}`}
                className="block group"
              >
                <div
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">{request.title}</h3>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{request.category}</Badge>
                        <Badge className={statusColors[request.status]}>
                          {statusLabels[request.status]}
                        </Badge>
                        <Badge variant="default">
                          {request.reward_type === 'money'
                            ? `${request.reward_amount} ₽`
                            : 'Спасибо'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">{request.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{request.district}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimeAgo(request.created_at)}</span>
                    </div>
                  </div>

                  <div className="text-sm text-primary font-medium mt-2 flex items-center gap-1">
                    Нажмите для просмотра и редактирования
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

