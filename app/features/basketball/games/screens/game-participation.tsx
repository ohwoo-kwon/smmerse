import type { Route } from "./+types/game-participation";

import { Suspense } from "react";
import { Await } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";

import GameParticipationCard from "../components/game-participation-card";
import { deleteApplication } from "../mutations";
import { getMyParticipation } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `경기 참여 내역 | ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      name: "description",
      content:
        "내가 참여한 농구 경기의 신청 내역과 진행 상태를 확인할 수 있습니다.",
    },
    {
      name: "keywords",
      content: "농구, 경기, 참여, 신청 내역, 게스트",
    },
  ];
};

export const action = async ({ request }: Route.ActionArgs) => {
  const [client] = makeServerClient(request);

  const formData = await request.formData();

  const participantId = formData.get("participant_id");

  if (!participantId) return { error: "참가 취소에 실패하였습니다." };

  await deleteApplication(client, { participantId: Number(participantId) });
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  const games = getMyParticipation(client, user!.id);

  return { games, userId: user!.id };
};

export default function GameParticipation({
  loaderData,
}: Route.ComponentProps) {
  return (
    <div className="mx-auto max-w-screen-md space-y-8 p-4">
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
          resolve={loaderData.games}
          children={(games) =>
            games.length > 0 ? (
              games.map((game) => (
                <GameParticipationCard
                  key={game.participant_id}
                  participant_id={game.participant_id}
                  basketball_game_id={game.basketball_game_id}
                  status={game.status}
                  title={game.game.title}
                  skill_level={game.game.skill_level}
                  gender_type={game.game.gender_type}
                  date={game.game.date}
                  start_time={game.game.start_time}
                  end_time={game.game.end_time}
                  sido={game.game.sido}
                  city={game.game.city}
                  max_participants={game.game.max_participants}
                  fee={game.game.fee}
                  fromUserId={game.profile_id}
                  toUserId={game.game.profile_id || ""}
                />
              ))
            ) : (
              <div className="flex flex-col items-center gap-2 text-center md:text-xl">
                참여 내역이 없습니다.
              </div>
            )
          }
        ></Await>
      </Suspense>
    </div>
  );
}
