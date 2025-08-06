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

export const getChatRooms = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  const { data: roomMemberships } = await client
    .from("chat_room_members")
    .select("chat_room_id")
    .eq("profile_id", userId);

  const chatRoomIds = roomMemberships?.map((r) => r.chat_room_id) ?? [];

  const { data, error } = await client
    .from("chat_rooms")
    .select(
      `
    chat_room_id,
    chat_room_members!chat_room_id(profile:profile_id(*)),
    chats!chat_room_id(*)
  `,
    )
    .in("chat_room_id", chatRoomIds);

  if (error) throw error;

  const filtered = data?.map((room) => ({
    ...room,
    chat_room_members: room.chat_room_members.filter(
      (member) => member.profile.profile_id !== userId,
    ),
  }));

  return filtered;
};
