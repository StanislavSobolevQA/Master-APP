import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const district = searchParams.get('district')
  const category = searchParams.get('category')
  const urgency = searchParams.get('urgency')
  const paidOnly = searchParams.get('paid_only') === 'true'
  const q = searchParams.get('q')
  const status = searchParams.get('status') || 'open'
  const type = searchParams.get('type') // 'need' or 'offer'

  const supabase = createClient()

  let query = supabase
    .from('requests')
    .select(`
      id,
      author_id,
      title,
      description,
      category,
      urgency,
      reward_type,
      reward_amount,
      district,
      status,
      contact_type,
      created_at,
      profiles:author_id (
        display_name,
        district
      )
    `)
    .eq('status', status)
    .order('created_at', { ascending: false })

  // Фильтры
  if (district && district !== 'Все районы') {
    query = query.eq('district', district)
  }

  if (category && category !== 'Все категории') {
    query = query.eq('category', category)
  }

  if (urgency && urgency !== 'all') {
    query = query.eq('urgency', urgency)
  }

  if (paidOnly) {
    query = query.eq('reward_type', 'money')
  }

  // Полнотекстовый поиск
  if (q) {
    query = query.textSearch('title,description', q, {
      type: 'websearch',
      config: 'russian',
    })
  }

  const { data, error } = await query

  if (error) {
    console.error('Supabase error:', error)
    const safeError = error.code === 'PGRST116' 
      ? 'No rows found'
      : error.code === '23505'
      ? 'Duplicate entry'
      : 'Database query failed'
    
    return NextResponse.json(
      { error: safeError },
      { status: 400 }
    )
  }

  // Убираем contact_value из ответа (безопасность)
  const safeData = data?.map(({ contact_value, ...rest }) => rest) || []

  return NextResponse.json(safeData)
}

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
  const {
    title,
    description,
    category,
    urgency,
    reward_type,
    reward_amount,
    district,
    contact_type,
    contact_value,
  } = body

  // Простая валидация
  if (!title || !description || !category || !urgency || !district || !contact_value) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  if (reward_type === 'money' && !reward_amount) {
    return NextResponse.json(
      { error: 'reward_amount is required for money rewards' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('requests')
    .insert({
      author_id: user.id,
      title,
      description,
      category,
      urgency,
      reward_type,
      reward_amount: reward_type === 'money' ? reward_amount : null,
      district,
      contact_type,
      contact_value,
      status: 'open',
    })
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    const safeError = error.code === '23505'
      ? 'Duplicate entry'
      : error.code === '23503'
      ? 'Invalid reference'
      : 'Failed to create request'
    
    return NextResponse.json(
      { error: safeError },
      { status: 400 }
    )
  }

  // Убираем contact_value из ответа
  const { contact_value: _, ...safeData } = data

  return NextResponse.json(safeData, { status: 201 })
}

