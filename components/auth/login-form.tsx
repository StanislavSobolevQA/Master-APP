'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Loader2 } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Проверьте вашу почту! Ссылка для входа отправлена.',
        })
        setEmail('')
      } else {
        // Преобразуем английские сообщения об ошибках в русские
        let errorText = 'Ошибка при отправке письма'
        if (data.error) {
          if (data.error.includes('Too many requests')) {
            errorText = 'Слишком много запросов. Попробуйте позже.'
          } else if (data.error.includes('Invalid email')) {
            errorText = 'Неверный email адрес'
          } else if (data.error.includes('not enabled')) {
            errorText = 'Email провайдер не настроен. Проверьте настройки Supabase.'
          } else if (data.error.includes('redirect')) {
            errorText = 'Неверный URL редиректа. Проверьте настройки.'
          } else if (data.error.includes('quota') || data.error.includes('Quota')) {
            errorText = 'Превышена квота проекта. Проверьте статус проекта в Supabase или используйте анонимный вход для тестирования.'
          } else if (data.error.includes('Failed to send')) {
            errorText = 'Не удалось отправить письмо. Проверьте настройки Email в Supabase или используйте анонимный вход.'
          } else {
            errorText = `Ошибка: ${data.error}`
          }
        }
        setMessage({
          type: 'error',
          text: errorText,
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Произошла ошибка. Попробуйте еще раз.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Отправка...
          </>
        ) : (
          'Отправить ссылку для входа'
        )}
      </Button>
    </form>
  )
}

