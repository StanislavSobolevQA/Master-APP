import { Navbar } from '@/components/navbar'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  // ВРЕМЕННО: просто редирект на dashboard
  redirect('/dashboard')

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Вход в систему</h1>
            <p className="mt-2 text-gray-600">
              Введите ваш email, и мы отправим ссылку для входа
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <LoginForm />
            <AnonymousLogin />
          </div>
          <p className="text-center text-sm text-gray-600">
            Нет аккаунта? Введите email и мы создадим его автоматически
          </p>
        </div>
      </div>
    </>
  )
}

