import z from "zod";

import { basketballSkillLevelEnum, genderTypeEnum } from "./schema";

export const basketballGameSchema = z.object({
  basketballGameId: z.number().optional(),
  profileId: z.string().uuid().optional().nullable(),
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().optional().nullable(),
  date: z.string().min(1, "날짜를 선택해주세요."),
  startTime: z.string().min(1, "시작 시간을 입력해주세요."),
  endTime: z.string().min(1, "종료 시간을 입력해주세요."),
  skillLevel: z.enum(basketballSkillLevelEnum.enumValues),
  minParticipants: z.coerce.number(),
  maxParticipants: z.coerce.number(),
  currentParticipants: z.coerce.number().default(0),
  fee: z.coerce.number(),
  sido: z.string().min(1, "시/도를 입력해주세요."),
  city: z.string().min(1, "구/군을 입력해주세요."),
  address: z.string().min(1, "주소를 입력해주세요."),
  genderType: z.enum(genderTypeEnum.enumValues).default("male"),
  link: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .nullable(),
});

export type BasketballGame = z.infer<typeof basketballGameSchema>;
