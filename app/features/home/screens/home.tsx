import type { Route } from "./+types/home";

import { DotIcon, OctagonXIcon, PlusIcon } from "lucide-react";
import { DateTime } from "luxon";
import { Fragment } from "react";
import { Link, useSearchParams } from "react-router";

import { Button } from "~/core/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/core/components/ui/carousel";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/core/components/ui/drawer";
import { ScrollArea } from "~/core/components/ui/scroll-area";
import { Separator } from "~/core/components/ui/separator";
import makeServerClient from "~/core/lib/supa-client.server";
import { cn } from "~/core/lib/utils";
import { getGamesShort } from "~/features/games/queries";
import { cityEnum } from "~/features/gyms/schema";

export const meta: Route.MetaFunction = () => {
  const title = `${import.meta.env.VITE_APP_NAME} | 농구 게스트 & 픽업 게임 모집 플랫폼`;
  const description =
    "전국 농구 게스트 참가와 픽업 게임을 쉽게 찾고 모집하세요. 날짜, 지역, 시설 조건(정수기, 냉난방, 샤워실) 필터로 원하는 경기를 빠르게 확인할 수 있습니다.";
  const url = "https://smmerse.com";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "농구, 게스트, 픽업게임, 농구모임, 체육관, 농구경기, 농구장 대관",
    },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    {
      property: "og:image",
      content:
        "https://wujxmuluphdazgapgwrr.supabase.co/storage/v1/object/public/avatars/e421200d-88ca-4711-a667-b000290ef252",
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content:
        "https://wujxmuluphdazgapgwrr.supabase.co/storage/v1/object/public/avatars/e421200d-88ca-4711-a667-b000290ef252",
    },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const { searchParams } = new URL(request.url);

  const date = searchParams.get("date");
  const sido = searchParams.get("sido") as
    | (typeof cityEnum.enumValues)[number]
    | null;
  const hasWater = !!searchParams.get("hasWater");
  const hasHeatAndCool = !!searchParams.get("hasHeatAndCool");
  const hasShower = !!searchParams.get("hasShower");

  const games = await getGamesShort(client, {
    start_date: date,
    sido,
    has_water_dispenser: hasWater,
    has_heating_cooling: hasHeatAndCool,
    has_shower: hasShower,
  });

  return { games };
};

export default function Home({ loaderData }: Route.ComponentProps) {
  const today = DateTime.now();

  const [searchParams, setSearchParams] = useSearchParams();

  const sido = searchParams.get("sido");
  const date = searchParams.get("date");
  const clikedDateTime = date ? DateTime.fromFormat(date, "yyyyMMdd") : today;

  const handleFilterChange = (key: string, value: string | boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "" || value === false) newParams.delete(key);
    else newParams.set(key, value.toString());

    setSearchParams(newParams);
  };

  return (
    <div className="mx-auto max-w-screen-lg space-y-4 p-4">
      <div className="bg-background sticky top-0 space-y-2 py-2">
        {/* 날짜 */}
        <Carousel opts={{ align: "start" }}>
          <CarouselContent className="m-0">
            {new Array(14).fill(0).map((v, i) => {
              const date = today.plus({ days: i });
              const isHoliday = date.isWeekend;
              const isSat = date.weekday === 6;

              return (
                <CarouselItem
                  className={cn(
                    "flex basis-1/7 cursor-pointer flex-col items-center gap-1 rounded-md px-0 py-2 transition-all",
                    isHoliday ? "text-red-500" : "",
                    isSat ? "text-blue-500" : "",
                    clikedDateTime.day === date.day
                      ? "bg-primary text-primary-foreground"
                      : "",
                  )}
                  key={`date_${i}`}
                  onClick={() =>
                    handleFilterChange("date", date.toFormat("yyyyMMdd"))
                  }
                >
                  <span>{date.day}</span>
                  <span>{date.weekdayShort}</span>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* 필터 */}
        <div>
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant={sido ? "default" : "outline"}
                className={cn("rounded-full", sido ? "" : "text-neutral-400")}
                size="sm"
              >
                {sido || "전국"}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>지역</DrawerTitle>
                <DrawerDescription>지역을 선택해주세요.</DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="h-70">
                <div className="flex flex-col gap-2">
                  <DrawerClose onClick={() => handleFilterChange("sido", "")}>
                    전국
                  </DrawerClose>
                  {cityEnum.enumValues.map((value) => (
                    <Fragment key={value}>
                      <Separator className="mx-4" />
                      <DrawerClose
                        onClick={() => handleFilterChange("sido", value)}
                      >
                        {value}
                      </DrawerClose>
                    </Fragment>
                  ))}
                </div>
              </ScrollArea>
              <DrawerFooter></DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* 경기 목록 */}
      <div>
        {loaderData.games.length > 0 ? (
          loaderData.games.map(
            ({
              game_id,
              start_time,
              gym,
              game_type,
              game_gender_type,
              game_time,
              max_participants,
              fee,
              city,
              district,
            }) => (
              <Link
                to={`/games/${game_id}`}
                key={`game_${game_id}`}
                className="flex flex-col items-start border-b py-4 last:border-0"
              >
                <div className="flex flex-col items-center">
                  <span className="font-bold">{start_time.slice(0, 5)}</span>
                </div>
                <div className="flex-1 -space-y-1 text-sm">
                  <div className="text-lg font-semibold">{gym.name}</div>
                  <div className="text-muted-foreground flex flex-wrap items-center text-xs">
                    <span>
                      {city || gym.city} {district || gym.district}
                    </span>
                    <span className="-mx-1">
                      <DotIcon strokeWidth={1} />
                    </span>
                    <span>{game_time}</span>
                    <span className="-mx-1">
                      <DotIcon strokeWidth={1} />
                    </span>
                    <span>{game_type}</span>
                    <span className="-mx-1">
                      <DotIcon strokeWidth={1} />
                    </span>
                    <span>
                      {game_gender_type === "상관없음"
                        ? "성별무관"
                        : game_gender_type}
                    </span>
                    <span className="-mx-1">
                      <DotIcon strokeWidth={1} />
                    </span>
                    <span>{max_participants}명</span>
                  </div>
                </div>
                <div className="font-bold">{fee.toLocaleString()} 원</div>
              </Link>
            ),
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <OctagonXIcon
              size={80}
              strokeWidth={1}
              className="text-muted-foreground"
            />
            <p className="text-lg font-semibold">아직 등록된 경기가 없어요</p>
          </div>
        )}
      </div>
      <Button
        className="absolute right-6 bottom-6 size-12 rounded-full"
        asChild
      >
        <Link to="/games/create">
          <PlusIcon className="size-6" />
        </Link>
      </Button>
    </div>
  );
}
