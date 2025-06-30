import type { BasketballGame } from "../types";

import React, { type ChangeEvent } from "react";

import { DatePicker } from "~/core/components/date-picker";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Input } from "~/core/components/ui/input";
import { Label } from "~/core/components/ui/label";

export default function CreateGameDateCard({
  gameInfo,
  onChange,
  onChangeDate,
}: {
  gameInfo: BasketballGame;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChangeDate: (date: string) => void;
}) {
  return (
    <React.Fragment>
      <CardHeader className="text-center">
        <CardTitle className="md:text-lg">일정 정보</CardTitle>
        <CardDescription className="md:text-base">
          경기 날짜와 시간을 설정해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="date" className="md:text-base">
            경기 날짜
          </Label>
          <DatePicker date={gameInfo.date} setDate={onChangeDate} />
        </div>
        <div className="flex justify-between gap-1 md:gap-8">
          <div className="flex-1 space-y-1">
            <Label htmlFor="startTime" className="md:text-base">
              시작 시간
            </Label>
            <Input
              id="startTime"
              type="time"
              value={gameInfo.startTime}
              onChange={onChange}
              className="text-sm md:text-base"
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="endTime" className="md:text-base">
              종료 시간
            </Label>
            <Input
              id="endTime"
              type="time"
              value={gameInfo.endTime}
              onChange={onChange}
              className="text-sm md:text-base"
            />
          </div>
        </div>
      </CardContent>
    </React.Fragment>
  );
}
