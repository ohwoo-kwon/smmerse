import type { basketballSkillLevelEnum, genderTypeEnum } from "../schema";
import type { BasketballGame } from "../types";
import type { Route } from "./+types/create-game";

import { DateTime } from "luxon";
import { type ChangeEvent, useEffect, useState } from "react";
import { redirect, useFetcher, useNavigate } from "react-router";

import { Button } from "~/core/components/ui/button";
import { Card, CardFooter } from "~/core/components/ui/card";

import CreateGameDateCard from "../components/create-game-date-card";
import CreateGameFeeCard from "../components/create-game-fee-card";
import CreateGameInfoCard from "../components/create-game-info-card";
import CreateGameLocationCard from "../components/create-game-location-card";
import CreatePagination from "../components/create-pagination";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `농구 경기 생성 | ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      name: "description",
      content: `농구 게스트를 모집할 수 있는 농구 경기 생성`,
    },
  ];
};

const PAGE_SIZE = 4;

export default function CreateGame() {
  const [gameInfo, setGameInfo] = useState<BasketballGame>({
    title: "",
    description: "",
    date: DateTime.now().toFormat("yyyy-MM-dd"),
    startTime: "18:00",
    endTime: "21:00",
    skillLevel: "level_0",
    minParticipants: 0,
    maxParticipants: 18,
    currentParticipants: 0,
    fee: 5000,
    sido: "서울",
    city: "강남구",
    address: "",
    genderType: "male",
    link: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const fetcher = useFetcher();

  const navigate = useNavigate();

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { id, value },
    } = e;
    setGameInfo((prev) => ({ ...prev, [id]: value }));
  };

  const onChangeDate = (date: string) =>
    setGameInfo((prev) => ({ ...prev, date }));

  const onChangeLocation = (id: "sido" | "city", value: string) =>
    setGameInfo((prev) => ({ ...prev, [id]: value }));

  const onChangeSkillLevel = (
    value: (typeof basketballSkillLevelEnum.enumValues)[number],
  ) => setGameInfo((prev) => ({ ...prev, skillLevel: value }));

  const onChangeGenderType = (
    value: (typeof genderTypeEnum.enumValues)[number],
  ) => setGameInfo((prev) => ({ ...prev, genderType: value }));

  const handlePage = (type: "next" | "prev") => {
    if (type === "next") {
      currentPage < PAGE_SIZE
        ? setCurrentPage((prev) =>
            prev + 1 < PAGE_SIZE ? prev + 1 : PAGE_SIZE,
          )
        : createGame();
    } else if (type === "prev")
      setCurrentPage((prev) => (prev - 1 > 0 ? prev - 1 : 1));
  };

  const createGame = async () => {
    fetcher.submit(gameInfo, {
      method: "post",
      action: "/api/basketball/games",
    });
  };

  useEffect(() => {
    if (fetcher.data?.success) navigate("/basketball/games");
  }, [fetcher.data]);

  return (
    <div className="space-y-8 p-4">
      <CreatePagination pageSize={PAGE_SIZE} currentPage={currentPage} />
      <Card className="mx-auto max-w-xl">
        {currentPage === 1 ? (
          <CreateGameInfoCard gameInfo={gameInfo} onChange={onChange} />
        ) : currentPage === 2 ? (
          <CreateGameDateCard
            gameInfo={gameInfo}
            onChange={onChange}
            onChangeDate={onChangeDate}
          />
        ) : currentPage === 3 ? (
          <CreateGameLocationCard
            gameInfo={gameInfo}
            onChange={onChange}
            onChangeLocation={onChangeLocation}
          />
        ) : (
          <CreateGameFeeCard
            gameInfo={gameInfo}
            onChange={onChange}
            onChangeSkillLevel={onChangeSkillLevel}
            onChangeGenderType={onChangeGenderType}
          />
        )}
        <CardFooter className="flex items-center justify-between">
          {currentPage !== 1 ? (
            <Button variant="secondary" onClick={() => handlePage("prev")}>
              이전
            </Button>
          ) : (
            <span></span>
          )}
          <Button onClick={() => handlePage("next")}>
            {currentPage !== PAGE_SIZE ? "다음" : "완료"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
