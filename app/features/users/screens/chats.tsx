import type { Route } from "./+types/chats";

import { DateTime } from "luxon";
import { Link } from "react-router";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/core/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import makeServerClient from "~/core/lib/supa-client.server";

import { getChatRooms } from "../queries";

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

  const chatRooms = await getChatRooms(client, user.id);

  return { chatRooms };
};

export default function Chats({ loaderData }: Route.ComponentProps) {
  return (
    <Card className="mx-4 min-h-[calc(100vh-96px)]">
      <CardHeader>
        <CardTitle>채팅 내역</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {loaderData?.chatRooms.map((chatRoom) => (
          <Link
            key={chatRoom.chat_room_id}
            to={`/chats/${chatRoom.chat_room_id}`}
          >
            <div className="flex cursor-pointer items-center gap-4 rounded-lg border p-2 hover:bg-gray-100">
              <Avatar>
                <AvatarImage
                  src={chatRoom.chat_room_members[0].profile.avatar_url || ""}
                />
                <AvatarFallback>
                  {chatRoom.chat_room_members[0].profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    {chatRoom.chat_room_members[0].profile.name}
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    {DateTime.fromISO(
                      chatRoom.chats[chatRoom.chats.length - 1].createdAt,
                    ).toFormat("MM-dd HH:mm")}
                  </p>
                </div>
                <p className="text-muted-foreground max-w-50 truncate text-sm sm:max-w-60 md:max-w-full">
                  {chatRoom.chats[chatRoom.chats.length - 1].content}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
