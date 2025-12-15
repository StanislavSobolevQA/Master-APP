import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Создаем singleton для клиентского Supabase клиента
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  // Если клиент уже создан, возвращаем его
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables. Check your .env.local file.')
  }

  // Используем обычный createClient из @supabase/supabase-js для браузера
  supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })

  return supabaseClient
}

