import type { Route } from "./+types/chats";

import { OctagonXIcon } from "lucide-react";
import { DateTime } from "luxon";
import { Link } from "react-router";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/core/components/ui/avatar";
import makeServerClient from "~/core/lib/supa-client.server";

import { getChats } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `채팅 내역 | ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      name: "description",
      content: `${import.meta.env.VITE_APP_NAME}의 사용자의 채팅 내역을 확인할 수 있는 페이지입니다.`,
    },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return;

  const chatRooms = await getChats(client, user.id);

  return { chatRooms };
};

export default function Chats({ loaderData }: Route.ComponentProps) {
  return (
    <div className="mx-auto max-w-screen-lg space-y-4 p-4">
      <h1 className="text-3xl font-bold">채팅방</h1>

      <div>
        {loaderData!.chatRooms.length > 0 ? (
          loaderData?.chatRooms.map(
            ({
              avatar_url,
              name,
              chat_room_id,
              last_message,
              last_message_time,
              last_sender_name,
            }) => (
              <Link
                key={chat_room_id}
                to={`/chats/${chat_room_id}`}
                className="flex justify-between gap-2 border-b py-4 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={avatar_url || ""} />
                    <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{name}</p>
                    <p className="text-muted-foreground w-[calc(100vw-128px)] overflow-hidden text-xs text-ellipsis whitespace-nowrap">
                      {last_sender_name}:{last_message}
                    </p>
                  </div>
                </div>
                <span className="text-muted-foreground items w-12 text-right text-xs">
                  {DateTime.fromISO(last_message_time!).toFormat("MM-dd")}
                </span>
              </Link>
            ),
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <OctagonXIcon
              size={80}
              strokeWidth={1}
              className="text-muted-foreground"
            />
            <p className="text-lg font-semibold">
              게스트를 참가하거나 게스트 모집을 통해 다른 플레이어와 소통을
              시작해보세요
            </p>
            {/* <Button>체육관 등록 요청</Button> */}
          </div>
        )}
      </div>
    </div>
  );
}
