import type { Database } from "database.types";

import z from "zod";

import { basketballSkillLevelEnum, genderTypeEnum } from "./schema";

export const basketballGameSchema = z.object({
  basketball_game_id: z.coerce.number().optional(),
  profile_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().optional().nullable(),
  date: z.string().min(1, "날짜를 선택해주세요."),
  start_time: z.string().min(1, "시작 시간을 입력해주세요."),
  end_time: z.string().min(1, "종료 시간을 입력해주세요."),
  skill_level: z.enum(basketballSkillLevelEnum.enumValues),
  min_participants: z.coerce.number(),
  max_participants: z.coerce.number(),
  fee: z.coerce.number(),
  sido: z.string().min(1, "시/도를 입력해주세요."),
  city: z.string().min(1, "구/군을 입력해주세요."),
  address: z.string().min(1, "주소를 입력해주세요."),
  gender_type: z.enum(genderTypeEnum.enumValues).default("male"),
  link: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .nullable(),
});

export type BasketballGame =
  Database["public"]["Tables"]["basketball_games"]["Row"];
