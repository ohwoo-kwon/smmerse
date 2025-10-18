import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export async function getUserProfile(
  client: SupabaseClient<Database>,
  { userId }: { userId: string | null },
) {
  if (!userId) {
    return null;
  }
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("profile_id", userId)
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export const getMessages = async (
  client: SupabaseClient<Database>,
  profileId: string,
  chatRoomId: number,
) => {
  const { count, error: countError } = await client
    .from("chat_room_members")
    .select("*", { count: "exact", head: true })
    .eq("chat_room_id", chatRoomId)
    .eq("profile_id", profileId);
  if (countError) throw countError;
  if (count === 0) throw new Error("존재하지 않는 채팅방입니다.");

  const { data, error } = await client
    .from("chats")
    .select("*")
    .eq("chat_room_id", chatRoomId)
    .order("createdAt");

  if (error) throw error;
  return data;
};

export const getChats = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  const { data, error } = await client
    .from("chats_view")
    .select("*")
    .eq("profile_id", userId)
    .neq("other_profile_id", userId)
    .neq("last_message", null)
    .order("last_message_time", { ascending: false });

  if (error) throw error;

  return data;
};

export const getRoomsParticipant = async (
  client: SupabaseClient<Database>,
  { chatRoomId, userId }: { chatRoomId: number; userId: string },
) => {
  const { data, error } = await client
    .from("chat_room_members")
    .select(
      `profile:profiles!profile_id!inner(
        name,
        profile_id,
        avatar_url
      )`,
    )
    .eq("chat_room_id", chatRoomId)
    .neq("profile_id", userId)
    .single();

  if (error) throw error;

  return data;
};
