import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const getNotificationsUnReadCount = async (
  client: SupabaseClient<Database>,
  profileId: string,
) => {
  const { error, count } = await client
    .from("notifications")
    .select("notification_id", { count: "exact" })
    .eq("recipient_profile_id", profileId)
    .eq("is_read", false);

  if (error) throw error;

  return count;
};

export const getNotifications = async (
  client: SupabaseClient<Database>,
  profileId: string,
) => {
  const { data, error } = await client
    .from("notifications")
    .select(
      `
      *,
      sender:profiles!sender_profile_id(name),
      game:game_id(gym:gym_id(name))

    `,
      { count: "exact" },
    )
    .eq("recipient_profile_id", profileId);

  if (error) throw error;

  return data;
};
