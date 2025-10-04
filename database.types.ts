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
          is_checked: boolean
          sender_id: string
        }
        Insert: {
          chat_id?: never
          chat_room_id: number
          content: string
          createdAt?: string
          is_checked?: boolean
          sender_id: string
        }
        Update: {
          chat_id?: never
          chat_room_id?: number
          content?: string
          createdAt?: string
          is_checked?: boolean
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
      game_participants: {
        Row: {
          created_at: string
          game_id: number
          participant_id: number
          profile_id: string
          status: Database["public"]["Enums"]["participant_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          game_id: number
          participant_id?: number
          profile_id: string
          status?: Database["public"]["Enums"]["participant_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          game_id?: number
          participant_id?: number
          profile_id?: string
          status?: Database["public"]["Enums"]["participant_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_participants_game_id_games_game_id_fk"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "game_participants_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      games: {
        Row: {
          center: boolean | null
          created_at: string
          description: string | null
          fee: number
          forward: boolean | null
          game_gender_type: Database["public"]["Enums"]["game_gender_type"]
          game_id: number
          game_time: Database["public"]["Enums"]["game_time_type"]
          game_type: Database["public"]["Enums"]["game_type"]
          guard: boolean | null
          gym_id: string
          max_participants: number
          min_participants: number
          profile_id: string
          start_date: string
          start_time: string
          updated_at: string
        }
        Insert: {
          center?: boolean | null
          created_at?: string
          description?: string | null
          fee: number
          forward?: boolean | null
          game_gender_type: Database["public"]["Enums"]["game_gender_type"]
          game_id?: never
          game_time: Database["public"]["Enums"]["game_time_type"]
          game_type: Database["public"]["Enums"]["game_type"]
          guard?: boolean | null
          gym_id: string
          max_participants: number
          min_participants: number
          profile_id: string
          start_date: string
          start_time: string
          updated_at?: string
        }
        Update: {
          center?: boolean | null
          created_at?: string
          description?: string | null
          fee?: number
          forward?: boolean | null
          game_gender_type?: Database["public"]["Enums"]["game_gender_type"]
          game_id?: never
          game_time?: Database["public"]["Enums"]["game_time_type"]
          game_type?: Database["public"]["Enums"]["game_type"]
          guard?: boolean | null
          gym_id?: string
          max_participants?: number
          min_participants?: number
          profile_id?: string
          start_date?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_gym_id_gyms_gym_id_fk"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["gym_id"]
          },
          {
            foreignKeyName: "games_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      gym_photos: {
        Row: {
          created_at: string
          gym_id: string
          gym_photo_id: number
          url: string
        }
        Insert: {
          created_at?: string
          gym_id: string
          gym_photo_id?: number
          url: string
        }
        Update: {
          created_at?: string
          gym_id?: string
          gym_photo_id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gym_photos_gym_id_gyms_gym_id_fk"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["gym_id"]
          },
        ]
      }
      gyms: {
        Row: {
          city: Database["public"]["Enums"]["city"]
          created_at: string
          description: string | null
          district: string
          full_address: string
          gym_id: string
          has_heating_cooling: boolean
          has_shower: boolean
          has_water_dispenser: boolean
          name: string
          parking_info: string | null
          updated_at: string
          url: string | null
          usage_rules: string | null
        }
        Insert: {
          city: Database["public"]["Enums"]["city"]
          created_at?: string
          description?: string | null
          district: string
          full_address: string
          gym_id?: string
          has_heating_cooling?: boolean
          has_shower?: boolean
          has_water_dispenser?: boolean
          name: string
          parking_info?: string | null
          updated_at?: string
          url?: string | null
          usage_rules?: string | null
        }
        Update: {
          city?: Database["public"]["Enums"]["city"]
          created_at?: string
          description?: string | null
          district?: string
          full_address?: string
          gym_id?: string
          has_heating_cooling?: boolean
          has_shower?: boolean
          has_water_dispenser?: boolean
          name?: string
          parking_info?: string | null
          updated_at?: string
          url?: string | null
          usage_rules?: string | null
        }
        Relationships: []
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
      city:
        | "서울"
        | "경기"
        | "인천"
        | "강원"
        | "부산"
        | "대구"
        | "광주"
        | "대전"
        | "세종"
        | "울산"
        | "충북"
        | "충남"
        | "전북"
        | "전남"
        | "경북"
        | "경남"
        | "제주"
      game_gender_type: "상관없음" | "남자" | "여자"
      game_time_type:
        | "1시간"
        | "1시간 30분"
        | "2시간"
        | "2시간 30분"
        | "3시간"
        | "3시간 30분 이상"
      game_type: "1on1" | "3on3" | "5on5" | "기타"
      gender_type: "male" | "female" | "mixed"
      participant_status: "대기" | "입금 요청" | "입금 완료" | "참가 확정"
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
      city: [
        "서울",
        "경기",
        "인천",
        "강원",
        "부산",
        "대구",
        "광주",
        "대전",
        "세종",
        "울산",
        "충북",
        "충남",
        "전북",
        "전남",
        "경북",
        "경남",
        "제주",
      ],
      game_gender_type: ["상관없음", "남자", "여자"],
      game_time_type: [
        "1시간",
        "1시간 30분",
        "2시간",
        "2시간 30분",
        "3시간",
        "3시간 30분 이상",
      ],
      game_type: ["1on1", "3on3", "5on5", "기타"],
      gender_type: ["male", "female", "mixed"],
      participant_status: ["대기", "입금 요청", "입금 완료", "참가 확정"],
    },
  },
} as const
