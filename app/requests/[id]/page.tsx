import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { RequestViewClient } from './request-view-client'
import { Navbar } from '@/components/navbar'

export default async function RequestPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Загружаем запрос
  const { data: request, error } = await supabase
    .from('requests')
    .select(`
      *,
      profiles:author_id (
        display_name,
        district
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !request) {
    notFound()
  }

  // Проверяем, может ли пользователь видеть этот запрос
  if (request.status !== 'open' && request.author_id !== user?.id) {
    notFound()
  }

  // Загружаем отклики, если пользователь - автор
  let offers = []
  if (user && request.author_id === user.id) {
    const { data } = await supabase
      .from('offers')
      .select(`
        id,
        created_at,
        profiles:helper_id (
          display_name,
          telegram
        )
      `)
      .eq('request_id', params.id)
      .order('created_at', { ascending: false })

    offers = data || []
  }

  return (
    <>
      <Navbar />
      <RequestViewClient
        request={request}
        offers={offers}
        isAuthor={user?.id === request.author_id}
        userId={user?.id}
      />
    </>
  )
}

