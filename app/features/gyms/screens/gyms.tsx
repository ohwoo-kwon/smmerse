import type { Route } from "./+types/gyms";

import {
  AirVentIcon,
  GlassWaterIcon,
  OctagonXIcon,
  ShowerHeadIcon,
} from "lucide-react";
import { Fragment } from "react";
import { Link, useSearchParams } from "react-router";

import AdsenseInfeed from "~/core/components/adsense-infeed";
import KakaoAdfit from "~/core/components/kakao-ad-fit";
import { Button } from "~/core/components/ui/button";
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

import { getGymsShort } from "../queries";
import { cityEnum } from "../schema";

export const meta: Route.MetaFunction = () => {
  const title = `${import.meta.env.VITE_APP_NAME} | 농구 체육관 찾기`;
  const description =
    "전국 농구 체육관을 지역별로 검색하고, 정수기·냉난방·샤워실 등 편의시설 조건에 맞는 체육관을 쉽게 확인하세요.";
  const url = "https://smmerse.com/gyms";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "농구 체육관, 농구장, 농구장 대관, 농구장 검색, 농구 시설, 농구 샤워실, 농구 냉난방, 농구 정수기",
    },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    {
      property: "og:image",
      content: `https://wujxmuluphdazgapgwrr.supabase.co/storage/v1/object/public/avatars/e421200d-88ca-4711-a667-b000290ef252`,
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: `https://wujxmuluphdazgapgwrr.supabase.co/storage/v1/object/public/avatars/e421200d-88ca-4711-a667-b000290ef252`,
    },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);
  const { searchParams } = new URL(request.url);

  const sido = searchParams.get("sido") as
    | (typeof cityEnum.enumValues)[number]
    | null;
  const hasWater = !!searchParams.get("hasWater");
  const hasHeatAndCool = !!searchParams.get("hasHeatAndCool");
  const hasShower = !!searchParams.get("hasShower");

  const gyms = await getGymsShort(client, {
    sido,
    has_water_dispenser: hasWater,
    has_heating_cooling: hasHeatAndCool,
    has_shower: hasShower,
  });

  return { gyms };
};

export default function Gyms({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const sido = searchParams.get("sido");
  const hasWater = searchParams.get("hasWater");
  const hasHeatAndCool = searchParams.get("hasHeatAndCool");
  const hasShower = searchParams.get("hasShower");

  const handleFilterChange = (key: string, value: string | boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "" || value === false) newParams.delete(key);
    else newParams.set(key, value.toString());

    setSearchParams(newParams);
  };

  return (
    <div className="mx-auto max-w-screen-lg space-y-4 p-4">
      <h1 className="text-3xl font-bold">체육관</h1>

      {/* 필터 */}
      <div className="bg-background sticky top-0 space-x-1 py-2">
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant={sido ? "default" : "outline"}
              className={cn(
                "rounded-full",
                sido ? "" : "text-muted-foreground",
              )}
              size="sm"
            >
              {sido || "지역"}
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
                  모든 지역
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
        <Button
          variant={hasWater === "true" ? "default" : "outline"}
          className={cn(
            "rounded-full",
            hasWater === "true" ? "" : "text-muted-foreground",
          )}
          size="sm"
          onClick={() =>
            handleFilterChange("hasWater", hasWater === "true" ? false : true)
          }
        >
          정수기
        </Button>
        <Button
          variant={hasHeatAndCool === "true" ? "default" : "outline"}
          className={cn(
            "rounded-full",
            hasHeatAndCool === "true" ? "" : "text-muted-foreground",
          )}
          size="sm"
          onClick={() =>
            handleFilterChange(
              "hasHeatAndCool",
              hasHeatAndCool === "true" ? false : true,
            )
          }
        >
          냉난방
        </Button>
        <Button
          variant={hasShower === "true" ? "default" : "outline"}
          className={cn(
            "rounded-full",
            hasShower === "true" ? "" : "text-muted-foreground",
          )}
          size="sm"
          onClick={() =>
            handleFilterChange("hasShower", hasShower === "true" ? false : true)
          }
        >
          샤워실
        </Button>
      </div>

      <div className="space-y-2">
        <KakaoAdfit />
      </div>

      {/* 경기 목록 */}
      <div>
        {loaderData.gyms.length > 0 ? (
          loaderData.gyms.map(
            ({
              gym_id,
              name,
              full_address,
              has_water_dispenser,
              has_heating_cooling,
              has_shower,
            }) => (
              <Link
                key={gym_id}
                to={`/gyms/${gym_id}`}
                className="flex items-center gap-4 border-b py-4 last:border-0"
              >
                <div className="flex-1 text-sm">
                  <div className="text-lg font-semibold">{name}</div>
                  <div className="text-muted-foreground">{full_address}</div>
                </div>
                <div className="flex gap-2">
                  <div
                    className={cn(
                      "rounded-full border p-1",
                      has_water_dispenser
                        ? "border-blue-300 bg-blue-100 text-blue-800"
                        : "text-muted-foreground",
                    )}
                  >
                    <GlassWaterIcon size={16} />
                  </div>
                  <div
                    className={cn(
                      "rounded-full border p-1",
                      has_heating_cooling
                        ? "border-green-300 bg-green-100 text-green-800"
                        : "text-muted-foreground",
                    )}
                  >
                    <AirVentIcon size={16} />
                  </div>
                  <div
                    className={cn(
                      "rounded-full border p-1",
                      has_shower
                        ? "border-purple-300 bg-purple-100 text-purple-800"
                        : "text-muted-foreground",
                    )}
                  >
                    <ShowerHeadIcon size={16} />
                  </div>
                </div>
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
            <p className="text-lg font-semibold">조건에 맞는 체육관이 없어요</p>
            {/* <Button>체육관 등록 요청</Button> */}
          </div>
        )}
      </div>
    </div>
  );
}
