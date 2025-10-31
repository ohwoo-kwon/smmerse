import type { Route } from "./+types/my-registrations";

import { MessageSquareMoreIcon, OctagonXIcon } from "lucide-react";
import { DateTime } from "luxon";
import { Link, redirect, useNavigate } from "react-router";

import { Button } from "~/core/components/ui/button";
import { browserClient } from "~/core/db/client.broswer";
import makeServerClient from "~/core/lib/supa-client.server";
import { getRegistratedGames } from "~/features/games/queries";

import { getOrCreateChatRoom } from "../mutations";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return redirect("/login");

  const games = await getRegistratedGames(client, user.id);

  return { games, user };
};

export default function MyRegistrations({ loaderData }: Route.ComponentProps) {
  const { games, user } = loaderData;
  const navigate = useNavigate();

  const onClickMessage = async (toUserId: string) => {
    const chatRoomId = await getOrCreateChatRoom(browserClient, {
      fromUserId: user.id,
      toUserId,
    });

    navigate(`/chats/${chatRoomId}`);
  };

  return (
    <div className="mx-auto max-w-screen-lg space-y-4 p-4">
      {games.length > 0 ? (
        games.map(({ game_id, status, game }) => {
          return (
            <Link
              to={`/games/${game_id}`}
              key={`game_${game_id}`}
              className="flex items-center justify-between gap-4 border-b py-4 last:border-0"
            >
              <p className="text-primary font-bold">{status}</p>
              <div className="flex-1">
                <span className="text-sm">
                  {DateTime.fromFormat(
                    `${game.start_date} ${game.start_time}`,
                    "yyyy-MM-dd HH:mm:ss",
                  ).toFormat("yy.MM.dd HH:mm")}
                </span>
                <h3 className="text-lg font-semibold">
                  {game.is_crawl ? game.title : game.gym.name}
                </h3>
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => onClickMessage(game.profile_id)}
              >
                <MessageSquareMoreIcon />
              </Button>
            </Link>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <OctagonXIcon
            size={80}
            strokeWidth={1}
            className="text-muted-foreground"
          />
          <p className="text-lg font-semibold">아직 신청한 경기가 없어요</p>
        </div>
      )}
    </div>
  );
}
