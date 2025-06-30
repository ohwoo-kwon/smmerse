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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/core/components/ui/select";
import { sidoObject } from "~/core/lib/address";

export default function CreateGameLocationCard({
  gameInfo,
  onChange,
  onChangeLocation,
}: {
  gameInfo: BasketballGame;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChangeLocation: (id: "sido" | "city", value: string) => void;
}) {
  return (
    <React.Fragment>
      <CardHeader className="text-center">
        <CardTitle className="md:text-lg">장소 정보</CardTitle>
        <CardDescription className="md:text-base">
          체육관 위치를 입력해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between gap-1 md:gap-8">
          <div className="flex-1 space-y-1">
            <Label htmlFor="sido" className="md:text-base">
              시/도
            </Label>
            <Select
              value={gameInfo.sido}
              onValueChange={(sido) => {
                onChangeLocation("sido", sido);
                onChangeLocation(
                  "city",
                  sidoObject.find(({ name }) => name === sido)!.cities[0].name,
                );
              }}
            >
              <SelectTrigger id="sido" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sidoObject.map(({ name }) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="city" className="md:text-base">
              구/군
            </Label>
            <Select
              value={gameInfo.city}
              onValueChange={(city) => {
                onChangeLocation("city", city);
              }}
            >
              <SelectTrigger id="city" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sidoObject
                  .find(({ name }) => name === gameInfo.sido)!
                  .cities.map(({ name }) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="address" className="md:text-base">
            상세주소
          </Label>
          <Input
            id="address"
            placeholder="예) 서울 강남구 언주로 332"
            value={gameInfo.address}
            onChange={onChange}
            className="text-sm md:text-base"
          />
        </div>
      </CardContent>
    </React.Fragment>
  );
}
