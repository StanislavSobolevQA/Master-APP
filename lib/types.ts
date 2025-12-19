import type { Category, Urgency, RewardType, ContactType, Status, District } from './constants'

// Строгие типы на основе констант
export type { Category, Urgency, RewardType, ContactType, Status, District }

export interface Request {
  id: string
  author_id: string
  title: string
  description: string
  category: Category
  urgency: Urgency
  reward_type: RewardType
  reward_amount: number | null
  district: District
  status: Status
  contact_type: ContactType
  contact_value?: string // Опционально для безопасности (не передаем в клиентские компоненты)
  created_at: string
}

// Тип для запросов без конфиденциальных данных (для передачи в клиентские компоненты)
export type SafeRequest = Omit<Request, 'contact_value'>

export interface Offer {
  id: string
  request_id: string
  helper_id: string
  created_at: string
}

export interface Profile {
  id: string
  display_name: string | null
  district: District | null
  telegram: string | null
  created_at: string
}

// Типизированные ответы API
export type ApiResponse<T> = 
  | { data: T; error: null }
  | { data: null; error: { message: string; code?: string } }

// Пагинация
export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}



