import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import type { basketballSkillLevelEnum, genderTypeEnum } from "./schema";

export const insertBasketballGame = async (
  client: SupabaseClient<Database>,
  {
    profileId,
    title,
    description,
    date,
    startTime,
    endTime,
    skillLevel,
    minParticipants,
    maxParticipants,
    currentParticipants,
    fee,
    sido,
    city,
    address,
    genderType,
    link,
  }: {
    profileId?: string;
    title: string;
    description?: string;
    date: string;
    startTime: string;
    endTime: string;
    skillLevel: (typeof basketballSkillLevelEnum.enumValues)[number];
    minParticipants: number;
    maxParticipants: number;
    currentParticipants: number;
    fee: number;
    sido: string;
    city: string;
    address: string;
    genderType: (typeof genderTypeEnum.enumValues)[number];
    link?: string;
  },
) => {
  const { data, error } = await client.from("basketball_games").insert({
    profile_id: profileId,
    title,
    description,
    date,
    start_time: startTime,
    end_time: endTime,
    skill_level: skillLevel,
    min_participants: minParticipants,
    max_participants: maxParticipants,
    current_participants: currentParticipants,
    fee,
    sido,
    city,
    address,
    gender_type: genderType,
    link,
  });
  if (error) throw error;
  return data;
};

export const updateBasketballGame = async (
  client: SupabaseClient<Database>,
  id: number,
  {
    title,
    description,
    date,
    startTime,
    endTime,
    skillLevel,
    minParticipants,
    maxParticipants,
    currentParticipants,
    fee,
    sido,
    city,
    address,
    genderType,
    link,
  }: {
    title: string;
    description?: string | null;
    date: string;
    startTime: string;
    endTime: string;
    skillLevel: (typeof basketballSkillLevelEnum.enumValues)[number];
    minParticipants: number;
    maxParticipants: number;
    currentParticipants: number;
    fee: number;
    sido: string;
    city: string;
    address: string;
    genderType: (typeof genderTypeEnum.enumValues)[number];
    link?: string | null;
  },
) => {
  const { data, error } = await client
    .from("basketball_games")
    .update({
      title,
      description,
      date,
      start_time: startTime,
      end_time: endTime,
      skill_level: skillLevel,
      min_participants: minParticipants,
      max_participants: maxParticipants,
      current_participants: currentParticipants,
      fee,
      sido,
      city,
      address,
      gender_type: genderType,
      link: link || null,
    })
    .eq("basketball_game_id", id);
  if (error) throw error;
  return data;
};

export const deleteBasketballGame = async (
  client: SupabaseClient<Database>,
  id: number,
) => {
  const { data, error } = await client
    .from("basketball_games")
    .delete()
    .eq("basketball_game_id", id);
  if (error) throw error;
  return data;
};
