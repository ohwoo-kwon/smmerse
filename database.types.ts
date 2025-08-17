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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      basketball_game_participants: {
        Row: {
          basketball_game_id: number
          created_at: string
          participant_id: number
          profile_id: string
          status: string
          updated_at: string
        }
        Insert: {
          basketball_game_id: number
          created_at?: string
          participant_id?: number
          profile_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          basketball_game_id?: number
          created_at?: string
          participant_id?: number
          profile_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "basketball_game_participants_basketball_game_id_basketball_game"
            columns: ["basketball_game_id"]
            isOneToOne: false
            referencedRelation: "basketball_games"
            referencedColumns: ["basketball_game_id"]
          },
          {
            foreignKeyName: "basketball_game_participants_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      basketball_games: {
        Row: {
          address: string
          basketball_game_id: number
          city: string
          created_at: string
          date: string
          description: string | null
          end_time: string
          fee: number
          gender_type: Database["public"]["Enums"]["gender_type"]
          link: string | null
          max_participants: number
          min_participants: number
          profile_id: string | null
          sido: string
          skill_level: Database["public"]["Enums"]["basketball_skill_level"]
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          address: string
          basketball_game_id?: never
          city: string
          created_at?: string
          date: string
          description?: string | null
          end_time: string
          fee: number
          gender_type?: Database["public"]["Enums"]["gender_type"]
          link?: string | null
          max_participants: number
          min_participants?: number
          profile_id?: string | null
          sido: string
          skill_level: Database["public"]["Enums"]["basketball_skill_level"]
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          address?: string
          basketball_game_id?: never
          city?: string
          created_at?: string
          date?: string
          description?: string | null
          end_time?: string
          fee?: number
          gender_type?: Database["public"]["Enums"]["gender_type"]
          link?: string | null
          max_participants?: number
          min_participants?: number
          profile_id?: string | null
          sido?: string
          skill_level?: Database["public"]["Enums"]["basketball_skill_level"]
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "basketball_games_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      chat_room_members: {
        Row: {
          chat_room_id: number
          createdAt: string
          profile_id: string
        }
        Insert: {
          chat_room_id: number
          createdAt?: string
          profile_id: string
        }
        Update: {
          chat_room_id?: number
          createdAt?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_members_chat_room_id_chat_rooms_chat_room_id_fk"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["chat_room_id"]
          },
          {
            foreignKeyName: "chat_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          chat_room_id: number
          createdAt: string
        }
        Insert: {
          chat_room_id?: never
          createdAt?: string
        }
        Update: {
          chat_room_id?: never
          createdAt?: string
        }
        Relationships: []
      }
      chats: {
        Row: {
          chat_id: number
          chat_room_id: number
          content: string
          createdAt: string
          sender_id: string
        }
        Insert: {
          chat_id?: never
          chat_room_id: number
          content: string
          createdAt?: string
          sender_id: string
        }
        Update: {
          chat_id?: never
          chat_room_id?: number
          content?: string
          createdAt?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_chat_room_id_chat_rooms_chat_room_id_fk"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["chat_room_id"]
          },
          {
            foreignKeyName: "chats_sender_id_profiles_profile_id_fk"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth: string | null
          created_at: string
          height: number | null
          name: string
          position: string[] | null
          profile_id: string
          sex: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          birth?: string | null
          created_at?: string
          height?: number | null
          name: string
          position?: string[] | null
          profile_id: string
          sex?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          birth?: string | null
          created_at?: string
          height?: number | null
          name?: string
          position?: string[] | null
          profile_id?: string
          sex?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      chats_view: {
        Row: {
          avatar_url: string | null
          chat_room_id: number | null
          last_message: string | null
          last_message_time: string | null
          last_sender_name: string | null
          name: string | null
          other_profile_id: string | null
          profile_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_members_chat_room_id_chat_rooms_chat_room_id_fk"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["chat_room_id"]
          },
          {
            foreignKeyName: "chat_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "chat_room_members_profile_id_profiles_profile_id_fk"
            columns: ["other_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
    }
    Functions: {
      get_room: {
        Args: { from_user_id: string; to_user_id: string }
        Returns: {
          chat_room_id: number
        }[]
      }
    }
    Enums: {
      basketball_skill_level:
        | "level_0"
        | "level_1"
        | "level_2"
        | "level_3"
        | "level_4"
        | "level_5"
      gender_type: "male" | "female" | "mixed"
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
      basketball_skill_level: [
        "level_0",
        "level_1",
        "level_2",
        "level_3",
        "level_4",
        "level_5",
      ],
      gender_type: ["male", "female", "mixed"],
    },
  },
} as const
