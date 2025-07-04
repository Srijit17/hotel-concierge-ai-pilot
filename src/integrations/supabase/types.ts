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
      bookings: {
        Row: {
          check_in: string
          check_out: string
          created_at: string | null
          guests: number | null
          id: string
          profile_id: string | null
          room_type: string
          session_id: string | null
          status: string | null
          total_amount: number | null
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string | null
          guests?: number | null
          id?: string
          profile_id?: string | null
          room_type: string
          session_id?: string | null
          status?: string | null
          total_amount?: number | null
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string | null
          guests?: number | null
          id?: string
          profile_id?: string | null
          room_type?: string
          session_id?: string | null
          status?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_bookings: {
        Row: {
          booking_number: string
          check_in: string
          check_out: string
          created_at: string | null
          email: string | null
          guest_name: string
          guests_count: number | null
          phone: string | null
          preferences: Json | null
          room_number: string | null
          room_type: string
          services_used: Json | null
          special_requests: string | null
          status: string | null
          stay_purpose: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          booking_number: string
          check_in: string
          check_out: string
          created_at?: string | null
          email?: string | null
          guest_name: string
          guests_count?: number | null
          phone?: string | null
          preferences?: Json | null
          room_number?: string | null
          room_type: string
          services_used?: Json | null
          special_requests?: string | null
          status?: string | null
          stay_purpose?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          booking_number?: string
          check_in?: string
          check_out?: string
          created_at?: string | null
          email?: string | null
          guest_name?: string
          guests_count?: number | null
          phone?: string | null
          preferences?: Json | null
          room_number?: string | null
          room_type?: string
          services_used?: Json | null
          special_requests?: string | null
          status?: string | null
          stay_purpose?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          confidence: number | null
          content: string
          entities: Json | null
          id: number
          intent: string | null
          sender: string | null
          session_id: string | null
          timestamp: string | null
        }
        Insert: {
          confidence?: number | null
          content: string
          entities?: Json | null
          id?: number
          intent?: string | null
          sender?: string | null
          session_id?: string | null
          timestamp?: string | null
        }
        Update: {
          confidence?: number | null
          content?: string
          entities?: Json | null
          id?: number
          intent?: string | null
          sender?: string | null
          session_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          delivery_time: string | null
          id: string
          items: Json
          profile_id: string | null
          room_number: string | null
          session_id: string | null
          status: string | null
          total_amount: number | null
        }
        Insert: {
          created_at?: string | null
          delivery_time?: string | null
          id?: string
          items: Json
          profile_id?: string | null
          room_number?: string | null
          session_id?: string | null
          status?: string | null
          total_amount?: number | null
        }
        Update: {
          created_at?: string | null
          delivery_time?: string | null
          id?: string
          items?: Json
          profile_id?: string | null
          room_number?: string | null
          session_id?: string | null
          status?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          guest_name: string | null
          id: string
          loyalty_tier: string | null
          phone: string | null
          preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          guest_name?: string | null
          id?: string
          loyalty_tier?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          guest_name?: string | null
          id?: string
          loyalty_tier?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          available: boolean | null
          created_at: string | null
          features: string[] | null
          id: string
          image_url: string | null
          max_guests: number | null
          name: string
          price_per_night: number
          type: string
        }
        Insert: {
          available?: boolean | null
          created_at?: string | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          max_guests?: number | null
          name: string
          price_per_night: number
          type: string
        }
        Update: {
          available?: boolean | null
          created_at?: string | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          max_guests?: number | null
          name?: string
          price_per_night?: number
          type?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          channel: string | null
          ended_at: string | null
          id: string
          profile_id: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          channel?: string | null
          ended_at?: string | null
          id?: string
          profile_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          channel?: string | null
          ended_at?: string | null
          id?: string
          profile_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["profile_id"]
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
      [_ in never]: never
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
