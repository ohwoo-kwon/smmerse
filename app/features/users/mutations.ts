import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const getOrCreateChatRoom = async (
  client: SupabaseClient<Database>,
  { fromUserId, toUserId }: { fromUserId: string; toUserId: string },
) => {
  const { data, error } = await client
    .rpc("get_room", {
      from_user_id: fromUserId,
      to_user_id: toUserId,
    })
    .maybeSingle();

  if (error) throw error;

  if (data?.chat_room_id) return data.chat_room_id;
  else {
    const { data: roomData, error: roomError } = await client
      .from("chat_rooms")
      .insert({})
      .select("chat_room_id")
      .single();

    if (roomError) throw roomError;

    const { data, error } = await client.from("chat_room_members").insert([
      {
        chat_room_id: roomData.chat_room_id,
        profile_id: fromUserId,
      },
      {
        chat_room_id: roomData.chat_room_id,
        profile_id: toUserId,
      },
    ]);

    return roomData.chat_room_id;
  }
};

export const sendMessage = async (
  client: SupabaseClient<Database>,
  {
    chatRoomId,
    senderId,
    content,
  }: { chatRoomId: number; senderId: string; content: string },
) => {
  const { error } = await client.from("chats").insert({
    chat_room_id: chatRoomId,
    sender_id: senderId,
    content,
  });

  if (error) throw error;
};

export const createMessage = async (
  client: SupabaseClient<Database>,
  {
    chat_room_id,
    sender_id,
    content,
  }: {
    chat_room_id: number;
    sender_id: string;
    content: string;
  },
) => {
  const { error } = await client.from("chats").insert({
    chat_room_id,
    sender_id,
    content,
  });
  if (error) throw error;
};
