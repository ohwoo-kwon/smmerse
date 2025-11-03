import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import type { cityEnum } from "./schema";

export const createGym = async (
  client: SupabaseClient<Database>,
  {
    profile_id,
    name,
    description,
    city,
    district,
    full_address,
    has_water_dispenser,
    has_heating_cooling,
    has_shower,
    parking_info,
    usage_rules,
  }: {
    profile_id: string;
    name: string;
    description: string | null;
    city: (typeof cityEnum.enumValues)[number];
    district: string;
    full_address: string;
    has_heating_cooling: boolean;
    has_water_dispenser: boolean;
    has_shower: boolean;
    parking_info: string | null;
    usage_rules: string | null;
  },
) => {
  const { data, error } = await client
    .from("gyms")
    .insert({
      profile_id,
      name,
      description,
      city,
      district,
      full_address,
      has_heating_cooling,
      has_water_dispenser,
      has_shower,
      parking_info,
      usage_rules,
    })
    .select("gym_id")
    .single();
  if (error) throw new Error(error.message);
  return data.gym_id;
};

export const createGymPhoto = async (
  client: SupabaseClient<Database>,
  {
    gym_id,
    url,
  }: {
    gym_id: string;
    url: string;
  },
) => {
  const { data, error } = await client.from("gym_photos").insert({
    gym_id,
    url,
  });
  if (error) throw new Error(error.message);
};

export const updateGym = async (
  client: SupabaseClient<Database>,
  {
    gym_id,
    name,
    description,
    city,
    district,
    full_address,
    has_water_dispenser,
    has_heating_cooling,
    has_shower,
    parking_info,
    usage_rules,
  }: {
    gym_id: string;
    name: string;
    description: string | null;
    city: (typeof cityEnum.enumValues)[number];
    district: string;
    full_address: string;
    has_heating_cooling: boolean;
    has_water_dispenser: boolean;
    has_shower: boolean;
    parking_info: string | null;
    usage_rules: string | null;
  },
) => {
  const { data, error } = await client
    .from("gyms")
    .update({
      name,
      description,
      city,
      district,
      full_address,
      has_heating_cooling,
      has_water_dispenser,
      has_shower,
      parking_info,
      usage_rules,
    })
    .eq("gym_id", gym_id)
    .select("gym_id")
    .single();
  if (error) throw new Error(error.message);
  return data.gym_id;
};
