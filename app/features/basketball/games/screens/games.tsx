import type { Route } from "./+types/games";

import { Suspense } from "react";
import { Await } from "react-router";
import z from "zod";

import makeServerClient from "~/core/lib/supa-client.server";

import BasketballGameCard from "../components/game-card";
import { GenderSelect } from "../components/gender-select";
import SidoFilter from "../components/sido-filter";
import { SkillLevelSelect } from "../components/skill-level-select";
import { getBasketballGames, getBasketballGamesPage } from "../queries";
import { basketballSkillLevelEnum, genderTypeEnum } from "../schema";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `농구 게스트 모집 | ${import.meta.env.VITE_APP_NAME}`,
    },
  ];
};

const searchParamsSchema = z.object({
  page: z.coerce
    .number()
    .default(1)
    .superRefine((value, ctx) => {
      if (value < 1)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "page 는 1 이상의 값이어야 합니다.",
        });
    }),
  genderType: z.enum(genderTypeEnum.enumValues).optional(),
  level: z.enum(basketballSkillLevelEnum.enumValues).optional(),
  search: z.string().optional(),
  sido: z.string().optional(),
  city: z.string().optional(),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const {
    data: searchParamsData,
    success,
    error,
  } = searchParamsSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );

  if (!success) throw error;

  const { page, search, sido, city, genderType, level } = searchParamsData;

  const games = getBasketballGames(client, {
    page,
    search,
    sido,
    city,
    genderType,
    level,
  });
  const totalPages = await getBasketballGamesPage(client, {
    search,
    sido,
    city,
    genderType,
    level,
  });

  return { games, totalPages };
};

export default function BasketballGames({ loaderData }: Route.ComponentProps) {
  const { games, totalPages } = loaderData;
  return (
    <div className="space-y-4 p-4">
      {/* Filter bar */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <SidoFilter />
          <GenderSelect />
          <SkillLevelSelect />
        </div>
      </div>

      {/* 게임 카드 리스트 */}
      <Suspense
        fallback={
          <>
            <div className="bg-accent flex h-40 animate-pulse flex-col rounded" />
            <div className="bg-accent flex h-40 animate-pulse flex-col rounded" />
            <div className="bg-accent flex h-40 animate-pulse flex-col rounded" />
            <div className="bg-accent flex h-40 animate-pulse flex-col rounded" />
          </>
        }
      >
        <Await
          resolve={games}
          children={(games) =>
            games.length > 0 ? (
              games.map(
                ({
                  basketball_game_id,
                  title,
                  gender_type,
                  date,
                  start_time,
                  end_time,
                  sido,
                  city,
                  address,
                  skill_level,
                  max_participants,
                  fee,
                  link,
                }) => (
                  <BasketballGameCard
                    key={`basketball_game_${basketball_game_id}`}
                    basketballGameId={basketball_game_id}
                    title={title}
                    genderType={gender_type}
                    date={date}
                    startTime={start_time}
                    endTime={end_time}
                    sido={sido}
                    city={city}
                    address={address}
                    skillLevel={skill_level}
                    maxParticipants={max_participants}
                    fee={fee}
                    link={link}
                  />
                ),
              )
            ) : (
              <div className="text-center text-xl">
                조건에 맞는 경기가 없습니다...
              </div>
            )
          }
        ></Await>
      </Suspense>
    </div>
  );
}
