'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, MessageCircle } from 'lucide-react'
import { getRequestContact } from '@/app/actions/requests'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'
import Link from 'next/link'

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

interface MyOffersTabProps {
  offers: any[]
}

export function MyOffersTab({ offers }: MyOffersTabProps) {
  const [loadingContact, setLoadingContact] = useState<string | null>(null)
  const [contacts, setContacts] = useState<Record<string, { contact_type: string; contact_value: string }>>({})

  const handleGetContact = async (requestId: string) => {
    if (contacts[requestId]) return

    setLoadingContact(requestId)
    try {
      const contact = await getRequestContact(requestId)
      if (contact) {
        setContacts((prev) => ({ ...prev, [requestId]: contact as { contact_type: string; contact_value: string } }))
        toast.success('Контакт получен')
      } else {
        throw new Error('Contact not found')
      }
    } catch (error) {
      toast.error('Не удалось получить контакт. Убедитесь, что вы откликнулись на запрос.')
      logger.error('Error getting contact', error, { requestId })
    } finally {
      setLoadingContact(null)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Мои отклики</h2>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">У вас пока нет откликов</p>
          <Button asChild variant="outline">
            <Link href="/dashboard">Найти запросы</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((offer: any) => {
            const request = offer.requests
            if (!request) return null

            const contact = contacts[request.id]

            return (
              <div
                key={offer.id}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Link href={`/requests/${request.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary transition-colors">{request.title}</h3>
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{request.category}</Badge>
                      <Badge
                        variant={request.status === 'closed' ? 'secondary' : 'default'}
                        className="text-xs"
                      >
                        {request.status === 'open' ? 'Открыт' : request.status === 'in_progress' ? 'В работе' : 'Закрыт'}
                      </Badge>
                      <Badge variant="default" className="text-xs">
                        {request.reward_type === 'money'
                          ? `${request.reward_amount} ₽`
                          : 'Спасибо'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-3">{request.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{request.district}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Отклик: {formatTimeAgo(offer.created_at)}</span>
                  </div>
                </div>

                {contact ? (
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <p className="text-xs font-semibold mb-1">Контакт:</p>
                    <p className="text-sm">
                      {contact.contact_type === 'telegram' ? 'Telegram' : 'Телефон'}: {contact.contact_value}
                    </p>
                    {contact.contact_type === 'telegram' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => window.open(`https://t.me/${contact.contact_value.replace('@', '')}`, '_blank')}
                      >
                        <MessageCircle className="h-3 w-3 mr-2" />
                        Открыть Telegram
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGetContact(request.id)}
                    disabled={loadingContact === request.id}
                  >
                    {loadingContact === request.id ? 'Загрузка...' : 'Получить контакт'}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

