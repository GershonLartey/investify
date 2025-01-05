// Base types
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Table interfaces
interface InvestmentTable {
  Row: {
    amount: number
    created_at: string
    daily_interest: number | null
    end_date: string
    id: string
    start_date: string
    status: string
    updated_at: string
    user_id: string
  }
  Insert: {
    amount: number
    created_at?: string
    daily_interest?: number | null
    end_date: string
    id?: string
    start_date?: string
    status?: string
    updated_at?: string
    user_id: string
  }
  Update: {
    amount?: number
    created_at?: string
    daily_interest?: number | null
    end_date?: string
    id?: string
    start_date?: string
    status?: string
    updated_at?: string
    user_id?: string
  }
}

interface NotificationTable {
  Row: {
    created_at: string | null
    id: string
    is_broadcast: boolean | null
    message: string
    read: boolean | null
    title: string
    type: string | null
    updated_at: string | null
    user_id: string
  }
  Insert: {
    created_at?: string | null
    id?: string
    is_broadcast?: boolean | null
    message: string
    read?: boolean | null
    title: string
    type?: string | null
    updated_at?: string | null
    user_id: string
  }
  Update: {
    created_at?: string | null
    id?: string
    is_broadcast?: boolean | null
    message?: string
    read?: boolean | null
    title?: string
    type?: string | null
    updated_at?: string | null
    user_id?: string
  }
}

interface ProfileTable {
  Row: {
    avatar_url: string | null
    balance: number | null
    created_at: string
    id: string
    phone_number: string | null
    updated_at: string
    username: string | null
  }
  Insert: {
    avatar_url?: string | null
    balance?: number | null
    created_at?: string
    id: string
    phone_number?: string | null
    updated_at?: string
    username?: string | null
  }
  Update: {
    avatar_url?: string | null
    balance?: number | null
    created_at?: string
    id?: string
    phone_number?: string | null
    updated_at?: string
    username?: string | null
  }
}

interface SettingTable {
  Row: {
    created_at: string
    id: string
    key: string
    updated_at: string
    value: string
  }
  Insert: {
    created_at?: string
    id?: string
    key: string
    updated_at?: string
    value: string
  }
  Update: {
    created_at?: string
    id?: string
    key?: string
    updated_at?: string
    value?: string
  }
}

interface TransactionTable {
  Row: {
    account_name: string | null
    amount: number
    created_at: string
    id: string
    network: string | null
    phone_number: string | null
    status: string
    transaction_id: string | null
    type: string
    updated_at: string
    user_id: string
  }
  Insert: {
    account_name?: string | null
    amount: number
    created_at?: string
    id?: string
    network?: string | null
    phone_number?: string | null
    status?: string
    transaction_id?: string | null
    type: string
    updated_at?: string
    user_id: string
  }
  Update: {
    account_name?: string | null
    amount?: number
    created_at?: string
    id?: string
    network?: string | null
    phone_number?: string | null
    status?: string
    transaction_id?: string | null
    type?: string
    updated_at?: string
    user_id?: string
  }
}

interface WithdrawalSettingTable {
  Row: {
    created_at: string
    id: string
    is_active: boolean | null
    minimum_amount: number
    network: string
    updated_at: string
  }
  Insert: {
    created_at?: string
    id?: string
    is_active?: boolean | null
    minimum_amount?: number
    network: string
    updated_at?: string
  }
  Update: {
    created_at?: string
    id?: string
    is_active?: boolean | null
    minimum_amount?: number
    network?: string
    updated_at?: string
  }
}

// Database interface
export interface Database {
  public: {
    Tables: {
      investments: InvestmentTable
      notifications: NotificationTable
      profiles: ProfileTable
      settings: SettingTable
      transactions: TransactionTable
      withdrawal_settings: WithdrawalSettingTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_daily_investment_returns: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_and_update_investments: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_completed_investments: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']