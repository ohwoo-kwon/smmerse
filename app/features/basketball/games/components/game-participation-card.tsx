import type { basketballSkillLevelEnum, genderTypeEnum } from "../schema";

import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  InfoIcon,
  MapPinIcon,
  MessageSquareIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import { Link, useFetcher } from "react-router";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import { Card, CardContent, CardFooter } from "~/core/components/ui/card";

import { basketballSkillLevelMap, genderTypeMap } from "../constants";

export default function GameParticipationCard({
  participant_id,
  basketball_game_id,
  status,
  title,
  skill_level,
  gender_type,
  date,
  start_time,
  end_time,
  sido,
  city,
  max_participants,
  fee,
  fromUserId,
  toUserId,
}: {
  participant_id: number;
  basketball_game_id: number;
  status: string;
  title: string;
  skill_level: (typeof basketballSkillLevelEnum.enumValues)[number];
  gender_type: (typeof genderTypeEnum.enumValues)[number];
  date: string;
  start_time: string;
  end_time: string;
  sido: string;
  city: string;
  max_participants: number;
  fee: number;
  fromUserId: string;
  toUserId: string;
}) {
  const fetcher = useFetcher();
  const handleClickChat = (fromUserId: string, toUserId: string) => {
    fetcher.submit(
      { fromUserId, toUserId },
      { method: "POST", action: "/api/users/chat-room" },
    );
  };

  const handleClickCancel = () => {
    const isOk = confirm("참가를 취소하시겠습니까?");
    if (!isOk) return;
    fetcher.submit({ participant_id }, { method: "POST" });
  };

  return (
    <Link
      to={`/basketball/games/${basketball_game_id}`}
      className="cursor-pointer"
    >
      <Card className="gap-0 p-0">
        <CardContent className="mb-2 flex flex-col gap-2 p-0">
          <div className="flex items-start justify-between gap-2 px-6 pt-3">
            <div className="flex flex-col overflow-auto break-words whitespace-normal">
              <p>
                {status === "pending" ? (
                  <Badge className="bg-yellow-100 text-base text-yellow-600">
                    <InfoIcon size={24} />
                    대기
                  </Badge>
                ) : status === "approved" ? (
                  <Badge className="bg-green-100 text-base text-green-600">
                    <CheckCircleIcon />
                    승인
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-base text-red-600">
                    <XCircleIcon />
                    거절
                  </Badge>
                )}
              </p>
              <h2 className="text-sm font-bold md:text-lg">{title}</h2>
            </div>
            <div className="flex gap-1">
              {skill_level && (
                <Badge variant="secondary">
                  {basketballSkillLevelMap[skill_level]}
                </Badge>
              )}
              <Badge variant="secondary">{genderTypeMap[gender_type]}</Badge>
            </div>
          </div>
          <div className="text-muted-foreground flex flex-wrap gap-4 px-6 text-xs md:text-sm">
            <div className="flex items-center gap-1">
              <CalendarIcon className="text-primary" size={14} />
              {DateTime.fromFormat(date, "yyyy-MM-dd").toFormat("yy.MM.dd")}
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="text-primary" size={14} />
              {DateTime.fromFormat(start_time, "HH:mm:ss").toFormat(
                "HH:mm",
              )} - {DateTime.fromFormat(end_time, "HH:mm:ss").toFormat("HH:mm")}
            </div>
            <div className="flex items-center gap-1">
              <MapPinIcon className="text-primary" size={14} />
              {sido} {city}
            </div>
            <div className="flex items-center gap-1">
              <UsersIcon className="text-primary" size={14} />
              {max_participants} 명
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-accent flex items-center justify-between px-6 py-2">
          <div className="text-primary text-sm font-bold md:text-lg">
            {fee.toLocaleString()}원
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleClickChat(fromUserId, toUserId);
              }}
            >
              <MessageSquareIcon />
            </Button>
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                handleClickCancel();
              }}
            >
              참가 취소
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
