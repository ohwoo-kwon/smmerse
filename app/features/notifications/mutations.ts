import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import { notificationTypeEnum } from "./schema";

export const insertNotification = async (
  client: SupabaseClient<Database>,
  {
    recipientProfileId,
    senderProfileId,
    type,
    gameId,
    chatRoomId,
    participationId,
  }: {
    recipientProfileId: string;
    senderProfileId: string;
    type: (typeof notificationTypeEnum.enumValues)[number];
    gameId?: number;
    chatRoomId?: number;
    participationId?: number;
  },
) => {
  const { error } = await client.from("notifications").insert({
    sender_profile_id: senderProfileId,
    recipient_profile_id: recipientProfileId,
    type,
    game_id: gameId,
    chat_room_id: chatRoomId,
    participant_id: participationId,
  });

  if (error) throw new Error(error.message);
};

export const updateIsRead = async (
  client: SupabaseClient<Database>,
  notificationId: string,
) => {
  await client
    .from("notifications")
    .update({
      is_read: true,
    })
    .eq("notification_id", notificationId);
};

export const deleteNotification = async (
  client: SupabaseClient<Database>,
  notificationId: string,
) => {
  await client
    .from("notifications")
    .delete()
    .eq("notification_id", notificationId);
};
