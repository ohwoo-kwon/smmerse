import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import type { gameGenderTypeEnum, gameTimeEnum, gameTypeEnum } from "./schema";

export const insertGame = async (
  client: SupabaseClient<Database>,
  {
    profile_id,
    gym_id,
    game_type,
    game_gender_type,
    description,
    start_date,
    start_time,
    game_time,
    min_participants,
    max_participants,
    fee,
    guard,
    forward,
    center,
  }: {
    profile_id: string;
    gym_id: string;
    game_type: (typeof gameTypeEnum.enumValues)[number];
    game_gender_type: (typeof gameGenderTypeEnum.enumValues)[number];
    description: string | null;
    start_date: string;
    start_time: string;
    game_time: (typeof gameTimeEnum.enumValues)[number];
    min_participants: number;
    max_participants: number;
    fee: number;
    guard: boolean;
    forward: boolean;
    center: boolean;
  },
) => {
  const { data, error } = await client
    .from("games")
    .insert({
      profile_id,
      gym_id,
      game_type,
      game_gender_type,
      description,
      start_date,
      start_time,
      game_time,
      min_participants,
      max_participants,
      fee,
      guard,
      forward,
      center,
    });

  if (error) throw new Error(error.message);

  return data;
};
