export interface User {
  id: string;
  username: string | null;
  balance: number | null;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  transaction_id: string | null;
  phone_number: string | null;
  network: string | null;
  account_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  amount: number;
  start_date: string;
  end_date: string;
  status: string;
  daily_interest: number | null;
  created_at: string;
  updated_at: string;
}