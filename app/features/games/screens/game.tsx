import type { Route } from "./+types/game";

import {
  AirVentIcon,
  CircleSmallIcon,
  CopyIcon,
  GlassWaterIcon,
  MapPinIcon,
  Share2Icon,
  ShowerHeadIcon,
  SwordsIcon,
  UsersIcon,
  VenusAndMarsIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Toaster, toast } from "sonner";

import { Button } from "~/core/components/ui/button";
import { Card } from "~/core/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/core/components/ui/carousel";
import { Separator } from "~/core/components/ui/separator";
import { Spinner } from "~/core/components/ui/spinner";
import { Textarea } from "~/core/components/ui/textarea";
import { browserClient } from "~/core/db/client.broswer";
import makeServerClient from "~/core/lib/supa-client.server";
import { cn, copyToClipboard, openKakaoMap } from "~/core/lib/utils";
import { insertNotification } from "~/features/notifications/mutations";
import { getUserProfile } from "~/features/users/queries";

import { createParticipantAndSendMessage } from "../mutations";
import { getGameById } from "../queries";
import { makeCafeCOntent } from "../utils";

export const meta: Route.MetaFunction = ({ params, data }) => {
  if (!data?.game) {
    return [
      { title: `${import.meta.env.VITE_APP_NAME} | 경기 정보` },
      {
        name: "description",
        content: "스멀스에서 다양한 농구 경기를 확인하고 참가해보세요.",
      },
    ];
  }

  const game = data.game;
  const gameTitle = !game.is_crawl ? game.gym.name : game.title;

  const gameDateTime = DateTime.fromFormat(
    `${game.start_date} ${game.start_time}`,
    "yyyy-MM-dd HH:mm:ss",
  ).toFormat("yyyy년 MM월 dd일 HH:mm");

  const description = !game.is_crawl
    ? `${gameDateTime}에 ${game.gym.city} ${game.gym.district} ${game.gym.name}에서 진행되는 ${game.game_type} 경기입니다. 참가비는 ${game.fee.toLocaleString()}원이며, ${game.min_participants}명부터 ${game.max_participants}명까지 참여 가능합니다.`
    : `${gameDateTime}에 ${game.city} ${game.district}에서 진행되는 ${game.game_type} 경기입니다.`;

  const url = `https://smmerse.com/games/${params.gameId}`;
  const image =
    game.gym?.photos?.[0]?.url ||
    "https://wujxmuluphdazgapgwrr.supabase.co/storage/v1/object/public/avatars/e421200d-88ca-4711-a667-b000290ef252";

  return [
    // 기본 메타
    { title: `${import.meta.env.VITE_APP_NAME} | ${gameTitle} 경기` },
    { name: "description", content: description },

    // Open Graph
    {
      property: "og:title",
      content: `${import.meta.env.VITE_APP_NAME} | ${gameTitle} 경기`,
    },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "smmerse" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: `${import.meta.env.VITE_APP_NAME} | ${gameTitle} 경기`,
    },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },

    // 기타
    { name: "author", content: "smmerse" },
  ];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);
  const gameId = Number(params.gameId);

  const game = await getGameById(client, gameId);

  const userId = (await client.auth.getUser()).data.user?.id || null;

  const isOwner = game.profile_id === userId;

  const profile = await getUserProfile(client, { userId });

  return { game, isOwner, profile };
};

