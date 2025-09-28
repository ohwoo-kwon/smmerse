import type { Route } from "./+types/gym";

import {
  AirVentIcon,
  CircleSmallIcon,
  CopyIcon,
  GlassWaterIcon,
  MapPinIcon,
  ShowerHeadIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

import { Button } from "~/core/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/core/components/ui/carousel";
import { Textarea } from "~/core/components/ui/textarea";
import makeServerClient from "~/core/lib/supa-client.server";
import { cn, copyToClipboard, openKakaoMap } from "~/core/lib/utils";

import { getGym } from "../queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);
  const gymId = params.gymId;

  const gym = await getGym(client, gymId);

  return { gym };
};

export default function Gym({ loaderData }: Route.ComponentProps) {
  const { gym } = loaderData;

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const onClickCopy = async () => {
    const message = await copyToClipboard(gym.full_address);
    toast(message, {
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
            {gym.photos.map(({ url }) => (
              <CarouselItem key={url}>
                <img src={url} className="w-full" />
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
      </div>

      <div className="space-y-8 px-4">
        {/* 위치 */}
        <div>
          <h3>
            {gym.city} {gym.district}
          </h3>
          <h1 className="text-xl font-bold">{gym.name}</h1>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground text-sm">{gym.full_address}</p>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="outline" onClick={onClickCopy}>
                <CopyIcon />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => openKakaoMap(gym.full_address)}
              >
                <MapPinIcon />
              </Button>
            </div>
          </div>
        </div>

        {/* 시설 */}
        <div className="flex gap-8">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "text-muted-foreground flex size-14 items-center justify-center rounded-full border p-2",
                gym.has_water_dispenser
                  ? "bg-blue-200 bg-blue-300 text-blue-800"
                  : "",
              )}
            >
              <GlassWaterIcon />
            </div>
            <span
              className={cn(
                "text-muted-foreground text-xs",
                gym.has_water_dispenser ? "text-blue-800" : "line-through",
              )}
            >
              정수기
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "text-muted-foreground flex size-14 items-center justify-center rounded-full border p-2",
                gym.has_heating_cooling
                  ? "bg-green-200 bg-green-300 text-green-800"
                  : "",
              )}
            >
              <AirVentIcon />
            </div>
            <span
              className={cn(
                "text-muted-foreground text-xs",
                gym.has_heating_cooling ? "text-green-800" : "line-through",
              )}
            >
              냉난방
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "text-muted-foreground flex size-14 items-center justify-center rounded-full border p-2",
                gym.has_shower
                  ? "bg-purple-200 bg-purple-300 text-purple-800"
                  : "",
              )}
            >
              <ShowerHeadIcon />
            </div>
            <span
              className={cn(
                "text-muted-foreground text-xs",
                gym.has_shower ? "text-purple-800" : "line-through",
              )}
            >
              샤워 가능
            </span>
          </div>
        </div>

        {/* 주차 정보 */}
        <div className="space-y-1">
          <h3 className="font-semibold">주차 정보</h3>
          <Textarea
            readOnly
            defaultValue={gym.parking_info || ""}
            className="resize-none border-none shadow-none"
          />
        </div>

        {/* 이용 규칙 */}
        <div className="space-y-1">
          <h3 className="font-semibold">이용 규칙</h3>
          <Textarea
            readOnly
            defaultValue={gym.usage_rules || ""}
            className="resize-none border-none shadow-none"
          />
        </div>
      </div>
    </div>
  );
}
