import { MessageSquareMoreIcon } from "lucide-react";
import { DateTime } from "luxon";
import { useState } from "react";
import { useNavigate } from "react-router";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/core/components/ui/avatar";
import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/core/components/ui/select";
import { browserClient } from "~/core/db/client.broswer";
import { calculateAge } from "~/core/lib/utils";
import { insertNotification } from "~/features/notifications/mutations";
import { getOrCreateChatRoom } from "~/features/users/mutations";

import { participantStatusEnum } from "../schema";

export default function ParticipantCard({
  participant_id,
  profile_id,
  owner_id,
  game_id,
  avatar_url,
  position,
  name,
  sex,
  birth,
  height,
  initStatus,
  createdAt,
}: {
  participant_id: number;
  profile_id: string;
  owner_id: string;
  game_id: number;
  avatar_url: string;
  position: string[];
  name: string;
  sex: string;
  birth: string;
  height: number;
  initStatus: (typeof participantStatusEnum.enumValues)[number];
  createdAt: string;
}) {
  const navigate = useNavigate();

  const [status, setStatus] = useState(initStatus);

  const onSelectValueChange = async (
    v: (typeof participantStatusEnum.enumValues)[number],
  ) => {
    let confirmMsg = "";

    switch (v) {
      case "대기":
        confirmMsg = `${name}님을 대기 상태로 변경하시겠어요?`;
        break;
      case "입금 요청":
        confirmMsg = `${name}님에게 입금을 요청하시겠어요?`;
        break;
      case "입금 완료":
        confirmMsg = `${name}님이 입금을 완료하셨나요?`;
        break;
      case "참가 확정":
        confirmMsg = `${name}님을 참가 확정 지으시겠어요?`;
        break;
    }
    const isOk = confirm(confirmMsg);

    if (!isOk) return;

    await browserClient
      .from("game_participants")
      .update({
        status: v,
      })
      .eq("participant_id", participant_id);

    await insertNotification(browserClient, {
      recipientProfileId: profile_id,
      senderProfileId: owner_id,
      type: "PARTICIPATION_STATUS",
      gameId: game_id,
      participationId: participant_id,
    });

    setStatus(v);
  };

  const onClickMessage = async () => {
    const chatRoomId = await getOrCreateChatRoom(browserClient, {
      fromUserId: profile_id,
      toUserId: owner_id,
    });

    navigate(`/chats/${chatRoomId}`);
  };

  return (
    <div
      key={`participant_${participant_id}`}
      className="flex items-center justify-between gap-2 border-b py-4 last:border-0"
    >
      <Avatar className="size-12">
        <AvatarImage src={avatar_url || ""} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{name}</span>
          <span className="text-primary text-sm">{position.join("/")}</span>
          <Button
            size="icon"
            className="size-6 rounded-sm"
            variant="outline"
            onClick={onClickMessage}
          >
            <MessageSquareMoreIcon />
          </Button>
        </div>
        <div className="flex gap-1">
          <Badge variant="secondary">
            {sex === "male" ? "남성" : sex === "female" ? "여성" : "알수없음"}
          </Badge>
          <Badge variant="secondary">{calculateAge(birth)}세</Badge>
          <Badge variant="secondary">{height}cm</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-right text-xs">
          {DateTime.fromISO(createdAt.replace(" ", "T"), { zone: "utc" })
            .toLocal()
            .toFormat("MM.dd HH:mm")}
        </span>
        <Select value={status} onValueChange={onSelectValueChange}>
          <SelectTrigger size="sm" className="w-26">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {participantStatusEnum.enumValues.map((v) => (
              <SelectItem key={`${participant_id}_${v}`} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
