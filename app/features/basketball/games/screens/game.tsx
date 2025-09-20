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
import { useEffect } from "react";
import { Link, data, redirect, useFetcher, useNavigate } from "react-router";
import { z } from "zod";

import AdsenseBanner from "~/core/components/adsense-banner";
import FormErrors from "~/core/components/form-errors";
import KakaoAdfit from "~/core/components/kakao-ad-fit";
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
import { getUserProfile } from "~/features/users/queries";

import { basketballSkillLevelMap, genderTypeMap } from "../constants";
import { applyForGame } from "../mutations";
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

const formSchema = z.object({
  basketballGameId: z.coerce.number(),
});

export async function action({ request }: Route.ActionArgs) {
  const [client] = makeServerClient(request);
  const formData = await request.formData();
  const {
    data: validData,
    success,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));

  if (!success) {
    return data({ fieldErrors: error.flatten().fieldErrors }, { status: 400 });
  }

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return redirect("/login");

  const { success: applySuccess, message } = await applyForGame(client, {
    basketballGameId: validData.basketballGameId,
    profileId: user.id,
  });

  return { success: applySuccess, message };
}

export async function loader({ request, params }: Route.LoaderArgs) {
  if (!params.id) {
    throw new Response("Not Found", { status: 404 });
  }
  const [client] = makeServerClient(request);
  const game = await getBasketballGameById(client, Number(params.id));
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return redirect("/login");

  const isOwner = user.id === game.profile_id;

  const profile = await getUserProfile(client, { userId: user.id });

  if (!profile) return redirect("/login");

  return { game, isOwner, profile };
}

export default function Game({ loaderData }: Route.ComponentProps) {
  const { game, isOwner, profile } = loaderData;
  const navigate = useNavigate();

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const handleSubmit = async () => {
    if (!(profile.birth && profile.height && profile.position)) {
      alert("프로필 정보를 입력해주셔야 참가 신청이 가능합니다.");
      navigate("/profile");
    }

    fetcher.submit(
      { basketballGameId: game.basketball_game_id },
      { method: "POST" },
    );
  };

  const handleClickChat = () => {
    fetcher.submit(
      { fromUserId: profile.profile_id, toUserId: game.profile_id },
      { method: "POST", action: "/api/users/chat-room" },
    );
  };

  useEffect(() => {
    if (fetcher.data && "success" in fetcher.data && fetcher.data.success)
      navigate("/basketball/games/participation");
  }, [fetcher.data]);

  if (!game) {
    return <div>경기를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="mx-auto max-w-screen-md space-y-8 p-4">
      <AdsenseBanner adSlot="2973856464" />
      <KakaoAdfit />
      <Card className="border-t-primary border-t-8">
        <CardHeader>
          <CardTitle className="overflow-x-auto overflow-y-hidden break-words whitespace-normal">
            {game.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-0">
            <span>
              {game.sido} {game.city}
            </span>
            <DotIcon size={16} />
            <span>{basketballSkillLevelMap[game.skill_level]}</span>
            <DotIcon size={16} />
            <span>{genderTypeMap[game.gender_type]}</span>
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
                {DateTime.fromFormat(game.start_time, "HH:mm:ss").toFormat(
                  "HH:mm",
                )}{" "}
                -{" "}
                {DateTime.fromFormat(game.end_time, "HH:mm:ss").toFormat(
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
              <span>{game.max_participants} 명</span>
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
            <Button asChild className="w-full">
              <Link
                to={`/basketball/games/${game.basketball_game_id}/participants`}
              >
                참가자 관리
              </Link>
            </Button>
          )}
          {isOwner && (
            <Button asChild variant="secondary" className="w-full">
              <Link to={`/basketball/games/${game.basketball_game_id}/edit`}>
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
          {fetcher.data &&
            "message" in fetcher.data &&
            fetcher.data.message && (
              <FormErrors errors={[fetcher.data.message]} />
            )}
        </CardFooter>
      </Card>
      {!isOwner && game.profiles && (
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
            <Button
              size="icon"
              className="cursor-pointer"
              onClick={handleClickChat}
            >
              <MessageSquareIcon />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
