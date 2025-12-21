'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'

export function TopNavbar() {
  const [notificationsCount, setNotificationsCount] = useState(3)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-end">
          {/* Уведомления */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="relative">
              <Bell className="h-5 w-5" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {notificationsCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

