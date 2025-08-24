import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import type { basketballSkillLevelEnum, genderTypeEnum } from "./schema";

import { DateTime } from "luxon";

export const insertBasketballGame = async (
  client: SupabaseClient<Database>,
  {
    profile_id,
    title,
    description,
    date,
    start_time,
    end_time,
    skill_level,
    min_participants,
    max_participants,
    fee,
    sido,
    city,
    address,
    gender_type,
    link,
  }: {
    profile_id?: string;
    title: string;
    description?: string;
    date: string;
    start_time: string;
    end_time: string;
    skill_level: (typeof basketballSkillLevelEnum.enumValues)[number];
    min_participants: number;
    max_participants: number;
    fee: number;
    sido: string;
    city: string;
    address: string;
    gender_type: (typeof genderTypeEnum.enumValues)[number];
    link?: string;
  },
) => {
  const { data, error } = await client.from("basketball_games").insert({
    profile_id,
    title,
    description,
    date,
    start_time,
    end_time,
    skill_level,
    min_participants,
    max_participants,
    fee,
    sido,
    city,
    address,
    gender_type,
    link,
  });
  if (error) {
    throw error;
  }
  return data;
};

export const updateBasketballGame = async (
  client: SupabaseClient<Database>,
  id: number,
  {
    title,
    description,
    date,
    start_time,
    end_time,
    skill_level,
    min_participants,
    max_participants,
    fee,
    sido,
    city,
    address,
    gender_type,
    link,
  }: {
    title: string;
    description?: string | null;
    date: string;
    start_time: string;
    end_time: string;
    skill_level: (typeof basketballSkillLevelEnum.enumValues)[number];
    min_participants: number;
    max_participants: number;
    fee: number;
    sido: string;
    city: string;
    address: string;
    gender_type: (typeof genderTypeEnum.enumValues)[number];
    link?: string | null;
  },
) => {
  const { data, error } = await client
    .from("basketball_games")
    .update({
      title,
      description,
      date,
      start_time,
      end_time,
      skill_level,
      min_participants,
      max_participants,
      fee,
      sido,
      city,
      address,
      gender_type,
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

export const applyForGame = async (
  client: SupabaseClient<Database>,
  {
    basketballGameId,
    profileId,
  }: { basketballGameId: number; profileId: string },
) => {
  try {
    // 이미 신청했는지 확인
    const { data: isApplied } = await client
      .from("basketball_game_participants")
      .select()
      .eq("basketball_game_id", basketballGameId)
      .eq("profile_id", profileId)
      .single();

    if (isApplied) {
      return {
        success: false,
        message: "이미 해당 게임에 참가 신청하셨습니다.",
      };
    }

    // 게임이 존재하는지 확인
    const { data: gameData } = await client
      .from("basketball_games")
      .select()
      .eq("basketball_game_id", basketballGameId)
      .single();

    if (!gameData) {
      return { success: false, message: "존재하지 않는 게임입니다." };
    }

    // 게임이 신청 가능한 상태인지 확인 (예: 시작 전, 정원 미달 등)
    if (
      DateTime.fromFormat(
        `${gameData.date} ${gameData.start_time}`,
        "yyyy-MM-dd HH:mm:ss",
      ) < DateTime.now()
    )
      return {
        success: false,
        message: "이미 시작된 게임에는 참가 신청할 수 없습니다.",
      };

    // 현재 참가자 수 확인
    const { count, error: countError } = await client
      .from("basketball_game_participants")
      .select("", { count: "exact", head: true })
      .eq("basketball_game_id", basketballGameId)
      .eq("status", "approved");
    if (countError) throw countError;
    if (count && count >= gameData.max_participants)
      throw new Error("참가자 모집이 마감되었습니다.");

    // 일반 참가 신청
    const result = await client.from("basketball_game_participants").insert({
      basketball_game_id: basketballGameId,
      profile_id: profileId,
      status: "pending",
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "알 수 없는 오류가 발생했습니다." };
  }
};

export async function updateApplication(
  client: SupabaseClient<Database>,
  {
    participantId,
    basketballGameId,
    profileId,
    status,
  }: {
    participantId: number;
    basketballGameId: number;
    profileId: string;
    status: "pending" | "approved" | "rejected";
  },
) {
  try {
    // 참가 신청 존재 확인
    const { data: participantData } = await client
      .from("basketball_game_participants")
      .select()
      .eq("participant_id", participantId)
      .single();

    if (!participantData) {
      throw new Error("존재하지 않는 참가자입니다.");
    }

    // 게임이 존재하는지 확인
    const { data: gameData } = await client
      .from("basketball_games")
      .select()
      .eq("basketball_game_id", basketballGameId)
      .single();

    if (!gameData) {
      throw new Error("존재하지 않는 게임입니다.");
    }

    // 승인하는 경우 정원 확인
    if (status === "approved") {
      const { count, error: countError } = await client
        .from("basketball_game_participants")
        .select("", { count: "exact", head: true })
        .eq("basketball_game_id", basketballGameId)
        .eq("status", "approved");

      if (countError) throw countError;
      if (count && count >= gameData.max_participants)
        throw new Error("참가자 모집이 마감되었습니다.");
    }

    const { error } = await client
      .from("basketball_game_participants")
      .update({
        profile_id: profileId,
        basketball_game_id: basketballGameId,
        status,
      })
      .eq("participant_id", participantId);

    if (error) throw error;

    return {
      success: true,
    };
  } catch (error) {
    throw error;
  }
}

export async function deleteApplication(
  client: SupabaseClient<Database>,
  {
    participantId,
  }: {
    participantId: number;
  },
) {
  const { error } = await client
    .from("basketball_game_participants")
    .delete()
    .eq("participant_id", participantId);

  if (error) throw error;
}
