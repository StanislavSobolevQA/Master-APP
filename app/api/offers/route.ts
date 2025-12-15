import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  
  // Проверка авторизации
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const body = await request.json()
  const { request_id } = body

  if (!request_id) {
    return NextResponse.json(
      { error: 'request_id is required' },
      { status: 400 }
    )
  }

  // Проверяем, что запрос существует и пользователь не автор
  const { data: requestData, error: fetchError } = await supabase
    .from('requests')
    .select('author_id, status')
    .eq('id', request_id)
    .single()

  if (fetchError || !requestData) {
    return NextResponse.json(
      { error: 'Request not found' },
      { status: 404 }
    )
  }

  if (requestData.author_id === user.id) {
    return NextResponse.json(
      { error: 'You cannot offer on your own request' },
      { status: 400 }
    )
  }

  if (requestData.status !== 'open') {
    return NextResponse.json(
      { error: 'Request is not open' },
      { status: 400 }
    )
  }

  // Проверяем, нет ли уже отклика
  const { data: existingOffer } = await supabase
    .from('offers')
    .select('id')
    .eq('request_id', request_id)
    .eq('helper_id', user.id)
    .single()

  if (existingOffer) {
    return NextResponse.json(
      { error: 'You have already offered on this request' },
      { status: 400 }
    )
  }

  // Создаем отклик
  const { data, error } = await supabase
    .from('offers')
    .insert({
      request_id,
      helper_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    const safeError = error.code === '23505'
      ? 'You have already offered on this request'
      : 'Failed to create offer'
    
    return NextResponse.json(
      { error: safeError },
      { status: 400 }
    )
  }

  // Обновляем статус запроса на in_progress (если это первый отклик)
  await supabase
    .from('requests')
    .update({ status: 'in_progress' })
    .eq('id', request_id)
    .eq('status', 'open')

  return NextResponse.json(data, { status: 201 })
}

