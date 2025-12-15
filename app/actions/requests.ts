'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getRequests(filters: {
  district?: string
  category?: string
  urgency?: string
  paidOnly?: boolean
  search?: string
  status?: string
  type?: 'need' | 'offer'
}) {
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
    .eq('status', filters.status || 'open')
    .order('created_at', { ascending: false })

  if (filters.district && filters.district !== 'Все районы') {
    query = query.eq('district', filters.district)
  }

  if (filters.category && filters.category !== 'Все категории') {
    query = query.eq('category', filters.category)
  }

  if (filters.urgency && filters.urgency !== 'all') {
    query = query.eq('urgency', filters.urgency)
  }

  if (filters.paidOnly) {
    query = query.eq('reward_type', 'money')
  }

  if (filters.search) {
    query = query.textSearch('title,description', filters.search, {
      type: 'websearch',
      config: 'russian',
    })
  }

  const { data, error } = await query

  if (error) {
    // Преобразуем ошибку в безопасный формат
    const errorMsg = error.message || 'Database error'
    console.error('Supabase error:', error)
    throw new Error(`Database query failed: ${error.code || 'unknown'}`)
  }

  // Убираем contact_value
  return data?.map(({ contact_value, ...rest }) => rest) || []
}

export async function createRequest(formData: {
  title: string
  description: string
  category: string
  urgency: string
  reward_type: 'thanks' | 'money'
  reward_amount?: number
  district: string
  contact_type: 'telegram' | 'phone'
  contact_value: string
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('requests')
    .insert({
      author_id: user.id,
      ...formData,
      reward_amount: formData.reward_type === 'money' ? formData.reward_amount : null,
      status: 'open',
    })
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    throw new Error(`Failed to create request: ${error.code || 'unknown'}`)
  }

  revalidatePath('/dashboard')
  revalidatePath('/')

  const { contact_value: _, ...safeData } = data
  return safeData
}

export async function getRequestContact(requestId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase.rpc('get_request_contact', {
    request_uuid: requestId,
  })

  if (error) {
    console.error('Supabase error:', error)
    throw new Error(`Failed to get contact: ${error.code || 'unknown'}`)
  }

  if (!data || data.length === 0) {
    throw new Error('Contact not available. Create an offer first.')
  }

  return data[0]
}

export async function createOffer(requestId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  // Проверяем, что пользователь не автор
  const { data: requestData } = await supabase
    .from('requests')
    .select('author_id, status')
    .eq('id', requestId)
    .single()

  if (!requestData) {
    throw new Error('Request not found')
  }

  if (requestData.author_id === user.id) {
    throw new Error('You cannot offer on your own request')
  }

  if (requestData.status !== 'open') {
    throw new Error('Request is not open')
  }

  const { data, error } = await supabase
    .from('offers')
    .insert({
      request_id: requestId,
      helper_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    throw new Error(`Failed to create offer: ${error.code || 'unknown'}`)
  }

  // Обновляем статус на in_progress
  await supabase
    .from('requests')
    .update({ status: 'in_progress' })
    .eq('id', requestId)
    .eq('status', 'open')

  revalidatePath('/dashboard')
  revalidatePath('/')

  return data
}

export async function closeRequest(requestId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  // Проверяем, что пользователь - автор
  const { data: requestData } = await supabase
    .from('requests')
    .select('author_id')
    .eq('id', requestId)
    .single()

  if (!requestData || requestData.author_id !== user.id) {
    throw new Error('Forbidden')
  }

  const { data, error } = await supabase
    .from('requests')
    .update({ status: 'closed' })
    .eq('id', requestId)
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    throw new Error(`Failed to close request: ${error.code || 'unknown'}`)
  }

  revalidatePath('/dashboard')
  revalidatePath('/')

  const { contact_value: _, ...safeData } = data
  return safeData
}

