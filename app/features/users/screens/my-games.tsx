import type { Route } from "./+types/my-games";

import { OctagonXIcon } from "lucide-react";
import { DateTime } from "luxon";
import { Link, redirect } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";
import { getGameByProfileId } from "~/features/games/queries";

export const meta: Route.MetaFunction = () => [
  { title: `${import.meta.env.VITE_APP_NAME} | 내가 모집한 경기` },
  {
    name: "description",
    content: "내가 생성한 농구 게스트 모집 내역을 확인하세요.",
  },
  {
    property: "og:title",
    content: `${import.meta.env.VITE_APP_NAME} | 내가 모집한 경기`,
  },
  {
    property: "og:description",
    content: "내가 생성한 농구 게스트 모집 내역을 확인하세요.",
  },
  {
    property: "og:image",
    content:
      "https://wujxmuluphdazgapgwrr.supabase.co/storage/v1/object/public/avatars/e421200d-88ca-4711-a667-b000290ef252",
  },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return redirect("/login");

  const games = await getGameByProfileId(client, user.id);

  return { games };
};

export default function MyGames({ loaderData }: Route.ComponentProps) {
  const { games } = loaderData;

  return (
    <div className="mx-auto max-w-screen-lg space-y-4 p-4">
      <h1 className="text-3xl font-bold">모집 내역</h1>
      <div>
        {games.length > 0 ? (
          games.map(
            ({ game_id, gym, title, is_crawl, start_date, start_time }) => {
              return (
                <Link
                  to={`/games/${game_id}`}
                  key={`game_${game_id}`}
                  className="flex items-center justify-between border-b py-4 last:border-0"
                >
                  <div className="flex-1">
                    <span className="text-sm">
                      {DateTime.fromFormat(
                        `${start_date} ${start_time}`,
                        "yyyy-MM-dd HH:mm:ss",
                      ).toFormat("yy.MM.dd HH:mm")}
                    </span>
                    <h3 className="text-lg font-semibold">
                      {is_crawl ? title : gym.name}
                    </h3>
                  </div>
                </Link>
              );
            },
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <OctagonXIcon
              size={80}
              strokeWidth={1}
              className="text-muted-foreground"
            />
            <p className="text-lg font-semibold">아직 생성한 경기가 없어요</p>
          </div>
        )}
      </div>
    </div>
  );
}
