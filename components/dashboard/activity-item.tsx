'use client'

import { CheckCircle2, Clock, MessageCircle, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityItemProps {
  type: 'task_completed' | 'offer_received' | 'payment' | 'message'
  title: string
  description: string
  time: string
}

const activityIcons = {
  task_completed: CheckCircle2,
  offer_received: Clock,
  payment: DollarSign,
  message: MessageCircle,
}

const activityColors = {
  task_completed: 'text-green-500 bg-green-50',
  offer_received: 'text-orange-500 bg-orange-50',
  payment: 'text-green-500 bg-green-50',
  message: 'text-blue-500 bg-blue-50',
}

export function ActivityItem({ type, title, description, time }: ActivityItemProps) {
  const Icon = activityIcons[type]
  const colorClass = activityColors[type]

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={cn('p-2 rounded-lg', colorClass)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm">{title}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  )
}

