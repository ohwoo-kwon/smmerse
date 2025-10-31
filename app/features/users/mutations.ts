import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import { insertNotification } from "../notifications/mutations";

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
    recipientId,
    content,
  }: {
    chatRoomId: number;
    senderId: string;
    recipientId: string;
    content: string;
  },
) => {
  const { count } = await client
    .from("notifications")
    .select("notification_id", { count: "exact" })
    .eq("sender_profile_id", senderId)
    .eq("chat_room_id", chatRoomId)
    .eq("is_read", false);

  if (!count) {
    await insertNotification(client, {
      recipientProfileId: recipientId,
      senderProfileId: senderId,
      chatRoomId: chatRoomId,
      type: "CHAT_MESSAGE",
    });
  }

  const { error } = await client.from("chats").insert({
    chat_room_id: chatRoomId,
    sender_id: senderId,
    content,
  });

  if (error) throw error;
};

export const updateChecked = async (
  client: SupabaseClient<Database>,
  {
    chatRoomId,
    profileId,
  }: {
    chatRoomId: number;
    profileId: string;
  },
) => {
  await client
    .from("chats")
    .update({
      is_checked: true,
    })
    .eq("chat_room_id", chatRoomId)
    .neq("sender_id", profileId)
    .eq("is_checked", false);
};
