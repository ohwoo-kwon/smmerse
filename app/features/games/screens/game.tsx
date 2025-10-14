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

import AdsenseInfeed from "~/core/components/adsense-infeed";
import KakaoAdfit from "~/core/components/kakao-ad-fit";
import { Button } from "~/core/components/ui/button";
import { Card } from "~/core/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/core/components/ui/carousel";
import { Separator } from "~/core/components/ui/separator";
import { Textarea } from "~/core/components/ui/textarea";
import { browserClient } from "~/core/db/client.broswer";
import makeServerClient from "~/core/lib/supa-client.server";
import { cn, copyToClipboard, openKakaoMap } from "~/core/lib/utils";

import { createParticipantAndSendMessage } from "../mutations";
import { getGameById } from "../queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);
  const gameId = Number(params.gameId);

  const game = await getGameById(client, gameId);

  return { game };
};

export default function Game({ loaderData }: Route.ComponentProps) {
  const { game } = loaderData;
  const gameStartDate = DateTime.fromFormat(
    game.start_date + game.start_time,
    "yyyy-MM-ddhh:mm:ss",
  );

  const navigate = useNavigate();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const onClickCopy = async (copyText: string, text: string) => {
    const message = await copyToClipboard(copyText, text);
    toast(message, {
      action: {
        label: "확인",
        onClick: () => {},
      },
    });
  };

  const onClickRegister = async () => {
    const {
      data: { user },
    } = await browserClient.auth.getUser();
    if (!user) {
      alert("로그인 후 참가 가능합니다.");
      navigate("/login");
    } else {
      const chatRoomId = await createParticipantAndSendMessage(browserClient, {
        from_user_id: user.id,
        to_user_id: game.profile_id,
        game_id: game.game_id,
      });
      navigate(`/chats/${chatRoomId}`);
    }
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
    <div className="mx-auto mb-16 max-w-screen-lg space-y-8">
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
          {!game.link ? (
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
            <h1 className="text-xl font-medium">
              {game.city} {game.district}
            </h1>
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
      <div className="bg-background fixed bottom-0 left-0 w-screen space-y-2 border-t-1 px-4 py-5">
        {game.link && (
          <Button className="w-full" variant="secondary" asChild>
            <Link to={game.link} target="_blank">
              링크
            </Link>
          </Button>
        )}
        <Button className="w-full" onClick={onClickRegister}>
          참가 신청
        </Button>
      </div>
    </div>
  );
}
