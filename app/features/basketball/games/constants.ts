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

export const basketballSkillLevelDescMap: Record<
  (typeof basketballSkillLevelEnum.enumValues)[number],
  string
> = {
  level_0: "실력과 관계없이 누구나 참가 가능.",
  level_1:
    "농구를 처음 접했거나 막 시작한 사람. 패스, 슛, 드리블이 어색한 사람.",
  level_2:
    "기본적인 룰은 알고 있으며, 드리블·슛·패스 등을 시도해볼 수 있는 수준.",
  level_3:
    "게임 이해도와 기본 플레이가 가능한 수준. 일반 사회인 경기(픽업게임)에 자주 참여하는 사람.",
  level_4:
    "경험이 많고 조직적인 플레이가 가능한 수준. 일반 동호회 대회를 참여해 본 사람.",
  level_5:
    "전문적 또는 준경쟁 수준. 동호회 상위권, 대학부, 고등부 선수 출신 등.",
};

export const genderTypeMap: Record<
  (typeof genderTypeEnum.enumValues)[number],
  string
> = {
  male: "남자",
  female: "여자",
  mixed: "혼성",
};
