import { CreateRequestClient } from './create-request-client'
import { Navbar } from '@/components/navbar'

export default async function CreateRequestPage() {
  // ВРЕМЕННО: убрана проверка авторизации
  
  return (
    <>
      <Navbar />
      <CreateRequestClient userDistrict={undefined} />
    </>
  )
}

