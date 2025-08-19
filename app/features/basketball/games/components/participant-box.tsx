import {
  CalendarIcon,
  Loader2Icon,
  MessageSquareIcon,
  RulerIcon,
  VenusAndMarsIcon,
} from "lucide-react";
import { useFetcher } from "react-router";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/core/components/ui/avatar";
import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import { calculateAge } from "~/core/lib/utils";

export default function ParticipantBox({
  status,
  avatar_url,
  name,
  profile_id,
  userId,
  position,
  participant_id,
  birth,
  height,
  sex,
}: {
  status: string;
  avatar_url: string;
  name: string;
  profile_id: string;
  userId: string;
  position: string[];
  participant_id: number;
  birth: string;
  height: number;
  sex: string;
}) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const handleClick = (
    participantId: number,
    profileId: string,
    status: "pending" | "approved" | "rejected",
  ) => {
    fetcher.submit({ participantId, profileId, status }, { method: "POST" });
  };

  const handleClickChat = (fromUserId: string, toUserId: string) => {
    fetcher.submit(
      { fromUserId, toUserId },
      { method: "POST", action: "/api/users/chat-room" },
    );
  };

  return (
    <div className="space-y-4 rounded-lg border p-4 text-sm shadow md:text-base">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-8 cursor-pointer">
            <AvatarImage src={avatar_url} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{name}</span>
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            className="cursor-pointer"
            onClick={() => handleClickChat(userId, profile_id)}
          >
            <MessageSquareIcon />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          {position.map((p) => (
            <Badge key={`${p}_${participant_id}`} variant="outline">
              {p}
            </Badge>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <CalendarIcon size={16} className="text-muted-foreground" />
            <span>{birth ? calculateAge(birth) : null} 세</span>
          </div>
          <div className="flex items-center gap-1">
            <RulerIcon size={16} className="text-muted-foreground" />
            <span>{height} cm</span>
          </div>
          <div className="flex items-center gap-1">
            <VenusAndMarsIcon size={16} className="text-muted-foreground" />
            <span>{sex === "female" ? "여성" : "남성"}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        {status !== "rejected" && (
          <Button
            className="flex-1 cursor-pointer bg-red-500 hover:bg-red-600"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleClick(participant_id, profile_id, "rejected")}
          >
            {isSubmitting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              "거절"
            )}
          </Button>
        )}
        {status !== "pending" && (
          <Button
            className="flex-1 cursor-pointer"
            size="sm"
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => handleClick(participant_id, profile_id, "pending")}
          >
            {isSubmitting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              "대기"
            )}
          </Button>
        )}
        {status !== "approved" && (
          <Button
            className="flex-1 cursor-pointer bg-green-500 hover:bg-green-600"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleClick(participant_id, profile_id, "approved")}
          >
            {isSubmitting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              "승인"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
