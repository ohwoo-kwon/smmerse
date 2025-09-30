import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import type { cityEnum } from "./schema";

export const getGymsShort = async (
  client: SupabaseClient<Database>,
  {
    sido,
    has_water_dispenser,
    has_heating_cooling,
    has_shower,
  }: {
    sido?: (typeof cityEnum.enumValues)[number] | null;
    has_water_dispenser?: boolean | null;
    has_heating_cooling?: boolean | null;
    has_shower?: boolean | null;
  },
) => {
  const baseQuery = client
    .from("gyms")
    .select(
      "gym_id,name,full_address,has_water_dispenser,has_heating_cooling,has_shower",
    )
    .order("created_at");

  if (sido) baseQuery.eq("city", sido);
  if (has_water_dispenser) baseQuery.eq("has_water_dispenser", true);
  if (has_heating_cooling) baseQuery.eq("has_heating_cooling", true);
  if (has_shower) baseQuery.eq("has_shower", true);

  const { data, error } = await baseQuery;

  if (error) throw new Error(error.message);

  return data;
};

export const getGym = async (
  client: SupabaseClient<Database>,
  gym_id: string,
) => {
  const { data, error } = await client
    .from("gyms")
    .select("*, photos:gym_photos(url)")
    .eq("gym_id", gym_id)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const getGymByName = async (
  client: SupabaseClient<Database>,
  name: string,
) => {
  const { data, error } = await client
    .from("gyms")
    .select("gym_id, name, full_address")
    .like("name", `%${name}%`);

  if (error) throw new Error(error.message);

  return data;
};
