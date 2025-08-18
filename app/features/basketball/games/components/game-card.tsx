import type { basketballSkillLevelEnum, genderTypeEnum } from "../schema";

import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { DateTime } from "luxon";
import { Link, useNavigate } from "react-router";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import { Card, CardContent, CardFooter } from "~/core/components/ui/card";

import { basketballSkillLevelMap, genderTypeMap } from "../constants";

export default function BasketballGameCard({
  basketballGameId,
  title,
  genderType,
  date,
  startTime,
  endTime,
  sido,
  city,
  address,
  skillLevel,
  maxParticipants,
  fee,
  link,
  isOwner = false,
}: {
  basketballGameId: number;
  title: string;
  genderType: (typeof genderTypeEnum.enumValues)[number];
  date: string;
  startTime: string;
  endTime: string;
  sido: string;
  city: string;
  address: string;
  skillLevel: (typeof basketballSkillLevelEnum.enumValues)[number] | null;
  maxParticipants: number;
  fee: number;
  link: string | null;
  isOwner?: boolean;
}) {
  const navigate = useNavigate();
  const formatedDate = DateTime.fromFormat(date, "yyyy-MM-dd").toFormat(
    "yy.MM.dd",
  );
  const formatedStartTime = DateTime.fromFormat(startTime, "HH:mm:ss").toFormat(
    "HH:mm",
  );
  const formatedEndTime = DateTime.fromFormat(endTime, "HH:mm:ss").toFormat(
    "HH:mm",
  );
  return (
    <Link
      to={`/basketball/games/${basketballGameId}`}
      className="cursor-pointer"
    >
      <Card className="gap-0 p-0">
        <CardContent className="mb-2 flex flex-col gap-2 p-0">
          <div className="flex items-start justify-between gap-2 px-6 pt-3">
            <div className="flex flex-col overflow-auto break-words whitespace-normal">
              <span className="text-primary text-xs font-semibold md:text-sm">
                {formatedStartTime} - {formatedEndTime}
              </span>
              <h2 className="text-sm font-bold md:text-lg">{title}</h2>
            </div>
            <div className="flex gap-1">
              {skillLevel && (
                <Badge variant="secondary">
                  {basketballSkillLevelMap[skillLevel]}
                </Badge>
              )}
              <Badge variant="secondary">{genderTypeMap[genderType]}</Badge>
            </div>
          </div>
          <div className="text-muted-foreground flex flex-wrap gap-4 px-6 text-xs md:text-sm">
            <div className="flex items-center gap-1">
              <CalendarIcon className="text-primary" size={14} />
              {formatedDate}
            </div>
            <div className="flex items-center gap-1">
              <MapPinIcon className="text-primary" size={14} />
              {sido} {city}
            </div>
            <div className="flex items-center gap-1">
              <UsersIcon className="text-primary" size={14} />
              {maxParticipants} 명
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-accent flex items-center justify-between px-6 py-2">
          <div className="text-primary text-sm font-bold md:text-lg">
            {fee.toLocaleString()}원
          </div>
          <div className="space-x-1">
            {isOwner && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(
                    `/basketball/games/${basketballGameId}/participants`,
                  );
                }}
              >
                참가자 관리
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
