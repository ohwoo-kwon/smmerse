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
  chatRoomId: number,
) => {
  const { data, error } = await client
    .from("chats")
    .select("*, sender:sender_id(name, avatar_url)")
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
    .neq("other_profile_id", userId);

  if (error) throw error;

  return data;
};
