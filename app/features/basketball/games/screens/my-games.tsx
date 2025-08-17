import type { Route } from "./+types/my-games";

import { Suspense } from "react";
import { Await, Link } from "react-router";

import { Button } from "~/core/components/ui/button";
import makeServerClient from "~/core/lib/supa-client.server";

import BasketballGameCard from "../components/game-card";
import { getMyBasketballGames } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `나의 모집글 | ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      name: "description",
      content:
        "내가 만든 농구 게스트 모집글을 확인하고 관리할 수 있는 페이지입니다.",
    },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  const games = getMyBasketballGames(client, user!.id);

  return { games };
};

export default function MyGames({ loaderData }: Route.ComponentProps) {
  const { games } = loaderData;
  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-4">
        <Button size="sm" asChild>
          <Link to="/basketball/games/create">경기 만들기</Link>
        </Button>
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
                      isOwner={true}
                    />
                  ),
                )
              ) : (
                <div className="flex flex-col items-center gap-2 text-center text-xl">
                  아직 모집글이 없습니다...
                  <Button size="sm">
                    <Link to="/basketball/games/create">경기 만들기</Link>
                  </Button>{" "}
                  를 통해 모집글을 등록해보세요.
                </div>
              )
            }
          ></Await>
        </Suspense>
        {/* <CustomPagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
