import type { basketballSkillLevelEnum, genderTypeEnum } from "../schema";
import type { BasketballGame } from "../types";
import type { Route } from "./+types/create-game";

import { DateTime } from "luxon";
import { type ChangeEvent, useEffect, useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import { z } from "zod";

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
const DEFAULT_GAME_INFO: BasketballGame = {
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
};

export default function CreateGame() {
  const [gameInfo, setGameInfo] = useState<BasketballGame>(DEFAULT_GAME_INFO);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<Partial<BasketballGame>>({});

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

  const validatePage = (page: number): boolean => {
    switch (page) {
      case 1:
        if (!gameInfo.title.trim()) {
          setError((prev) => ({ ...prev, title: "경기 제목을 입력해주세요." }));
        } else {
          setError((prev) => ({ ...prev, title: "" }));
        }
        return !!gameInfo.title.trim();
      case 2:
        if (!gameInfo.date) {
          setError((prev) => ({ ...prev, date: "경기 날짜를 선택해주세요." }));
        } else {
          setError((prev) => ({ ...prev, date: "" }));
        }
        if (!gameInfo.startTime) {
          setError((prev) => ({
            ...prev,
            startTime: "시작 시간을 선택해주세요.",
          }));
        } else {
          setError((prev) => ({ ...prev, startTime: "" }));
        }
        if (!gameInfo.endTime) {
          setError((prev) => ({
            ...prev,
            endTime: "종료 시간을 선택해주세요.",
          }));
        } else {
          setError((prev) => ({ ...prev, endTime: "" }));
        }
        return !!gameInfo.date && !!gameInfo.startTime && !!gameInfo.endTime;
      case 3:
        if (!gameInfo.sido) {
          setError((prev) => ({ ...prev, sido: "시/도를 선택해주세요." }));
        } else {
          setError((prev) => ({ ...prev, sido: "" }));
        }
        if (!gameInfo.city) {
          setError((prev) => ({
            ...prev,
            city: "구/군을 선택해주세요.",
          }));
        } else {
          setError((prev) => ({ ...prev, city: "" }));
        }
        if (!gameInfo.address) {
          setError((prev) => ({
            ...prev,
            address: "상세주소를 입력해주세요.",
          }));
        } else {
          setError((prev) => ({ ...prev, address: "" }));
        }
        return !!gameInfo.sido && !!gameInfo.city && !!gameInfo.address;
      case 4:
        if (!gameInfo.fee || gameInfo.fee < 0) {
          setError((prev) => ({ ...prev, fee: 1 }));
        } else {
          setError((prev) => ({ ...prev, fee: undefined }));
        }
        return gameInfo.fee >= 0;
      default:
        return true;
    }
  };

  const handlePage = (type: "next" | "prev") => {
    if (type === "next") {
      const isValid = validatePage(currentPage);
      if (!isValid) return;

      if (currentPage < PAGE_SIZE) {
        setCurrentPage((prev) => Math.min(prev + 1, PAGE_SIZE));
      } else {
        createGame();
      }
    } else {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  };

  const createGame = async () => {
    fetcher.submit(gameInfo, {
      method: "post",
      action: "/api/basketball/games",
    });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <CreateGameInfoCard
            gameInfo={gameInfo}
            error={error}
            onChange={onChange}
          />
        );
      case 2:
        return (
          <CreateGameDateCard
            gameInfo={gameInfo}
            error={error}
            onChange={onChange}
            onChangeDate={onChangeDate}
          />
        );
      case 3:
        return (
          <CreateGameLocationCard
            gameInfo={gameInfo}
            error={error}
            onChange={onChange}
            onChangeLocation={onChangeLocation}
          />
        );
      case 4:
        return (
          <CreateGameFeeCard
            gameInfo={gameInfo}
            error={error}
            onChange={onChange}
            onChangeSkillLevel={onChangeSkillLevel}
            onChangeGenderType={onChangeGenderType}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (fetcher.data?.success) navigate("/basketball/games");
  }, [fetcher.data]);

  return (
    <div className="space-y-8 p-4">
      <CreatePagination pageSize={PAGE_SIZE} currentPage={currentPage} />
      <Card className="mx-auto max-w-xl">
        {renderCurrentPage()}
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
