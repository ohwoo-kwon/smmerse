import type { BasketballGame } from "../types";

import React, { type ChangeEvent } from "react";

import FormErrors from "~/core/components/form-errors";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Input } from "~/core/components/ui/input";
import { Label } from "~/core/components/ui/label";
import { Textarea } from "~/core/components/ui/textarea";

export default function CreateGameInfoCard({
  gameInfo,
  error,
  onChange,
}: {
  gameInfo: BasketballGame;
  error: Partial<BasketballGame>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <React.Fragment>
      <CardHeader className="text-center">
        <CardTitle className="md:text-lg">기본 정보</CardTitle>
        <CardDescription className="md:text-base">
          경기의 기본 정보를 입력해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="title" className="md:text-base">
            경기 제목
          </Label>
          <Input
            id="title"
            value={gameInfo.title}
            onChange={onChange}
            placeholder="예) 강남 XX 체육관 게스트/픽업게임 모집"
            className="text-sm md:text-base"
          />
          {error.title && <FormErrors errors={[error.title]} />}
        </div>
        <div className="space-y-1">
          <Label htmlFor="description" className="md:text-base">
            경기 설명
          </Label>
          <Textarea
            id="description"
            value={gameInfo.description || ""}
            onChange={onChange}
            placeholder={`예) 주차는 체육관 옆 공터에 해주세요.

정수기는 있지만 개인 컵은 가져오셔야 합니다.

흡연은 체육관 밖에서 가능합니다.`}
            className="min-h-60 resize-none text-sm md:text-base"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="link" className="md:text-base">
            링크
          </Label>
          <Input
            id="link"
            value={gameInfo.link || ""}
            onChange={onChange}
            placeholder="링크가 있다면 등록해주세요."
            className="text-sm md:text-base"
          />
        </div>
      </CardContent>
    </React.Fragment>
  );
}
