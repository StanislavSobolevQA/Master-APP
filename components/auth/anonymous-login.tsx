'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AnonymousLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAnonymousLogin = async () => {
    setIsLoading(true)
    try {
      // Используем клиентский Supabase клиент напрямую, чтобы избежать проблем с cookies на сервере
      const supabase = createClient()
      
      console.log('Attempting anonymous sign in from client...')
      
      const { data, error } = await supabase.auth.signInAnonymously()

      if (error) {
        console.error('Anonymous auth error:', error)
        
        let errorText = 'Ошибка при входе'
        if (error.message) {
          // Убираем кириллицу из сообщения об ошибке для безопасности
          const safeMessage = error.message.replace(/[^\x00-\x7F]/g, '?')
          
          if (safeMessage.includes('not enabled') || safeMessage.includes('disabled')) {
            errorText = 'Анонимная авторизация не включена. Включите её в настройках Supabase: Auth > Providers > Anonymous'
          } else if (safeMessage.includes('quota') || error.status === 403) {
            errorText = 'Превышена квота проекта. Проверьте статус проекта в Supabase.'
          } else if (safeMessage.includes('configuration')) {
            errorText = 'Ошибка конфигурации. Проверьте настройки анонимной авторизации в Supabase.'
          } else {
            errorText = `Ошибка: ${safeMessage.substring(0, 100)}`
          }
        }
        alert(errorText)
        return
      }

      if (data.user) {
        console.log('Anonymous sign in successful:', data.user.id)
        
        // Создаем профиль, если нужно
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            display_name: `User ${data.user.id.slice(0, 8)}`,
          }, {
            onConflict: 'id'
          })
        
        if (profileError) {
          console.error('Error creating profile:', profileError)
          // Не блокируем вход, если профиль не создался - триггер должен создать автоматически
        }
        
        // Перенаправляем на dashboard
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error: any) {
      console.error('Unexpected error:', error)
      const safeMessage = error?.message?.replace(/[^\x00-\x7F]/g, '?') || 'Unknown error'
      alert(`Произошла неожиданная ошибка: ${safeMessage.substring(0, 100)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-sm text-yellow-800 mb-3">
        ⚠️ Email не работает? Используйте временный вход для тестирования:
      </p>
      <Button
        onClick={handleAnonymousLogin}
        disabled={isLoading}
        variant="outline"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Вход...
          </>
        ) : (
          'Войти анонимно (для тестирования)'
        )}
      </Button>
    </div>
  )
}
