export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          district: string | null
          telegram: string | null
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          district?: string | null
          telegram?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          district?: string | null
          telegram?: string | null
          created_at?: string
        }
      }
      requests: {
        Row: {
          id: string
          author_id: string
          title: string
          description: string
          category: string
          urgency: string
          reward_type: 'thanks' | 'money'
          reward_amount: number | null
          district: string
          status: 'open' | 'in_progress' | 'closed'
          contact_type: 'telegram' | 'phone'
          contact_value: string
          created_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          description: string
          category: string
          urgency: string
          reward_type: 'thanks' | 'money'
          reward_amount?: number | null
          district: string
          status?: 'open' | 'in_progress' | 'closed'
          contact_type: 'telegram' | 'phone'
          contact_value: string
          created_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          description?: string
          category?: string
          urgency?: string
          reward_type?: 'thanks' | 'money'
          reward_amount?: number | null
          district?: string
          status?: 'open' | 'in_progress' | 'closed'
          contact_type?: 'telegram' | 'phone'
          contact_value?: string
          created_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          request_id: string
          helper_id: string
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          helper_id: string
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          helper_id?: string
          created_at?: string
        }
      }
    }
    Functions: {
      get_request_contact: {
        Args: {
          request_uuid: string
        }
        Returns: {
          contact_type: string
          contact_value: string
        }[]
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Request = Database['public']['Tables']['requests']['Row']
export type Offer = Database['public']['Tables']['offers']['Row']

export type RequestInsert = Database['public']['Tables']['requests']['Insert']
export type OfferInsert = Database['public']['Tables']['offers']['Insert']