export default function Game({ loaderData }: Route.ComponentProps) {
  const { game, isOwner, profile } = loaderData;
  const gameStartDate = DateTime.fromFormat(
    game.start_date + game.start_time,
    "yyyy-MM-ddhh:mm:ss",
  );

  const navigate = useNavigate();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);

  const onClickCopy = async (copyText: string, text: string) => {
    const errMessage = await copyToClipboard(copyText);
    toast(errMessage || text, {
      action: {
        label: "확인",
        onClick: () => {},
      },
    });
  };

  const onClickRegister = async () => {
    setIsRegistering(true);

    if (!profile) {
      alert("로그인 후 참가 가능합니다.");
      navigate("/login");
    } else if (
      !profile.sex ||
      !profile.height ||
      !profile.position ||
      !profile.birth
    ) {
      alert("생년월일, 성별, 신장, 포지션 정보를 입력해주세요.");
      navigate("/my/profile");
    } else {
      try {
        await insertNotification(browserClient, {
          senderProfileId: profile.profile_id,
          recipientProfileId: game.profile_id,
          type: "GAME_JOIN_REQUEST",
          gameId: game.game_id,
        });
        const chatRoomId = await createParticipantAndSendMessage(
          browserClient,
          {
            from_user_id: profile.profile_id,
            to_user_id: game.profile_id,
            game_id: game.game_id,
          },
        );
        navigate(`/chats/${chatRoomId}`);
      } catch (error) {
        alert(error);
      }
    }
    setIsRegistering(false);
  };

  const onClickCafe = async () => {
    const cafeContent = makeCafeCOntent({
      gameId: game.game_id,
      gameType: game.game_type,
      description: game.description,
      startDate: DateTime.fromFormat(game.start_date, "yyyy-MM-dd").toFormat(
        "MM월 dd일",
      ),
      startTime: DateTime.fromFormat(game.start_time, "HH:mm:ss").toFormat(
        "HH시 mm분",
      ),
      minParticipants: game.min_participants,
      maxParticipants: game.max_participants,
      fee: game.fee,
      gameTime: game.game_time,
      city: game.gym.city,
      district: game.gym.district,
      gymName: game.gym.name,
    });

    const errorMessage = await copyToClipboard(cafeContent);

    toast(errorMessage || "글이 복사되었습니다. 카페에 글을 작성해보세요.", {
      action: {
        label: "이동",
        onClick: () => {
          window.open("https://m.cafe.daum.net/dongarry/Dilr/new", "_blank");
        },
      },
    });
  };

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="mx-auto max-w-screen-lg space-y-8">
      <div className="relative">
        <Toaster position="bottom-right" />
        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{ align: "start", loop: true }}
        >
          <CarouselContent>
            {game.gym.photos.map(({ url }) => (
              <CarouselItem key={url}>
                <img src={url} className="aspect-video w-full object-cover" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center rounded-full bg-black/50 px-2 py-1 text-xs text-white">
          {new Array(count).fill(0).map((_, idx) => (
            <CircleSmallIcon
              key={`carousel_circle_${idx}`}
              size={12}
              strokeWidth={1}
              fill={current === idx + 1 ? "white" : ""}
            />
          ))}
        </div>
        <Button
          className="absolute top-2 right-2"
          size="icon"
          variant="outline"
          onClick={() =>
            onClickCopy(
              `https://smmerse.com/games/${game.game_id}`,
              "복사된 url을 친구에게 공유해보세요",
            )
          }
        >
          <Share2Icon />
        </Button>
      </div>

      {/* 정보 */}
      <div className="space-y-8 px-4">
        <div>
          <h3 className="mb-1 font-bold">
            {gameStartDate.month}월 {gameStartDate.day}일{" "}
            {gameStartDate.weekdayLong}{" "}
            {gameStartDate.hour.toString().padStart(2, "0")}:
            {gameStartDate.minute.toString().padStart(2, "0")}
          </h3>
          {!game.is_crawl ? (
            <>
              <h1 className="text-xl font-medium underline">
                <Link
                  to={`${import.meta.env.VITE_SITE_URL}/gyms/${game.gym.gym_id}`}
                >
                  {game.gym.name}
                </Link>
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-muted-foreground text-sm">
                  {game.gym.full_address}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    className="size-7"
                    variant="outline"
                    onClick={() =>
                      onClickCopy(
                        game.gym.full_address,
                        "주소가 복사되었습니다",
                      )
                    }
                  >
                    <CopyIcon />
                  </Button>
                  <Button
                    size="icon"
                    className="size-7"
                    variant="outline"
                    onClick={() => openKakaoMap(game.gym.full_address)}
                  >
                    <MapPinIcon />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col">
              <h1 className="text-xl font-medium">{game.title}</h1>
              <h3 className="text-muted-foreground text-sm">
                {game.city} {game.district}
              </h3>
            </div>
          )}
        </div>
        {!game.link && (
          <>
            <div className="flex items-center justify-between gap-4">
              <Card className="flex w-full flex-col items-center gap-2 border-violet-300 bg-violet-100 py-2">
                <p className="text-sm text-violet-400">참가비</p>
                <p className="text-lg font-semibold text-violet-700">
                  {game.fee.toLocaleString()} 원
                </p>
              </Card>
              <Card className="flex w-full flex-col items-center gap-2 border-pink-300 bg-pink-100 py-2">
                <p className="text-sm text-pink-400">플레이 시간</p>
                <p className="text-lg font-semibold text-pink-700">
                  {game.game_time}
                </p>
              </Card>
            </div>
            <div className="grid grid-cols-2 gap-4 font-light">
              <div className="flex items-center justify-center gap-2">
                <VenusAndMarsIcon strokeWidth={1} size={20} />
                <span>{game.game_gender_type}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <SwordsIcon strokeWidth={1} size={20} />
                <span>{game.game_type}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <UsersIcon strokeWidth={1} size={20} />
                <span>
                  {game.min_participants}명 ~ {game.max_participants}명
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <h5 className="font-semibold">모집 포지션</h5>
              <div className="flex items-center justify-between gap-4">
                <Button
                  className="flex-1"
                  variant={game.guard ? "default" : "secondary"}
                  disabled={!game.guard}
                >
                  가드
                </Button>
                <Button
                  className="flex-1"
                  variant={game.forward ? "default" : "secondary"}
                  disabled={!game.forward}
                >
                  포워드
                </Button>
                <Button
                  className="flex-1"
                  variant={game.center ? "default" : "secondary"}
                  disabled={!game.center}
                >
                  센터
                </Button>
              </div>
            </div>
          </>
        )}
        {game.description && (
          <>
            <Separator />
            <div className="space-y-1">
              <h5 className="font-semibold">경기 소개</h5>
              <Textarea
                readOnly
                className="cursor-default resize-none border-none shadow-none focus-visible:ring-0"
                defaultValue={game.description}
              />
            </div>
          </>
        )}
        {!game.link && (
          <>
            <Separator />
            <div className="space-y-1">
              <h5 className="font-semibold">체육관 시설</h5>
              <div className="flex items-center justify-around gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "text-muted-foreground flex size-14 items-center justify-center rounded-full border p-2",
                      game.gym.has_water_dispenser
                        ? "bg-blue-200 bg-blue-300 text-blue-800"
                        : "",
                    )}
                  >
                    <GlassWaterIcon />
                  </div>
                  <span
                    className={cn(
                      "text-muted-foreground text-xs",
                      game.gym.has_water_dispenser
                        ? "text-blue-800"
                        : "line-through",
                    )}
                  >
                    정수기
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "text-muted-foreground flex size-14 items-center justify-center rounded-full border p-2",
                      game.gym.has_heating_cooling
                        ? "bg-green-200 bg-green-300 text-green-800"
                        : "",
                    )}
                  >
                    <AirVentIcon />
                  </div>
                  <span
                    className={cn(
                      "text-muted-foreground text-xs",
                      game.gym.has_heating_cooling
                        ? "text-green-800"
                        : "line-through",
                    )}
                  >
                    냉난방
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "text-muted-foreground flex size-14 items-center justify-center rounded-full border p-2",
                      game.gym.has_shower
                        ? "bg-purple-200 bg-purple-300 text-purple-800"
                        : "",
                    )}
                  >
                    <ShowerHeadIcon />
                  </div>
                  <span
                    className={cn(
                      "text-muted-foreground text-xs",
                      game.gym.has_shower ? "text-purple-800" : "line-through",
                    )}
                  >
                    샤워 가능
                  </span>
                </div>
              </div>
            </div>
            {game.gym.description && (
              <>
                <Separator />
                <div className="space-y-1">
                  <h5 className="font-semibold">체육관 소개</h5>
                  <Textarea
                    readOnly
                    className="cursor-default resize-none border-none shadow-none focus-visible:ring-0"
                    defaultValue={game.gym.description}
                  />
                </div>
              </>
            )}
            {game.gym.parking_info && (
              <>
                <Separator />
                <div className="space-y-1">
                  <h5 className="font-semibold">주차 정보</h5>
                  <Textarea
                    readOnly
                    className="cursor-default resize-none border-none shadow-none focus-visible:ring-0"
                    defaultValue={game.gym.parking_info}
                  />
                </div>
              </>
            )}
            {game.gym.usage_rules && (
              <>
                <Separator />
                <div className="space-y-1">
                  <h5 className="font-semibold">이용 규칙</h5>
                  <Textarea
                    readOnly
                    className="cursor-default resize-none border-none shadow-none focus-visible:ring-0"
                    defaultValue={game.gym.usage_rules}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
      <div className="bg-background sticky bottom-0 left-0 w-screen max-w-screen-lg space-y-2 border-t-1 px-4 py-5">
        {game.link && (
          <Button className="w-full" variant="secondary" asChild>
            <Link to={game.link} target="_blank">
              링크
            </Link>
          </Button>
        )}
        {isOwner ? (
          <>
            <Button
              className="w-full"
              onClick={onClickCafe}
              variant="secondary"
            >
              카페 글 작성
            </Button>
            <Button className="w-full" asChild>
              <Link to="participants">참가자 관리</Link>
            </Button>
          </>
        ) : (
          <Button
            className="w-full"
            onClick={onClickRegister}
            disabled={isRegistering}
          >
            {isRegistering ? <Spinner /> : "참가 신청"}
          </Button>
        )}
      </div>
    </div>
  );
}
