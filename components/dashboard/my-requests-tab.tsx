'use client'

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

interface MyRequestsTabProps {
  requests: SafeRequest[]
}

export function MyRequestsTab({ requests }: MyRequestsTabProps) {
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
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Мои запросы</h2>
        <Link href="/dashboard/create">
          <Button size="sm" variant="outline">
            Создать запрос
          </Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">У вас пока нет запросов</p>
          <Button asChild>
            <Link href="/dashboard/create">Создать запрос</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(request => (
            <Link
              key={request.id}
              href={`/requests/${request.id}`}
              className="block group"
            >
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer hover:border-primary/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">{request.title}</h3>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{request.category}</Badge>
                      <Badge className={`${statusColors[request.status]} text-xs`}>
                        {statusLabels[request.status]}
                      </Badge>
                      <Badge variant="default" className="text-xs">
                        {request.reward_type === 'money'
                          ? `${request.reward_amount} ₽`
                          : 'Спасибо'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{request.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{request.district}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(request.created_at)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

