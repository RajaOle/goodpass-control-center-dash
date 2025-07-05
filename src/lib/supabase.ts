import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nnkeqdvbkudgfrtkskae.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ua2VxZHZia3VkZ2ZydGtza2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0OTg2NDAsImV4cCI6MjA2NjA3NDY0MH0.w3m6GCKqD0ES87NEzA4Qhv-OiC3bDIz8P9zbCMA1h-c' // You'll need to get this from your Supabase dashboard

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Default admin credentials
export const DEFAULT_ADMIN_CREDENTIALS = {
  email: 'virtue.appscore@gmail.com',
  password: 'OpenOpen123!!'
}

// Role types
export type UserRole = 'superadmin' | 'admin' | 'moderator' | 'viewer'

// User profile interface
export interface UserProfile {
  id: string
  role: UserRole
  status: string
  is_kyc_completed: boolean
  phone: string
  created_at: string
  updated_at: string
} 