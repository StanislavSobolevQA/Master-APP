import { ProfileClient } from './profile-client'
import { Navbar } from '@/components/navbar'

export default async function ProfilePage() {
  // ВРЕМЕННО: убрана проверка авторизации
  
  return (
    <>
      <Navbar />
      <ProfileClient user={null} initialProfile={null} />
    </>
  )
}

