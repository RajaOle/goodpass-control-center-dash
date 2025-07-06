export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string | null
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: number
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action_type?: string | null
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: number
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action_type?: string | null
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: number
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: []
      }
      api_credentials: {
        Row: {
          client_id: string | null
          client_secret: string | null
          created_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          client_secret?: string | null
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          client_secret?: string | null
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: []
      }
      auth_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          expires_at: string
          id: string
          ip_address: unknown | null
          last_accessed_at: string | null
          session_token: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          last_accessed_at?: string | null
          session_token: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          last_accessed_at?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          email: string
          id: number
          name: string
          npwp: string | null
          phone: string
          pic_name: string
          registration_number: string | null
          website: string | null
        }
        Insert: {
          email: string
          id?: number
          name: string
          npwp?: string | null
          phone: string
          pic_name: string
          registration_number?: string | null
          website?: string | null
        }
        Update: {
          email?: string
          id?: number
          name?: string
          npwp?: string | null
          phone?: string
          pic_name?: string
          registration_number?: string | null
          website?: string | null
        }
        Relationships: []
      }
      company_social_profiles: {
        Row: {
          company_id: number | null
          id: number
          platform: string | null
          profile_url: string | null
        }
        Insert: {
          company_id?: number | null
          id?: number
          platform?: string | null
          profile_url?: string | null
        }
        Update: {
          company_id?: number | null
          id?: number
          platform?: string | null
          profile_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_social_profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_packages: {
        Row: {
          credits: number | null
          id: number
          name: string | null
          price: number | null
        }
        Insert: {
          credits?: number | null
          id?: number
          name?: string | null
          price?: number | null
        }
        Update: {
          credits?: number | null
          id?: number
          name?: string | null
          price?: number | null
        }
        Relationships: []
      }
      import_logs: {
        Row: {
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: number
          import_type: string | null
          status: string | null
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: number
          import_type?: string | null
          status?: string | null
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: number
          import_type?: string | null
          status?: string | null
        }
        Relationships: []
      }
      kyc_verifications: {
        Row: {
          created_at: string | null
          id: number
          kyc_data: Json | null
          kyc_status: string | null
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          kyc_data?: Json | null
          kyc_status?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          kyc_data?: Json | null
          kyc_status?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: number
          is_read: boolean | null
          message: string | null
          read_at: string | null
          title: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      open_payments: {
        Row: {
          amount_paid: number
          id: number
          loan_info_id: number | null
          paid_at: string | null
          reportee_id: string | null
          reporter_id: string | null
        }
        Insert: {
          amount_paid: number
          id?: number
          loan_info_id?: number | null
          paid_at?: string | null
          reportee_id?: string | null
          reporter_id?: string | null
        }
        Update: {
          amount_paid?: number
          id?: number
          loan_info_id?: number | null
          paid_at?: string | null
          reportee_id?: string | null
          reporter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "open_payments_loan_info_id_fkey"
            columns: ["loan_info_id"]
            isOneToOne: false
            referencedRelation: "report_info"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          created_at: string | null
          email: string | null
          expires_at: string
          id: string
          otp_code: string
          otp_type: string
          phone: string | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          expires_at: string
          id?: string
          otp_code: string
          otp_type: string
          phone?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          expires_at?: string
          id?: string
          otp_code?: string
          otp_type?: string
          phone?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          email_verified: boolean | null
          full_name: string | null
          id: string
          phone: string | null
          phone_verified: boolean | null
          preferred_auth_method: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          id: string
          phone?: string | null
          phone_verified?: boolean | null
          preferred_auth_method?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          phone?: string | null
          phone_verified?: boolean | null
          preferred_auth_method?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      report_info: {
        Row: {
          amount: number | null
          id: number
          interest_rate: number | null
          purpose: string | null
          repayment_due_date: string | null
          repayment_frequency: number | null
          repayment_type: string
          term_months: number | null
        }
        Insert: {
          amount?: number | null
          id?: number
          interest_rate?: number | null
          purpose?: string | null
          repayment_due_date?: string | null
          repayment_frequency?: number | null
          repayment_type?: string
          term_months?: number | null
        }
        Update: {
          amount?: number | null
          id?: number
          interest_rate?: number | null
          purpose?: string | null
          repayment_due_date?: string | null
          repayment_frequency?: number | null
          repayment_type?: string
          term_months?: number | null
        }
        Relationships: []
      }
      reportee_bank_accounts: {
        Row: {
          account_holder_name: string | null
          account_number: string | null
          bank_name: string | null
          id: number
          reportee_info_id: number | null
        }
        Insert: {
          account_holder_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          id?: number
          reportee_info_id?: number | null
        }
        Update: {
          account_holder_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          id?: number
          reportee_info_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reportee_bank_accounts_reportee_info_id_fkey"
            columns: ["reportee_info_id"]
            isOneToOne: false
            referencedRelation: "reportee_info"
            referencedColumns: ["id"]
          },
        ]
      }
      reportee_info: {
        Row: {
          address: string | null
          driver_license_number: string | null
          email: string | null
          id: number
          ktp_number: string | null
          name: string
          passport_number: string | null
          phone: string
        }
        Insert: {
          address?: string | null
          driver_license_number?: string | null
          email?: string | null
          id?: number
          ktp_number?: string | null
          name: string
          passport_number?: string | null
          phone: string
        }
        Update: {
          address?: string | null
          driver_license_number?: string | null
          email?: string | null
          id?: number
          ktp_number?: string | null
          name?: string
          passport_number?: string | null
          phone?: string
        }
        Relationships: []
      }
      reportee_social_profiles: {
        Row: {
          id: number
          platform: string | null
          profile_url: string | null
          reportee_info_id: number | null
        }
        Insert: {
          id?: number
          platform?: string | null
          profile_url?: string | null
          reportee_info_id?: number | null
        }
        Update: {
          id?: number
          platform?: string | null
          profile_url?: string | null
          reportee_info_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reportee_social_profiles_reportee_info_id_fkey"
            columns: ["reportee_info_id"]
            isOneToOne: false
            referencedRelation: "reportee_info"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          backend_verification_required: boolean | null
          backend_verification_status: string | null
          created_at: string | null
          id: number
          loan_info_id: number | null
          progress_status: string | null
          report_code: string | null
          reportee_id: string | null
          reportee_info_id: number | null
          reporter_id: string | null
          review_notes: string | null
          supporting_document_id: number | null
          verification_status: string | null
        }
        Insert: {
          backend_verification_required?: boolean | null
          backend_verification_status?: string | null
          created_at?: string | null
          id?: number
          loan_info_id?: number | null
          progress_status?: string | null
          report_code?: string | null
          reportee_id?: string | null
          reportee_info_id?: number | null
          reporter_id?: string | null
          review_notes?: string | null
          supporting_document_id?: number | null
          verification_status?: string | null
        }
        Update: {
          backend_verification_required?: boolean | null
          backend_verification_status?: string | null
          created_at?: string | null
          id?: number
          loan_info_id?: number | null
          progress_status?: string | null
          report_code?: string | null
          reportee_id?: string | null
          reportee_info_id?: number | null
          reporter_id?: string | null
          review_notes?: string | null
          supporting_document_id?: number | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_loan_info_id_fkey"
            columns: ["loan_info_id"]
            isOneToOne: false
            referencedRelation: "report_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reportee_info_id_fkey"
            columns: ["reportee_info_id"]
            isOneToOne: false
            referencedRelation: "reportee_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_supporting_document_id_fkey"
            columns: ["supporting_document_id"]
            isOneToOne: false
            referencedRelation: "supporting_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      search_records: {
        Row: {
          created_at: string | null
          credit_deducted: boolean | null
          id: number
          result: Json | null
          search_params: Json | null
          search_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          credit_deducted?: boolean | null
          id?: number
          result?: Json | null
          search_params?: Json | null
          search_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          credit_deducted?: boolean | null
          id?: number
          result?: Json | null
          search_params?: Json | null
          search_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      supporting_documents: {
        Row: {
          description: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: number
          is_deleted: boolean | null
          uploaded_at: string | null
          uploaded_by: string | null
          version: number | null
        }
        Insert: {
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: number
          is_deleted?: boolean | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          version?: number | null
        }
        Update: {
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: number
          is_deleted?: boolean | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          version?: number | null
        }
        Relationships: []
      }
      third_party_reports: {
        Row: {
          created_at: string | null
          fetched_at: string | null
          id: number
          loan_info_id: number | null
          progress_status: string | null
          report_code: string | null
          reportee_info_id: number | null
          source_data: Json | null
          source_name: string
          source_reportee_id: string | null
          source_reporter_id: string | null
          supporting_document_id: number | null
          verification_status: string | null
        }
        Insert: {
          created_at?: string | null
          fetched_at?: string | null
          id?: never
          loan_info_id?: number | null
          progress_status?: string | null
          report_code?: string | null
          reportee_info_id?: number | null
          source_data?: Json | null
          source_name: string
          source_reportee_id?: string | null
          source_reporter_id?: string | null
          supporting_document_id?: number | null
          verification_status?: string | null
        }
        Update: {
          created_at?: string | null
          fetched_at?: string | null
          id?: never
          loan_info_id?: number | null
          progress_status?: string | null
          report_code?: string | null
          reportee_info_id?: number | null
          source_data?: Json | null
          source_name?: string
          source_reportee_id?: string | null
          source_reporter_id?: string | null
          supporting_document_id?: number | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "third_party_reports_loan_info_id_fkey"
            columns: ["loan_info_id"]
            isOneToOne: false
            referencedRelation: "report_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "third_party_reports_reportee_info_id_fkey"
            columns: ["reportee_info_id"]
            isOneToOne: false
            referencedRelation: "reportee_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "third_party_reports_supporting_document_id_fkey"
            columns: ["supporting_document_id"]
            isOneToOne: false
            referencedRelation: "supporting_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          credit_package_id: number | null
          credits_remaining: number | null
          id: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          credit_package_id?: number | null
          credits_remaining?: number | null
          id?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          credit_package_id?: number | null
          credits_remaining?: number | null
          id?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_credits_credit_package_id_fkey"
            columns: ["credit_package_id"]
            isOneToOne: false
            referencedRelation: "credit_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_kyc_completed: boolean | null
          phone: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          is_kyc_completed?: boolean | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_kyc_completed?: boolean | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      unified_reports: {
        Row: {
          backend_verification_required: boolean | null
          backend_verification_status: string | null
          created_at: string | null
          fetched_at: string | null
          id: number | null
          loan_info_id: number | null
          progress_status: string | null
          report_code: string | null
          report_source: string | null
          reportee_id: string | null
          reportee_info_id: number | null
          reporter_id: string | null
          review_notes: string | null
          source_data: Json | null
          source_name: string | null
          source_reportee_id: string | null
          source_reporter_id: string | null
          supporting_document_id: number | null
          verification_status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
