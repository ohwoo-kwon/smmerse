import { basketballSkillLevelEnum, genderTypeEnum } from "./schema";

export const basketballSkillLevelMap: Record<
  (typeof basketballSkillLevelEnum.enumValues)[number],
  string
> = {
  level_0: "무관",
  level_1: "입문",
  level_2: "초보",
  level_3: "중급",
  level_4: "중상",
  level_5: "최상",
};

export const genderTypeMap: Record<
  (typeof genderTypeEnum.enumValues)[number],
  string
> = {
  male: "남자",
  female: "여자",
  mixed: "혼성",
};
