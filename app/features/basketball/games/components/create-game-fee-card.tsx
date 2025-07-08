import type { BasketballGame } from "../types";

import React, { type ChangeEvent } from "react";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Input } from "~/core/components/ui/input";
import { Label } from "~/core/components/ui/label";
import { cn } from "~/core/lib/utils";

import {
  basketballSkillLevelDescMap,
  basketballSkillLevelMap,
  genderTypeMap,
} from "../constants";
import { basketballSkillLevelEnum, genderTypeEnum } from "../schema";

export default function CreateGameFeeCard({
  gameInfo,
  onChange,
  onChangeSkillLevel,
  onChangeGenderType,
}: {
  gameInfo: BasketballGame;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChangeSkillLevel: (
    value: (typeof basketballSkillLevelEnum.enumValues)[number],
  ) => void;
  onChangeGenderType: (
    value: (typeof genderTypeEnum.enumValues)[number],
  ) => void;
}) {
  return (
    <React.Fragment>
      <CardHeader className="text-center">
        <CardTitle className="md:text-lg">경기 정보</CardTitle>
        <CardDescription className="md:text-base">
          경기 정보 및 참가비를 입력해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <Label className="md:text-base">실력</Label>
          <div className="space-y-1">
            {basketballSkillLevelEnum.enumValues.map((skillLevel) => (
              <div
                key={skillLevel}
                className={cn(
                  "rounded border px-4 py-2",
                  skillLevel === gameInfo.skillLevel
                    ? "border-primary bg-primary/10"
                    : "'",
                )}
                onClick={() => onChangeSkillLevel(skillLevel)}
              >
                <p className="font-semibold">
                  {basketballSkillLevelMap[skillLevel]}
                </p>
                <p className="text-muted-foreground text-xs md:text-sm">
                  {basketballSkillLevelDescMap[skillLevel]}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <Label className="md:text-base">성별</Label>
          <div className="flex justify-between gap-1">
            {genderTypeEnum.enumValues.map((gender) => (
              <div
                key={gender}
                className={cn(
                  "w-full rounded border py-2 text-center",
                  gender === gameInfo.genderType
                    ? "border-primary bg-primary/10"
                    : "'",
                )}
                onClick={() => onChangeGenderType(gender)}
              >
                {genderTypeMap[gender]}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="fee" className="md:text-base">
            참가비
          </Label>
          <Input
            id="fee"
            type="number"
            min={0}
            placeholder="예) 서울 강남구 언주로 332"
            value={gameInfo.fee}
            onChange={onChange}
            className="text-sm md:text-base"
          />
        </div>
        <div className="flex justify-between gap-1 md:gap-8">
          <div className="space-y-1">
            <Label htmlFor="minParticipants" className="md:text-base">
              최소 인원
            </Label>
            <Input
              id="minParticipants"
              type="number"
              min={0}
              placeholder="예) 서울 강남구 언주로 332"
              value={gameInfo.minParticipants}
              onChange={onChange}
              className="text-sm md:text-base"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="maxParticipants" className="md:text-base">
              최대 인원
            </Label>
            <Input
              id="maxParticipants"
              type="number"
              min={0}
              placeholder="예) 서울 강남구 언주로 332"
              value={gameInfo.maxParticipants}
              onChange={onChange}
              className="text-sm md:text-base"
            />
          </div>
        </div>
      </CardContent>
    </React.Fragment>
  );
}
