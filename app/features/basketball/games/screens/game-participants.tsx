import type { Route } from "./+types/game-participants";

import { CalendarIcon, RulerIcon, VenusAndMarsIcon } from "lucide-react";
import { DateTime } from "luxon";
import { Suspense } from "react";
import { Await } from "react-router";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/core/components/ui/avatar";
import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import makeServerClient from "~/core/lib/supa-client.server";
import { calculateAge } from "~/core/lib/utils";

import {
  getBasketballGameById,
  getBasketballGameParticipants,
} from "../queries";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `참가자 관리 | ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      name: "description",
      content:
        "내 모집글에 신청한 농구 게스트 참가자들을 확인하고 관리할 수 있는 페이지입니다.",
    },
  ];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const basketballGameId = Number(params.id);

  const basketballGame = await getBasketballGameById(client, basketballGameId);
  const {
    data: { user },
  } = await client.auth.getUser();

  // if (basketballGame.profile_id !== user!.id)
  //   return redirect("/basketball/games/my");

  const participants = getBasketballGameParticipants(client, basketballGameId);

  return { participants };
};

export default function GameParticipants({ loaderData }: Route.ComponentProps) {
  const today = DateTime.now();

  return (
    <Card className="mx-4 min-h-[calc(100vh-96px)] border-none p-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle>참가자 관리</CardTitle>
        <CardDescription>
          참가 신청자들의 정보를 확인하고 승인 혹은 거절하세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-0">
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
            resolve={loaderData.participants}
            children={(participants) =>
              participants.length > 0 ? (
                participants.map(
                  ({
                    participant_id,
                    profile: { avatar_url, name, birth, height, position, sex },
                  }) => (
                    <div
                      key={`participant_${participant_id}`}
                      className="space-y-4 rounded-lg border p-4 text-sm shadow md:text-base"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-8 cursor-pointer">
                            <AvatarImage src={avatar_url ?? undefined} />
                            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{name}</span>
                        </div>
                        <div className="flex gap-1">
                          {position?.map((p) => (
                            <Badge
                              key={`${p}_${participant_id}`}
                              variant="outline"
                            >
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                          <CalendarIcon
                            size={16}
                            className="text-muted-foreground"
                          />
                          <span>{birth ? calculateAge(birth) : null} 세</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <RulerIcon
                            size={16}
                            className="text-muted-foreground"
                          />
                          <span>{height} cm</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <VenusAndMarsIcon
                            size={16}
                            className="text-muted-foreground"
                          />
                          <span>{sex === "female" ? "여성" : "남성"}</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button
                          className="flex-1 cursor-pointer bg-green-500 hover:bg-green-600"
                          size="sm"
                        >
                          승인
                        </Button>
                        <Button
                          className="flex-1 cursor-pointer bg-red-500 hover:bg-red-600"
                          size="sm"
                        >
                          거절
                        </Button>
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div className="flex flex-col items-center gap-2 text-center text-xl">
                  아직 참가자가 없습니다...
                </div>
              )
            }
          ></Await>
        </Suspense>
      </CardContent>
    </Card>
  );
}
