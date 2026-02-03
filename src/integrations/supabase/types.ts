export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      coin_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          profile_id: string
          transaction_type: string
          video_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          profile_id: string
          transaction_type: string
          video_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          profile_id?: string
          transaction_type?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coin_transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coin_transactions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_requests: {
        Row: {
          coins_amount: number
          created_at: string
          id: string
          paise_amount: number
          processed_at: string | null
          profile_id: string
          status: string
          upi_id: string
        }
        Insert: {
          coins_amount: number
          created_at?: string
          id?: string
          paise_amount: number
          processed_at?: string | null
          profile_id: string
          status?: string
          upi_id: string
        }
        Update: {
          coins_amount?: number
          created_at?: string
          id?: string
          paise_amount?: number
          processed_at?: string | null
          profile_id?: string
          status?: string
          upi_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          coins_balance: number
          created_at: string
          display_name: string
          id: string
          is_creator: boolean
          phone: string | null
          total_earnings_paise: number
          updated_at: string
          upi_id: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          coins_balance?: number
          created_at?: string
          display_name: string
          id?: string
          is_creator?: boolean
          phone?: string | null
          total_earnings_paise?: number
          updated_at?: string
          upi_id?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          coins_balance?: number
          created_at?: string
          display_name?: string
          id?: string
          is_creator?: boolean
          phone?: string | null
          total_earnings_paise?: number
          updated_at?: string
          upi_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_likes: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_views: {
        Row: {
          coins_awarded: boolean
          id: string
          video_id: string
          viewer_id: string | null
          viewer_ip: string | null
          watched_at: string
        }
        Insert: {
          coins_awarded?: boolean
          id?: string
          video_id: string
          viewer_id?: string | null
          viewer_ip?: string | null
          watched_at?: string
        }
        Update: {
          coins_awarded?: boolean
          id?: string
          video_id?: string
          viewer_id?: string | null
          viewer_ip?: string | null
          watched_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_views_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          category: Database["public"]["Enums"]["video_category"]
          cloudinary_public_id: string
          cloudinary_url: string
          created_at: string
          creator_id: string
          description: string | null
          duration_seconds: number
          id: string
          is_published: boolean
          likes_count: number
          thumbnail_url: string | null
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          category: Database["public"]["Enums"]["video_category"]
          cloudinary_public_id: string
          cloudinary_url: string
          created_at?: string
          creator_id: string
          description?: string | null
          duration_seconds: number
          id?: string
          is_published?: boolean
          likes_count?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          category?: Database["public"]["Enums"]["video_category"]
          cloudinary_public_id?: string
          cloudinary_url?: string
          created_at?: string
          creator_id?: string
          description?: string | null
          duration_seconds?: number
          id?: string
          is_published?: boolean
          likes_count?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "videos_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "creator" | "user"
      video_category: "drama" | "horror" | "comedy" | "romance"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "creator", "user"],
      video_category: ["drama", "horror", "comedy", "romance"],
    },
  },
} as const
