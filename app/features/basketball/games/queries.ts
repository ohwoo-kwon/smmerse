import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import type { basketballSkillLevelEnum, genderTypeEnum } from "./schema";

const PAGE_SIZE = 20;

export const getBasketballGames = async (
  client: SupabaseClient<Database>,
  {
    page,
    search,
    sido,
    city,
    genderType,
    level,
  }: {
    page: number;
    search?: string;
    sido?: string;
    city?: string;
    genderType?: (typeof genderTypeEnum.enumValues)[number];
    level?: (typeof basketballSkillLevelEnum.enumValues)[number];
  },
) => {
  const baseQuery = client
    .from("basketball_games")
    .select("*")
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
    .order("created_at");

  if (search) baseQuery.like("name", `%${search}%`);
  if (genderType) baseQuery.eq("gender_type", genderType);
  if (level) baseQuery.eq("skill_level", level);

  if (sido || city) {
    const orConditions: string[] = [];

    if (sido) {
      const sidoList = sido.split(",").map((v) => `sido.eq.${v}`);
      orConditions.push(...sidoList);
    }

    if (city) {
      const cityList = city
        .split(",")
        .map((v) => `city.eq.${v.split(" ").slice(1).join(" ")}`);
      orConditions.push(...cityList);
    }

    if (orConditions.length > 0) baseQuery.or(orConditions.join(","));
  }

  const { data, error } = await baseQuery;
  if (error) throw Error(error.message);
  return data;
};

export const getBasketballGamesPage = async (
  client: SupabaseClient<Database>,
  {
    search,
    sido,
    city,
    genderType,
    level,
  }: {
    search?: string;
    sido?: string;
    city?: string;
    genderType?: (typeof genderTypeEnum.enumValues)[number];
    level?: (typeof basketballSkillLevelEnum.enumValues)[number];
  },
) => {
  const baseQuery = client
    .from("basketball_games")
    .select("basketball_game_id", { count: "exact", head: true });

  if (search) baseQuery.like("name", `%${search}%`);
  if (genderType) baseQuery.eq("gender_type", genderType);
  if (level) baseQuery.eq("skill_level", level);

  if (sido || city) {
    const orConditions: string[] = [];

    if (sido) {
      const sidoList = sido.split(",").map((v) => `sido.eq.${v}`);
      orConditions.push(...sidoList);
    }

    if (city) {
      const cityList = city
        .split(",")
        .map((v) => `city.eq.${v.split(" ").slice(1).join(" ")}`);
      orConditions.push(...cityList);
    }

    if (orConditions.length > 0) baseQuery.or(orConditions.join(","));
  }

  const { count, error: countError } = await baseQuery;

  if (countError) throw Error(countError.message);
  if (!count) return 1;
  return Math.ceil(count / PAGE_SIZE);
};

export const getBasketballGameById = async (
  client: SupabaseClient<Database>,
  id: number,
) => {
  const { data, error } = await client
    .from("basketball_games")
    .select("*")
    .eq("basketball_game_id", id)
    .single();
  if (error) throw error;
  return data;
};
