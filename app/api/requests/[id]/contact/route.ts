import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  
  // Проверка авторизации
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { id } = params

  // Используем функцию для безопасного получения контакта
  const { data, error } = await supabase.rpc('get_request_contact', {
    request_uuid: id,
  })

  if (error) {
    console.error('Supabase error:', error)
    const safeError = error.code === 'PGRST116'
      ? 'Contact not available. Create an offer first.'
      : 'Failed to get contact'
    
    return NextResponse.json(
      { error: safeError },
      { status: 400 }
    )
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: 'Contact not available. You need to create an offer first.' },
      { status: 403 }
    )
  }

  return NextResponse.json(data[0])
}

