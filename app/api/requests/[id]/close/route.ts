import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
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

  // Проверяем, что пользователь - автор запроса
  const { data: requestData, error: fetchError } = await supabase
    .from('requests')
    .select('author_id')
    .eq('id', id)
    .single()

  if (fetchError || !requestData) {
    return NextResponse.json(
      { error: 'Request not found' },
      { status: 404 }
    )
  }

  if (requestData.author_id !== user.id) {
    return NextResponse.json(
      { error: 'Forbidden: Only author can close the request' },
      { status: 403 }
    )
  }

  // Обновляем статус
  const { data, error } = await supabase
    .from('requests')
    .update({ status: 'closed' })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json(
      { error: 'Failed to close request' },
      { status: 400 }
    )
  }

  const { contact_value: _, ...safeData } = data

  return NextResponse.json(safeData)
}

