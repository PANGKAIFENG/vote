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
      agent_scores: {
        Row: {
          agent_id: string
          coverage_score: number
          created_at: string
          customer_example: string | null
          frequency_score: number
          id: string
          most_important_step: string | null
          paid_reason: string | null
          pain_score: number
          purchase_or_upsell_score: number
          respondent_id: string
          result_usability_score: number
        }
        Insert: {
          agent_id: string
          coverage_score: number
          created_at?: string
          customer_example?: string | null
          frequency_score: number
          id?: string
          most_important_step?: string | null
          paid_reason?: string | null
          pain_score: number
          purchase_or_upsell_score: number
          respondent_id: string
          result_usability_score: number
        }
        Update: {
          agent_id?: string
          coverage_score?: number
          created_at?: string
          customer_example?: string | null
          frequency_score?: number
          id?: string
          most_important_step?: string | null
          paid_reason?: string | null
          pain_score?: number
          purchase_or_upsell_score?: number
          respondent_id?: string
          result_usability_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_scores_respondent_id_fkey"
            columns: ["respondent_id"]
            referencedRelation: "respondents"
            referencedColumns: ["id"]
          },
        ]
      }
      new_agent_suggestions: {
        Row: {
          agent_name: string | null
          business_scene: string | null
          created_at: string
          expected_output: string | null
          has_suggestion: boolean
          id: string
          input_materials: string | null
          respondent_id: string
          target_user: string | null
          why_customer_pay: string | null
        }
        Insert: {
          agent_name?: string | null
          business_scene?: string | null
          created_at?: string
          expected_output?: string | null
          has_suggestion: boolean
          id?: string
          input_materials?: string | null
          respondent_id: string
          target_user?: string | null
          why_customer_pay?: string | null
        }
        Update: {
          agent_name?: string | null
          business_scene?: string | null
          created_at?: string
          expected_output?: string | null
          has_suggestion?: boolean
          id?: string
          input_materials?: string | null
          respondent_id?: string
          target_user?: string | null
          why_customer_pay?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "new_agent_suggestions_respondent_id_fkey"
            columns: ["respondent_id"]
            referencedRelation: "respondents"
            referencedColumns: ["id"]
          },
        ]
      }
      rankings: {
        Row: {
          created_at: string
          id: string
          rank_1_agent_id: string
          rank_2_agent_id: string
          rank_3_agent_id: string
          ranking_reason: string | null
          respondent_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rank_1_agent_id: string
          rank_2_agent_id: string
          rank_3_agent_id: string
          ranking_reason?: string | null
          respondent_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rank_1_agent_id?: string
          rank_2_agent_id?: string
          rank_3_agent_id?: string
          ranking_reason?: string | null
          respondent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rankings_respondent_id_fkey"
            columns: ["respondent_id"]
            referencedRelation: "respondents"
            referencedColumns: ["id"]
          },
        ]
      }
      respondents: {
        Row: {
          created_at: string
          customer_types: string[]
          department: string | null
          id: string
          name: string
          role: string
          willing_to_interview: boolean | null
        }
        Insert: {
          created_at?: string
          customer_types?: string[]
          department?: string | null
          id?: string
          name: string
          role: string
          willing_to_interview?: boolean | null
        }
        Update: {
          created_at?: string
          customer_types?: string[]
          department?: string | null
          id?: string
          name?: string
          role?: string
          willing_to_interview?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_rdsvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfrabitq_vector_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      rds_float_normalize_i16: {
        Args: { "": unknown }
        Returns: unknown
      }
      rds_vector_norm: {
        Args: { "": string }
        Returns: number
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
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
