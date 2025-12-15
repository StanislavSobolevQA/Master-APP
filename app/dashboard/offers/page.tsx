import { MyOffersClient } from './my-offers-client'
import { Navbar } from '@/components/navbar'

export default async function MyOffersPage() {
  // ВРЕМЕННО: убрана проверка авторизации
  
  return (
    <>
      <Navbar />
      <MyOffersClient initialOffers={[]} />
    </>
  )
}

