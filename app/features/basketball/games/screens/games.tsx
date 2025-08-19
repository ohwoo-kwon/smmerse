import type { Route } from "./+types/games";

import { Suspense } from "react";
import { Await, Link } from "react-router";
import z from "zod";

import AdsenseInfeed from "~/core/components/adsense-infeed";
import CustomPagination from "~/core/components/custom-pagination";
import { Button } from "~/core/components/ui/button";
import makeServerClient from "~/core/lib/supa-client.server";

import DateFilter from "../components/date-filter";
import BasketballGameCard from "../components/game-card";
import { GenderSelect } from "../components/gender-select";
import SidoFilter from "../components/sido-filter";
import { SkillLevelSelect } from "../components/skill-level-select";
import { getBasketballGames, getBasketballGamesPage } from "../queries";
import { basketballSkillLevelEnum, genderTypeEnum } from "../schema";

export const meta: Route.MetaFunction = ({ location }) => {
  const searchParams = new URLSearchParams(location.search);

  const sidos = searchParams.get("sido");
  const cities = searchParams.get("city");

  const selected = [];
  if (sidos) selected.push(...sidos.split(","));
  if (cities) selected.push(...cities.split(","));

  return [
    {
      title: `농구 게스트 모집 | ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      name: "description",
      content: `${selected.join(",")} 농구 게스트 모집`,
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
  sido: z.string().optional(),
  city: z.string().optional(),
  date: z.string().optional(),
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

  const { page, sido, city, genderType, level, date } = searchParamsData;

  const games = getBasketballGames(client, {
    page,
    sido,
    city,
    genderType,
    level,
    date,
  });
  const totalPages = await getBasketballGamesPage(client, {
    sido,
    city,
    genderType,
    level,
    date,
  });

  return { games, totalPages };
};

export default function BasketballGames({ loaderData }: Route.ComponentProps) {
  const { games, totalPages } = loaderData;
  return (
    <div className="space-y-4 p-4">
      {/* Filter bar */}
      <div className="space-y-2">
        <DateFilter />
        <div className="mb-0 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <SidoFilter />
            <GenderSelect />
            <SkillLevelSelect />
          </div>
          <Button size="sm">
            <Link to="/basketball/games/create">경기 만들기</Link>
          </Button>
        </div>
      </div>

      {/* AdSense 광고 */}
      <AdsenseInfeed />

      {/* 게임 카드 리스트 */}
      <div className="flex flex-col gap-4">
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
        <CustomPagination totalPages={totalPages} />
      </div>
    </div>
  );
}
