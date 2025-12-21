'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  CreditCard, 
  Star, 
  Settings,
  User,
  LogOut,
  MapPin,
  Home,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface SidebarProps {
  user: any
  userProfile: any
  onCreateRequest?: () => void
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function Sidebar({ user, userProfile, onCreateRequest, activeTab, onTabChange }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [supabaseUser, setSupabaseUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setSupabaseUser(user)
    })
  }, [])

  const handleTabClick = (href: string, e: React.MouseEvent) => {
    // Если это главная страница, переходим на неё
    if (href === '/') {
      router.push('/')
      return
    }
    
    // Для остальных вкладок предотвращаем переход и вызываем callback
    e.preventDefault()
    if (onTabChange) {
      onTabChange(href)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const menuItems = [
    { href: '/', label: 'Главная', icon: Home },
    { href: '/dashboard', label: 'Обзор', icon: LayoutDashboard },
    { href: '/dashboard/requests', label: 'Мои запросы', icon: CheckSquare },
    { href: '/dashboard/offers', label: 'Мои отклики', icon: Users },
    { href: '/dashboard/calendar', label: 'Календарь', icon: Calendar },
    { href: '/dashboard/offers', label: 'Исполнители', icon: Users, secondary: true },
    { href: '/dashboard?map=true', label: 'Карта', icon: MapPin },
    { href: '/dashboard/payments', label: 'Платежи', icon: CreditCard },
    { href: '/dashboard/reviews', label: 'Отзывы', icon: Star },
  ]

  const displayName = userProfile?.display_name || user?.email?.split('@')[0] || 'Пользователь'
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col">
      {/* Логотип */}
      <div className="mb-6">
        <Link href="/">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent text-center">
            Рядом
          </h1>
        </Link>
      </div>

      {/* Профиль пользователя */}
      <div className="mb-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/profile">
            <Avatar className="h-20 w-20 border-4 border-gray-100 cursor-pointer hover:border-gray-200 transition-colors">
              <AvatarImage src={userProfile?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <h3 className="font-semibold text-gray-900">{displayName}</h3>
            <Badge className="mt-2 bg-green-500 text-white border-0">
              ✓ Premium
            </Badge>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const currentActiveTab = activeTab || (pathname === '/dashboard' ? '/dashboard' : pathname)
          const isActive = currentActiveTab === item.href || 
            (item.href === '/dashboard' && currentActiveTab === '/dashboard') ||
            (item.href === '/dashboard/requests' && currentActiveTab === '/dashboard/requests') ||
            (item.href === '/dashboard/offers' && currentActiveTab === '/dashboard/offers')
          
          if (item.secondary) return null // Пропускаем дубликаты
          
          // Для главной страницы используем обычный Link
          if (item.href === '/') {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          }
          
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleTabClick(item.href, e)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer',
                isActive
                  ? 'bg-green-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </a>
          )
        })}
      </nav>

      {/* Нижняя секция - Профиль и Выход */}
      <div className="mt-auto pt-4 border-t border-gray-200 space-y-1">
        <Link
          href="/profile"
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            pathname === '/profile'
              ? 'bg-green-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          <User className="h-5 w-5" />
          <span className="font-medium">Профиль</span>
        </Link>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Выйти</span>
        </Button>
      </div>
    </aside>
  )
}

