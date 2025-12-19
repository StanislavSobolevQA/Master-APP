import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RequestViewClient } from './request-view-client'
import { Navbar } from '@/components/navbar'
import { getRequestById, getOffers } from '@/app/actions/requests'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const request = await getRequestById(params.id)
  
  if (!request) {
    return {
      title: 'Запрос не найден | Рядом',
      description: 'Запрошенная страница не найдена'
    }
  }

  const description = request.description.length > 160 
    ? request.description.substring(0, 157) + '...'
    : request.description

  return {
    title: `${request.title} | Рядом`,
    description,
    openGraph: {
      title: request.title,
      description,
      type: 'website',
      siteName: 'Рядом',
      locale: 'ru_RU',
    },
    twitter: {
      card: 'summary',
      title: request.title,
      description,
    },
    alternates: {
      canonical: `/requests/${params.id}`
    }
  }
}

export default async function RequestPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const request = await getRequestById(params.id)

  if (!request) {
    notFound()
  }

  let offers: any[] = []
  if (user && user.id === request.author_id) {
    offers = await getOffers(request.id)
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
