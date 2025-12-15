import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Временный endpoint для анонимной авторизации (только для разработки)
export async function POST() {
  try {
    const supabase = createClient()
    
    console.log('Attempting anonymous sign in...')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
    console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing')
    
    const { data, error } = await supabase.auth.signInAnonymously()

    if (error) {
      console.error('Anonymous auth error:', {
        message: error.message,
        status: error.status,
        code: error.code,
        name: error.name,
        fullError: JSON.stringify(error, null, 2)
      })
      
      let safeError = 'Failed to sign in anonymously'
      
      if (error.message?.includes('disabled') || error.message?.includes('not enabled')) {
        safeError = 'Anonymous sign-in is not enabled. Please enable it in Supabase Auth settings.'
      } else if (error.message?.includes('quota') || error.status === 403) {
        safeError = 'Project quota exceeded or anonymous auth disabled'
      } else if (error.message?.includes('configuration') || error.message?.includes('settings')) {
        safeError = 'Anonymous auth configuration error. Check Supabase Auth settings.'
      }
      
      // Логируем оригинальное сообщение для диагностики, но не возвращаем его (может содержать кириллицу)
      console.error('Original error message:', error.message)
      
      return NextResponse.json(
        { 
          error: safeError, 
          details: error.code || error.status
          // НЕ возвращаем error.message напрямую - может содержать кириллицу
        },
        { status: 400 }
      )
    }

    console.log('Anonymous sign in successful:', data.user?.id)

    // Убеждаемся, что профиль создан (триггер должен создать автоматически)
    // Но на всякий случай проверяем и создаем, если нужно
    if (data.user) {
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
      }
    }

    return NextResponse.json({ 
      user: data.user,
      message: 'Signed in anonymously'
    })
  } catch (error: any) {
    console.error('Unexpected error in anonymous auth:', error)
    // Проверяем, нет ли кириллицы в сообщении об ошибке
    const errorMessage = error?.message || 'Unknown error'
    const safeMessage = /[а-яё]/i.test(errorMessage) 
      ? 'Unexpected error occurred' 
      : errorMessage
    
    return NextResponse.json(
      { 
        error: 'Unexpected error occurred',
        details: safeMessage,
        // НЕ возвращаем stack - может содержать кириллицу
      },
      { status: 500 }
    )
  }
}
