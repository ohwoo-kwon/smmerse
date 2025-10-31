import type { Route } from "./+types/participants";

import {
  CircleSmallIcon,
  CopyIcon,
  MapPinIcon,
  OctagonXIcon,
  Share2Icon,
} from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Link, redirect } from "react-router";
import { Toaster, toast } from "sonner";

import { Button } from "~/core/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/core/components/ui/carousel";
import { Separator } from "~/core/components/ui/separator";
import makeServerClient from "~/core/lib/supa-client.server";
import { copyToClipboard, openKakaoMap } from "~/core/lib/utils";

import ParticipantCard from "../components/participant-card";
import { getGameById, getGameParticipants } from "../queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);
  const gameId = Number(params.gameId);

  const game = await getGameById(client, gameId);
  const participants = await getGameParticipants(client, gameId);

  const userId = (await client.auth.getUser()).data.user?.id;

  const isOwner = game.profile_id === userId;

  if (!isOwner) return redirect(`/games/${game.game_id}`);

  return { game, participants };
};

export default function Participants({ loaderData }: Route.ComponentProps) {
  const { game, participants } = loaderData;
  const gameStartDate = DateTime.fromFormat(
    game.start_date + game.start_time,
    "yyyy-MM-ddhh:mm:ss",
  );

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const onClickCopy = async (copyText: string, text: string) => {
    const errMessage = await copyToClipboard(copyText);
    toast(errMessage || text, {
      action: {
        label: "확인",
        onClick: () => {},
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

        <Separator />

        <div>
          <div className="text-lg font-bold">참가자 관리</div>
          {participants.length > 0 ? (
            participants.map(
              ({ profile, profile_id, participant_id, status: initStatus }) => (
                <ParticipantCard
                  key={`participant_${participant_id}`}
                  participant_id={participant_id}
                  profile_id={profile_id}
                  owner_id={game.profile_id}
                  game_id={game.game_id}
                  gym_name={game.gym.name}
                  avatar_url={profile.avatar_url || ""}
                  position={profile.position || []}
                  name={profile.name}
                  sex={profile.sex || ""}
                  birth={profile.birth || ""}
                  height={profile.height || 0}
                  initStatus={initStatus}
                />
              ),
            )
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <OctagonXIcon
                size={80}
                strokeWidth={1}
                className="text-muted-foreground"
              />
              <p className="text-lg font-semibold">아직 참가자가 없어요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
