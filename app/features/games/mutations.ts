import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import type { cityEnum } from "../gyms/schema";
import type { gameGenderTypeEnum, gameTimeEnum, gameTypeEnum } from "./schema";

import { calculateAge } from "~/core/lib/utils";

import { getOrCreateChatRoom, sendMessage } from "../users/mutations";
import { getUserProfile } from "../users/queries";
import { checkAlreadyRegister } from "./queries";

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
    is_crawl,
    title,
    city,
    district,
    link,
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
    is_crawl?: boolean;
    title?: string;
    city?: (typeof cityEnum.enumValues)[number];
    district?: string;
    link?: string;
  },
) => {
  const { data, error } = await client.from("games").insert({
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
    is_crawl,
    title,
    city,
    district,
    link,
  });

  if (error) throw new Error(error.message);

  return data;
};

export const createParticipantAndSendMessage = async (
  client: SupabaseClient<Database>,
  {
    from_user_id,
    to_user_id,
    game_id,
  }: {
    from_user_id: string;
    to_user_id: string;
    game_id: number;
  },
) => {
  const isAlreadyRegister = await checkAlreadyRegister(client, {
    gameId: game_id,
    profileId: from_user_id,
  });
  if (isAlreadyRegister) throw new Error("이미 참가 신청한 경기입니다.");
  const { error } = await client.from("game_participants").insert({
    profile_id: from_user_id,
    game_id,
  });

  if (error) throw new Error(error.message);

  const chatRoomId = await getOrCreateChatRoom(client, {
    fromUserId: from_user_id,
    toUserId: to_user_id,
  });

  const profile = await getUserProfile(client, { userId: from_user_id });

  await sendMessage(client, {
    chatRoomId,
    senderId: from_user_id,
    recipientId: to_user_id,
    content: `${import.meta.env.VITE_SITE_URL}/games/${game_id}

    이름: ${profile?.name}
    나이: ${calculateAge(profile!.birth!)}살
    성별: ${profile?.sex === "female" ? "여" : "남"}
    키: ${profile?.height} cm
    포지션: ${profile?.position?.join(", ")}

    참가신청 합니다.`,
  });

  return chatRoomId;
};
