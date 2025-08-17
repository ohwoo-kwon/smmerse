import type { basketballSkillLevelEnum, genderTypeEnum } from "../schema";
import type { BasketballGame } from "../types";
import type { Route } from "./+types/edit-game";

import { Trash2Icon } from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";
import { Link, redirect, useFetcher, useNavigate } from "react-router";

import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Label } from "~/core/components/ui/label";
import makeServerClient from "~/core/lib/supa-client.server";

import CreateGameDateCard from "../components/create-game-date-card";
import CreateGameFeeCard from "../components/create-game-fee-card";
import CreateGameInfoCard from "../components/create-game-info-card";
import CreateGameLocationCard from "../components/create-game-location-card";
import CreatePagination from "../components/create-pagination";
import { getBasketballGameById } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `농구 경기 수정 | ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      name: "description",
      content: `농구 경기 정보를 수정합니다.`,
    },
  ];
};

export async function loader({ request, params }: Route.LoaderArgs) {
  if (!params.id) {
    throw new Response("Not Found", { status: 404 });
  }
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  const game = await getBasketballGameById(client, Number(params.id));

  if (user!.id !== game.profile_id)
    return redirect(`/basketball/games/${game.basketball_game_id}`);
  return { game };
}

const PAGE_SIZE = 4;

export default function EditGame({ loaderData }: Route.ComponentProps) {
  const { game } = loaderData;
  const [gameInfo, setGameInfo] = useState(game);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<Partial<BasketballGame>>({});

  const fetcher = useFetcher();
  const navigate = useNavigate();

  const isLoading =
    fetcher.state === "submitting" || fetcher.state === "loading";

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
  ) => setGameInfo((prev) => ({ ...prev, skill_level: value }));

  const onChangeGenderType = (
    value: (typeof genderTypeEnum.enumValues)[number],
  ) => setGameInfo((prev) => ({ ...prev, gender_type: value }));

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
        if (!gameInfo.start_time) {
          setError((prev) => ({
            ...prev,
            startTime: "시작 시간을 선택해주세요.",
          }));
        } else {
          setError((prev) => ({ ...prev, startTime: "" }));
        }
        if (!gameInfo.end_time) {
          setError((prev) => ({
            ...prev,
            endTime: "종료 시간을 선택해주세요.",
          }));
        } else {
          setError((prev) => ({ ...prev, endTime: "" }));
        }
        return !!gameInfo.date && !!gameInfo.start_time && !!gameInfo.end_time;
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
        editGame();
      }
    } else {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  };

  const editGame = async () => {
    const { ...rest } = gameInfo;
    fetcher.submit(rest, {
      method: "put",
      action: `/api/basketball/games/${game.basketball_game_id}`,
    });
  };

  const deleteGame = async () => {
    const isOk = confirm("정말로 경기를 삭제하시겠습니까?");
    if (!isOk) return;
    fetcher.submit(null, {
      method: "delete",
      action: `/api/basketball/games/${game.basketball_game_id}`,
    });
  };

  const onClickUpdate = () => {
    if (!validatePage(1)) {
      setCurrentPage(1);
      return;
    }
    if (!validatePage(2)) {
      setCurrentPage(2);
      return;
    }
    if (!validatePage(3)) {
      setCurrentPage(3);
      return;
    }
    if (!validatePage(4)) {
      setCurrentPage(4);
      return;
    }
    editGame();
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
      <Card className="relative mx-auto max-w-xl">
        <Button
          size="icon"
          className="text-destructive absolute top-1 right-1"
          variant="link"
          onClick={deleteGame}
          disabled={isLoading}
        >
          <Trash2Icon />
        </Button>
        {isLoading ? (
          <>
            <CardHeader>
              <CardTitle className="mx-auto h-8 w-40 animate-pulse rounded bg-neutral-200"></CardTitle>
              <CardDescription className="mx-auto h-4 w-80 animate-pulse rounded bg-neutral-200"></CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <Label className="h-8 w-40 animate-pulse rounded bg-neutral-200"></Label>
                <div className="h-16 w-40 w-full animate-pulse rounded bg-neutral-200" />
              </div>
              <div className="space-y-1">
                <Label className="h-8 w-40 animate-pulse rounded bg-neutral-200"></Label>
                <div className="h-16 w-40 w-full animate-pulse rounded bg-neutral-200" />
              </div>
              <div className="space-y-1">
                <Label className="h-8 w-40 animate-pulse rounded bg-neutral-200"></Label>
                <div className="h-16 w-40 w-full animate-pulse rounded bg-neutral-200" />
              </div>
            </CardContent>
          </>
        ) : (
          renderCurrentPage()
        )}
        <CardFooter className="flex flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            {currentPage !== 1 ? (
              <Button variant="secondary" onClick={() => handlePage("prev")}>
                이전
              </Button>
            ) : (
              <span></span>
            )}
            {currentPage !== PAGE_SIZE && (
              <Button onClick={() => handlePage("next")}>다음</Button>
            )}
          </div>
          <Button
            className="w-full"
            onClick={onClickUpdate}
            disabled={isLoading}
          >
            수정
          </Button>
          <Button variant="secondary" className="w-full" asChild>
            <Link to={`/basketball/games/${game.basketball_game_id}`}>
              취소
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
