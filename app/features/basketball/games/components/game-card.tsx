import type { basketballSkillLevelEnum, genderTypeEnum } from "../schema";

import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { DateTime } from "luxon";
import { Link } from "react-router";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import { Card, CardContent } from "~/core/components/ui/card";

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
}) {
  const formatedDate = DateTime.fromFormat(date, "yyyy-MM-dd").toFormat(
    "yy.MM.dd",
  );
  const formatedStartTime = DateTime.fromFormat(startTime, "hh:mm:ss").toFormat(
    "hh:mm",
  );
  const formatedEndTime = DateTime.fromFormat(endTime, "hh:mm:ss").toFormat(
    "hh:mm",
  );
  return (
    <Card className="p-0">
      <CardContent className="flex flex-col gap-3 p-3">
        <div className="flex items-center justify-between">
          <h2 className="overflow-auto text-sm font-bold break-words whitespace-normal md:text-lg">
            {title}
          </h2>
          <div className="flex gap-1">
            {skillLevel && (
              <Badge variant="secondary">
                {basketballSkillLevelMap[skillLevel]}
              </Badge>
            )}
            <Badge variant="secondary">{genderTypeMap[genderType]}</Badge>
          </div>
        </div>
        <div className="text-muted-foreground flex flex-col flex-wrap gap-1 text-xs md:text-sm">
          <div className="flex items-center gap-1">
            <CalendarIcon className="text-primary" size={14} />
            {formatedDate} {formatedStartTime}~{formatedEndTime}
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
        <div className="flex items-center justify-between">
          <div className="text-primary text-sm font-bold md:text-lg">
            {fee.toLocaleString()}원
          </div>
          <div className="space-x-1">
            {link && (
              <Button asChild size="sm" variant="link">
                <Link to={link} target="_blank">
                  이동
                </Link>
              </Button>
            )}
            <Button asChild size="sm">
              <Link to={`/basketball/games/${basketballGameId}`}>
                참가 신청
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
