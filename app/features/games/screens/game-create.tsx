import type { Route } from "./+types/game-create";

import { CalendarIcon, Loader2Icon, SearchIcon } from "lucide-react";
import { DateTime } from "luxon";
import { type ChangeEvent, useEffect, useState } from "react";
import { redirect, useFetcher, useNavigate } from "react-router";
import { z } from "zod";

import FormErrors from "~/core/components/form-errors";
import { Button } from "~/core/components/ui/button";
import { Calendar } from "~/core/components/ui/calendar";
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
import { Input } from "~/core/components/ui/input";
import { Label } from "~/core/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/core/components/ui/popover";
import { ScrollArea } from "~/core/components/ui/scroll-area";
import { Textarea } from "~/core/components/ui/textarea";
import { browserClient } from "~/core/db/client.broswer";
import makeServerClient from "~/core/lib/supa-client.server";
import { cn } from "~/core/lib/utils";
import { getGymByName } from "~/features/gyms/queries";
import { cityEnum } from "~/features/gyms/schema";

import { insertGame } from "../mutations";
import { gameGenderTypeEnum, gameTimeEnum, gameTypeEnum } from "../schema";

const formSchema = z.object({
  gym_id: z.string().min(1, "체육관을 선택해주세요"),
  game_type: z.enum(gameTypeEnum.enumValues, {
    message: "경기 유형을 선택해주세요",
  }),
  game_gender_type: z.enum(gameGenderTypeEnum.enumValues, {
    message: "성별을 선택해주세요",
  }),
  description: z.string().nullable(),
  start_date: z.string().min(1, "날짜를 선택해주세요"),
  start_time: z.string().min(1, "시간을 선택해주세요"),
  game_time: z.enum(gameTimeEnum.enumValues, {
    message: "플레이 시간을 선택해주세요",
  }),
  guard: z.coerce.boolean(),
  forward: z.coerce.boolean(),
  center: z.coerce.boolean(),
  min_participants: z.coerce.number({ message: "최소 인원을 작성해주세요" }),
  max_participants: z.coerce.number({ message: "최대 인원을 작성해주세요" }),
  fee: z.coerce.number({ message: "참가비를 작성해주세요" }),
  city: z.enum(cityEnum.enumValues),
  district: z.string(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return redirect("/login");

  const formData = await request.formData();

  const formValidation = formSchema.safeParse(Object.fromEntries(formData));

  if (!formValidation.success)
    return {
      fieldErrors: formValidation.error.flatten().fieldErrors,
      error: undefined,
    };

  try {
    await insertGame(client, { profile_id: user.id, ...formValidation.data });
  } catch (error) {
    if (error instanceof Error)
      return { fieldErrors: undefined, error: error.message };
    return {
      fieldErrors: undefined,
      error: "게스트 모집 등록에 실패하였습니다",
    };
  }

  return redirect("/");
};

export default function GameCreate() {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const isSubmitting = fetcher.state === "submitting";

  const [page, setPage] = useState(0);
  const [game, setGame] = useState({
    gym_id: "",
    gym_name: "",
    game_type: "5on5",
    game_gender_type: "남자",
    description: "",
    start_date: DateTime.now().toFormat("yyyy-MM-dd"),
    start_time: "19:00",
    game_time: "2시간",
    guard: true,
    forward: true,
    center: true,
    min_participants: 0,
    max_participants: 10,
    fee: 5000,
    city: "서울",
    district: "강남구",
  });
  const [gymText, setGymText] = useState("");
  const [gyms, setGyms] = useState<
    {
      gym_id: string;
      name: string;
      full_address: string;
      city: string;
      district: string;
    }[]
  >([]);

  const onClickNext = () => {
    setPage((prev) => prev + 1);
  };

  const onClickPrev = () => {
    setPage((prev) => prev - 1);
  };

  const onClickRegister = async () => {
    fetcher.submit(
      {
        gym_id: game.gym_id,
        game_type: game.game_type,
        game_gender_type: game.game_gender_type,
        description: game.description,
        start_date: game.start_date,
        start_time: game.start_time,
        game_time: game.game_time,
        min_participants: game.min_participants,
        max_participants: game.max_participants,
        fee: game.fee,
        guard: game.guard ? true : "",
        forward: game.forward ? true : "",
        center: game.center ? true : "",
        city: game.city,
        district: game.district,
      },
      {
        method: "POST",
      },
    );
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { id, value },
    } = e;
    setGame((prev) => ({ ...prev, [id]: value }));
  };

  const onChangeDate = (date: string) =>
    setGame((prev) => ({ ...prev, start_date: date }));

  const onChangeGym = (
    gymId: string,
    gymName: string,
    city: string,
    district: string,
  ) =>
    setGame((prev) => ({
      ...prev,
      gym_id: gymId,
      gym_name: gymName,
      city,
      district,
    }));

  const onChangeGymText = (e: ChangeEvent<HTMLInputElement>) => {
    setGymText(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (gymText.trim() !== "") {
        const gyms = await getGymByName(browserClient, gymText);
        setGyms(gyms);
      }
    }, 500); // 0.5초 디바운스

    return () => {
      clearTimeout(handler);
    };
  }, [gymText]);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const {
        data: { user },
      } = await browserClient.auth.getUser();
      if (!user) {
        alert("로그인 후 게스트 모집글 생성이 가능합니다.");
        navigate("/login");
      }
    };

    checkLoggedIn();
  }, []);

  const getPageNode = () => {
    switch (page) {
      case 0:
        return (
          <div className="space-y-8">
            <h1 className="text-xl font-bold">일정</h1>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="start_date">날짜 및 시간</Label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild id="date" className="flex-1">
                      <Button
                        variant="outline"
                        data-empty={!game.start_date}
                        className="data-[empty=true]:text-muted-foreground"
                      >
                        <CalendarIcon />
                        {game.start_date ? (
                          game.start_date
                        ) : (
                          <span>날짜를 입력하세요.</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={DateTime.fromFormat(
                          game.start_date,
                          "yyyy-MM-dd",
                        ).toJSDate()}
                        onSelect={(date) => {
                          const formattedDate = date
                            ? DateTime.fromJSDate(date).toFormat("yyyy-MM-dd")
                            : "";
                          onChangeDate(formattedDate);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    id="start_time"
                    type="time"
                    className="flex-1 justify-center"
                    value={game.start_time}
                    onChange={onChange}
                  />
                </div>
                {fetcher.data &&
                "fieldErrors" in fetcher.data &&
                fetcher.data.fieldErrors?.start_date ? (
                  <FormErrors errors={fetcher.data.fieldErrors?.start_date} />
                ) : null}
                {fetcher.data &&
                "fieldErrors" in fetcher.data &&
                fetcher.data.fieldErrors?.start_time ? (
                  <FormErrors errors={fetcher.data.fieldErrors?.start_time} />
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="game_time">플레이 시간</Label>
                <div className="flex flex-wrap items-center gap-2">
                  {gameTimeEnum.enumValues.map((gameTime) => (
                    <Button
                      key={gameTime}
                      variant={
                        game.game_time === gameTime ? "default" : "outline"
                      }
                      onClick={() =>
                        setGame((prev) => ({ ...prev, game_time: gameTime }))
                      }
                      className="flex-1"
                    >
                      {gameTime}
                    </Button>
                  ))}
                </div>
                {fetcher.data &&
                "fieldErrors" in fetcher.data &&
                fetcher.data.fieldErrors?.game_time ? (
                  <FormErrors errors={fetcher.data.fieldErrors?.game_time} />
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="gym_id">장소</Label>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      className={cn(
                        "flex w-full justify-between",
                        game.gym_name ? "" : "text-muted-foreground",
                      )}
                      variant="outline"
                    >
                      <span>{game.gym_name || "체육관을 선택해주세요"}</span>
                      <SearchIcon />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>체육관 검색</DrawerTitle>
                      <DrawerDescription>
                        <Input
                          placeholder="체육관 이름으로 검색"
                          value={gymText}
                          onChange={onChangeGymText}
                          className="text-foreground"
                        />
                      </DrawerDescription>
                    </DrawerHeader>
                    <ScrollArea className="h-70 px-4">
                      <div className="flex flex-col gap-2">
                        {gyms.map(
                          ({ gym_id, name, full_address, city, district }) => (
                            <DrawerClose
                              key={`gym_${gym_id}`}
                              className="text-left"
                              onClick={() =>
                                onChangeGym(gym_id, name, city, district)
                              }
                            >
                              <p className="font-semibold">{name}</p>
                              <p className="text-muted-foreground text-sm">
                                {full_address}
                              </p>
                            </DrawerClose>
                          ),
                        )}
                      </div>
                    </ScrollArea>
                    <DrawerFooter></DrawerFooter>
                  </DrawerContent>
                </Drawer>
                {fetcher.data &&
                "fieldErrors" in fetcher.data &&
                fetcher.data.fieldErrors?.gym_id ? (
                  <FormErrors errors={fetcher.data.fieldErrors?.gym_id} />
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="game_type">경기 유형</Label>
                <div className="flex flex-wrap items-center gap-2">
                  {gameTypeEnum.enumValues.map((gameType) => (
                    <Button
                      key={gameType}
                      variant={
                        game.game_type === gameType ? "default" : "outline"
                      }
                      onClick={() =>
                        setGame((prev) => ({ ...prev, game_type: gameType }))
                      }
                      className="flex-1"
                    >
                      {gameType}
                    </Button>
                  ))}
                </div>
                {fetcher.data &&
                "fieldErrors" in fetcher.data &&
                fetcher.data.fieldErrors?.game_type ? (
                  <FormErrors errors={fetcher.data.fieldErrors?.game_type} />
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="fee">참가비</Label>
                <div className="relative flex-1">
                  <Input
                    type="number"
                    id="fee"
                    value={game.fee}
                    onChange={onChange}
                    className="text-right"
                  />
                  <span className="absolute top-1.5 right-2">원</span>
                </div>
                {fetcher.data &&
                "fieldErrors" in fetcher.data &&
                fetcher.data.fieldErrors?.fee ? (
                  <FormErrors errors={fetcher.data.fieldErrors?.fee} />
                ) : null}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8">
            <h1 className="text-xl font-bold">모집 인원</h1>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="game_gender_type">성별</Label>
                <div className="flex flex-wrap items-center gap-2">
                  {gameGenderTypeEnum.enumValues.map((genderType) => (
                    <Button
                      key={genderType}
                      variant={
                        game.game_gender_type === genderType
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        setGame((prev) => ({
                          ...prev,
                          game_gender_type: genderType,
                        }))
                      }
                      className="flex-1"
                    >
                      {genderType}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="position">모집 포지션</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant={game.guard ? "default" : "outline"}
                    onClick={() =>
                      setGame((prev) => ({
                        ...prev,
                        guard: !prev.guard,
                      }))
                    }
                    className="flex-1"
                  >
                    가드
                  </Button>
                  <Button
                    variant={game.forward ? "default" : "outline"}
                    onClick={() =>
                      setGame((prev) => ({
                        ...prev,
                        forward: !prev.forward,
                      }))
                    }
                    className="flex-1"
                  >
                    포워드
                  </Button>
                  <Button
                    variant={game.center ? "default" : "outline"}
                    onClick={() =>
                      setGame((prev) => ({
                        ...prev,
                        center: !prev.center,
                      }))
                    }
                    className="flex-1"
                  >
                    센터
                  </Button>
                </div>
                {fetcher.data &&
                "fieldErrors" in fetcher.data &&
                fetcher.data.fieldErrors?.guard ? (
                  <FormErrors errors={fetcher.data.fieldErrors?.guard} />
                ) : null}
                {fetcher.data &&
                "fieldErrors" in fetcher.data &&
                fetcher.data.fieldErrors?.forward ? (
                  <FormErrors errors={fetcher.data.fieldErrors?.forward} />
                ) : null}
                {fetcher.data &&
                "fieldErrors" in fetcher.data &&
                fetcher.data.fieldErrors?.center ? (
                  <FormErrors errors={fetcher.data.fieldErrors?.center} />
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="min_participants">인원</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      id="min_participants"
                      value={game.min_participants}
                      onChange={onChange}
                      className="text-right"
                    />
                    <span className="absolute top-1.5 right-2">명</span>
                  </div>
                  <span>~</span>
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      id="max_participants"
                      value={game.max_participants}
                      onChange={onChange}
                      className="text-right"
                    />
                    <span className="absolute top-1.5 right-2">명</span>
                  </div>
                </div>
                {fetcher.data &&
                "fieldErrors" in fetcher.data &&
                fetcher.data.fieldErrors?.min_participants ? (
                  <FormErrors
                    errors={fetcher.data.fieldErrors?.min_participants}
                  />
                ) : null}
                {fetcher.data &&
                "fieldErrors" in fetcher.data &&
                fetcher.data.fieldErrors?.max_participants ? (
                  <FormErrors
                    errors={fetcher.data.fieldErrors?.max_participants}
                  />
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">경기 소개</Label>
                <Textarea
                  id="description"
                  className="h-60 resize-none"
                  value={game.description}
                  onChange={onChange}
                  placeholder={`🚭 흡연은 건물 밖에서 해주세요

🎮 전광판 보유

🏥 다치지 않게 하드 플레이 삼가해주세요

등의 추가 설명을 작성해주세요.`}
                />
                {fetcher.data &&
                "fieldErrors" in fetcher.data &&
                fetcher.data.fieldErrors?.description ? (
                  <FormErrors errors={fetcher.data.fieldErrors?.description} />
                ) : null}
              </div>
            </div>
          </div>
        );
    }
  };
  return (
    <div className="mx-auto max-w-screen-lg space-y-16 p-4">
      {getPageNode()}
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          {page !== 0 && (
            <Button
              onClick={onClickPrev}
              className="flex-1"
              variant="secondary"
            >
              이전
            </Button>
          )}
          {page !== 1 && (
            <Button onClick={onClickNext} className="flex-1">
              다음
            </Button>
          )}
          {page === 1 && (
            <Button
              onClick={onClickRegister}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                "등록"
              )}
            </Button>
          )}
        </div>
        {fetcher.data &&
        "fieldErrors" in fetcher.data &&
        Object.values(fetcher.data.fieldErrors).flat().length > 0 ? (
          <FormErrors
            errors={Object.values(fetcher.data.fieldErrors).flat() as string[]}
          />
        ) : null}
        {fetcher.data && "error" in fetcher.data && fetcher.data.error ? (
          <FormErrors errors={[fetcher.data.error]} />
        ) : null}
      </div>
    </div>
  );
}
