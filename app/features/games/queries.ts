import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import { DateTime } from "luxon";

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
      city,
      district,
      is_crawl,
      title,
      gym:gyms!inner(
        name,
        city,
        district
      )`,
    )
    .order("start_time")
    .gte("start_date", DateTime.now().toFormat("yyyyMMdd"));

  if (start_date) baseQuery.eq("start_date", start_date);
  if (sido) baseQuery.eq("city", sido);
  if (has_water_dispenser) baseQuery.eq("gyms.has_water_dispenser", true);
  if (has_heating_cooling) baseQuery.eq("gyms.has_heating_cooling", true);
  if (has_shower) baseQuery.eq("gyms.has_shower", true);

  const { data, error } = await baseQuery;

  if (error) throw new Error(error.message);

  return data;
};

export const getGameById = async (
  client: SupabaseClient<Database>,
  gameId: number,
) => {
  const { data, error } = await client
    .from("games")
    .select(
      `*,
      profile:profiles(*),
      gym:gyms!inner(*, photos:gym_photos(url))`,
    )
    .eq("game_id", gameId)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const checkAlreadyRegister = async (
  client: SupabaseClient<Database>,
  { gameId, profileId }: { gameId: number; profileId: string },
) => {
  const { data, error } = await client
    .from("game_participants")
    .select("*")
    .eq("game_id", gameId)
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return !!data;
};

export const getGameParticipants = async (
  client: SupabaseClient<Database>,
  gameId: number,
) => {
  const { data, error } = await client
    .from("game_participants")
    .select("*, profile:profile_id(*)")
    .eq("game_id", gameId);

  if (error) throw new Error(error.message);

  return data;
};
