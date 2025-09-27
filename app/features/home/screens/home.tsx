import type { Route } from "./+types/home";

import { OctagonXIcon } from "lucide-react";
import { DateTime } from "luxon";
import { Fragment, useState } from "react";

import { Badge } from "~/core/components/ui/badge";
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
import { cn } from "~/core/lib/utils";

export const meta: Route.MetaFunction = () => {
  return [
    { title: import.meta.env.VITE_APP_NAME },
    { name: "description", content: "농구 게스트 및 픽업 게임 모집글" },
  ];
};

const SIDO = [
  "서울",
  "경기",
  "인천",
  "강원",
  "부산",
  "대구",
  "광주",
  "대전",
  "세종",
  "울산",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

export default function Home() {
  const today = DateTime.now();

  const [clickedDate, setClickedDate] = useState(today);
  const [sido, setSido] = useState("");

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
                    clickedDate.day === date.day
                      ? "bg-primary text-primary-foreground"
                      : "",
                  )}
                  key={`date_${i}`}
                  onClick={() => setClickedDate(date)}
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
                className="rounded-full"
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
                  <DrawerClose onClick={() => setSido("")}>
                    모든 지역
                  </DrawerClose>
                  {SIDO.map((value) => (
                    <Fragment key={value}>
                      <Separator className="mx-4" />
                      <DrawerClose onClick={() => setSido(value)}>
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
        {new Array(50).fill(0).map((_, idx) => (
          <div
            key={idx}
            className="flex cursor-pointer items-center gap-4 border-b py-4 last:border-0"
          >
            <div>
              <span className="font-semibold">21:00</span>
            </div>
            <div className="flex-1 space-y-1 text-sm">
              <div>시흥 익투스</div>
              <div className="flex gap-1">
                <Badge variant="secondary">3vs3</Badge>
                <Badge variant="secondary">3vs3</Badge>
                <Badge variant="secondary">3vs3</Badge>
              </div>
            </div>
            <div className="font-bold">5,000 원</div>
          </div>
        ))}
        {/* <div className="flex flex-col items-center justify-center gap-4">
          <OctagonXIcon size={80} strokeWidth={1} />
          <p className="text-lg font-semibold">아직 등록된 경기가 없어요</p>
        </div> */}
      </div>
    </div>
  );
}
