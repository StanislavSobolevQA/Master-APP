import { CreateRequestClient } from './create-request-client'
import { Navbar } from '@/components/navbar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserProfile } from '@/app/actions/requests'
import { logger } from '@/lib/logger'

export default async function CreateRequestPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Загружаем профиль пользователя для получения района
  let userDistrict: string | undefined
  try {
    const profile = await getUserProfile(user.id)
    userDistrict = profile?.district
  } catch (error) {
    logger.error('Error loading user profile', error, { userId: user.id })
  }
  
  return (
    <>
      <Navbar />
      <CreateRequestClient userDistrict={userDistrict} />
    </>
  )
}

