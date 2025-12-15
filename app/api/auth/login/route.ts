import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    )
  }

  const supabase = createClient()
  
  // Проверяем переменные окружения
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const redirectUrl = `${siteUrl}/auth/callback`
  
  console.log('Attempting to send magic link:', { email, redirectUrl })
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
    },
  })

  if (error) {
    // Преобразуем ошибку в безопасный формат (без кириллицы)
    console.error('Supabase auth error:', {
      message: error.message,
      status: error.status,
      code: error.code,
      name: error.name
    })
    
    let safeError = 'Failed to send login link. Please try again.'
    
    // Обработка конкретных ошибок
    if (error.message?.includes('rate limit') || error.status === 429) {
      safeError = 'Too many requests. Please try again later.'
    } else if (error.message?.includes('invalid') || error.message?.includes('email')) {
      safeError = 'Invalid email address'
    } else if (error.message?.includes('disabled') || error.message?.includes('not enabled')) {
      safeError = 'Email provider is not enabled. Please check Supabase settings.'
    } else if (error.message?.includes('redirect')) {
      safeError = 'Invalid redirect URL. Please check configuration.'
    } else if (error.status === 403 || error.message?.includes('Quota') || error.message?.includes('quotaExceeded')) {
      safeError = 'Project quota exceeded. Please check Supabase project status or use anonymous login for testing.'
    }
    
    return NextResponse.json(
      { error: safeError, details: error.code || error.status },
      { status: 400 }
    )
  }
  
  console.log('Magic link sent successfully:', data)

  return NextResponse.json({ 
    message: 'Check your email for the login link!' 
  })
}

