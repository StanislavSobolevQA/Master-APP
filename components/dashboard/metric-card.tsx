'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  icon: LucideIcon
  iconColor: string
  bgColor: string
}

export function MetricCard({ title, value, change, icon: Icon, iconColor, bgColor }: MetricCardProps) {
  return (
    <div className={cn('rounded-xl p-6 shadow-sm border border-gray-100', bgColor)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <p className="text-sm text-gray-600">{change}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', iconColor)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

