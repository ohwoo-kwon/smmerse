import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import type { cityEnum } from "~/features/gyms/schema";

export const getGamesShort = async (
  client: SupabaseClient<Database>,
  {
    start_date,
    sido,
    has_water_dispenser,
    has_heating_cooling,
    has_shower,
  }: {
    start_date: string | null;
    sido: (typeof cityEnum.enumValues)[number] | null;
    has_water_dispenser: boolean | null;
    has_heating_cooling: boolean | null;
    has_shower: boolean | null;
  },
) => {
  const baseQuery = client
    .from("games")
    .select(
      `game_id,
      game_type,
      game_gender_type,
      start_time,
      game_time,
      max_participants,
      fee,
      gym:gyms!inner(
        name,
        city,
        district
      )`,
    )
    .order("start_time");

  if (start_date) baseQuery.eq("start_date", start_date);
  if (sido) baseQuery.eq("gyms.city", sido);
  if (has_water_dispenser) baseQuery.eq("gyms.has_water_dispenser", true);
  if (has_heating_cooling) baseQuery.eq("gyms.has_heating_cooling", true);
  if (has_shower) baseQuery.eq("gyms.has_shower", true);

  const { data, error } = await baseQuery;

  if (error) throw new Error(error.message);

  return data;
};
