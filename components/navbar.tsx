'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Plus, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  selectedDistrict?: string
  onDistrictChange?: (district: string) => void
  onCreateRequest?: () => void
}

const districts = ['Все районы', 'Центральный', 'Северный', 'Южный', 'Восточный', 'Западный']

export function Navbar({ selectedDistrict, onDistrictChange, onCreateRequest }: NavbarProps) {
  const router = useRouter()
  
  // ВРЕМЕННО: всегда показываем как авторизованного пользователя
  const user = { id: 'temp-user' }
  const isLoading = false

  const handleLogout = () => {
    // ВРЕМЕННО: просто редирект на главную
    router.push('/')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href={user ? '/dashboard' : '/'} className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Рядом
          </Link>

          <nav className="flex items-center gap-4 flex-1 justify-end">
            {isLoading ? (
              <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/requests">
                    Мои запросы
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/offers">
                    Мои отклики
                  </Link>
                </Button>
                {selectedDistrict !== undefined && onDistrictChange && (
                  <Select value={selectedDistrict} onValueChange={onDistrictChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {onCreateRequest ? (
                  <Button 
                    onClick={onCreateRequest}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Создать запрос
                  </Button>
                ) : (
                  <Button asChild className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all text-white">
                    <Link href="/dashboard/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Создать запрос
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" asChild>
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Профиль
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Войти</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all text-white">
                  <Link href="/dashboard">Регистрация</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

