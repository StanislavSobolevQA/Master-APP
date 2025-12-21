'use client'

import { Button } from '@/components/ui/button'
import { Plus, FileText, Wallet, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function QuickActions() {
  const router = useRouter()

  const actions = [
    { icon: Plus, label: 'Создать запрос', href: '/dashboard/create', isGradient: true },
    { icon: FileText, label: 'Шаблоны', href: '/dashboard/templates', color: 'bg-gray-500 hover:bg-gray-600' },
    { icon: Wallet, label: 'Пополнить', href: '/dashboard/payments', color: 'bg-green-500 hover:bg-green-600' },
    { icon: BarChart3, label: 'Отчёты', href: '/dashboard/reports', color: 'bg-purple-500 hover:bg-purple-600' },
  ]

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.label}
              onClick={() => router.push(action.href)}
              className={
                action.isGradient
                  ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white h-auto py-3 flex flex-col items-center gap-2'
                  : `${action.color} text-white h-auto py-3 flex flex-col items-center gap-2`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

