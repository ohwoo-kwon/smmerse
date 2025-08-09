import type { Route } from "./+types/game";

import {
  CalendarIcon,
  DotIcon,
  HandCoinsIcon,
  Loader2Icon,
  MapPinIcon,
  MessageSquareIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import { Link, useFetcher } from "react-router";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/core/components/ui/avatar";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Textarea } from "~/core/components/ui/textarea";
import makeServerClient from "~/core/lib/supa-client.server";

import { basketballSkillLevelMap, genderTypeMap } from "../constants";
import { getBasketballGameById } from "../queries";

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    {
      title: `${data?.game?.title || "농구 게스트 모집"} | ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      name: "description",
      content: data?.game?.description,
    },
  ];
};

export async function loader({ request, params }: Route.LoaderArgs) {
  if (!params.id) {
    throw new Response("Not Found", { status: 404 });
  }
  const [client] = makeServerClient(request);
  const game = await getBasketballGameById(client, Number(params.id));
  const {
    data: { user },
  } = await client.auth.getUser();
  // if (!user) return redirect("/login");
  const isOwner = user?.id === game.profile_id;

  return { game, isOwner };
}

export default function Game({ loaderData }: Route.ComponentProps) {
  const { game, isOwner } = loaderData;

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const handleSubmit = async () => {
    const isOk = confirm(
      `${game.profiles?.name || "호스트"}에게 참가 신청 메시지를 보낼까요?`,
    );
    if (!isOk) return;

    fetcher.submit(
      { content: `[${game.title}] 참가 신청합니다.` },
      {
        method: "POST",
        action: `/api/users/message/${game.profile_id}`,
      },
    );
  };

  if (!game) {
    return <div>경기를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="space-y-8 p-4">
      <Card className="border-t-primary mx-auto max-w-4xl border-t-8">
        <CardHeader>
          <CardTitle className="overflow-x-auto overflow-y-hidden break-words whitespace-normal">
            {game.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-0">
            <span>
              {game.sido} {game.city}
            </span>
            <DotIcon size={16} />
            <span>{basketballSkillLevelMap[game.skillLevel]}</span>
            <DotIcon size={16} />
            <span>{genderTypeMap[game.genderType]}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <div className="flex items-center gap-2">
              <CalendarIcon size={16} className="text-primary" />
              <span>
                {DateTime.fromFormat(game.date, "yyyy-MM-dd")
                  .setLocale("ko")
                  .toFormat("M월 d일 (ccc)")}
              </span>
              <span>
                {DateTime.fromFormat(game.startTime, "HH:mm:ss").toFormat(
                  "HH:mm",
                )}{" "}
                -{" "}
                {DateTime.fromFormat(game.endTime, "HH:mm:ss").toFormat(
                  "HH:mm",
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon size={16} className="text-primary" />
              <span>{game.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon size={16} className="text-primary" />
              <span>{game.maxParticipants} 명</span>
            </div>
            <div className="flex items-center gap-2">
              <HandCoinsIcon size={16} className="text-primary" />
              <span>{game.fee.toLocaleString()} 원</span>
            </div>
          </div>
          <div className="break-words">
            <p className="text-base font-semibold">경기 설명</p>
            <Textarea
              readOnly
              className="resize-none"
              defaultValue={game.description || ""}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {game.link && (
            <Button asChild variant="outline" className="w-full">
              <Link to={game.link} target="_blank">
                링크
              </Link>
            </Button>
          )}
          {isOwner && (
            <Button asChild variant="secondary" className="w-full">
              <Link to={`/basketball/games/${game.basketballGameId}/edit`}>
                수정
              </Link>
            </Button>
          )}
          {!isOwner && game.profile_id && (
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                "참가 신청"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
      {game.profiles && (
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle>호스트 정보</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={game.profiles?.avatar_url || ""}
                  alt={game.profiles?.name}
                />
                <AvatarFallback>
                  <UserIcon className="text-neutral-400" />
                </AvatarFallback>
              </Avatar>
              <p>{game.profiles?.name}</p>
            </div>
            {/* <Button size="icon" disabled>
              <MessageSquareIcon />
            </Button> */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
