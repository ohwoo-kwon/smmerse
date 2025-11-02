import type { Route } from "./+types/notifications";

import { OctagonXIcon, Trash2Icon } from "lucide-react";
import { DateTime } from "luxon";
import { Link, redirect, useRevalidator } from "react-router";

import { Button } from "~/core/components/ui/button";
import { browserClient } from "~/core/db/client.broswer";
import makeServerClient from "~/core/lib/supa-client.server";
import { cn } from "~/core/lib/utils";

import { deleteNotification, updateIsRead } from "../mutations";
import { getNotifications } from "../queries";

export const meta: Route.MetaFunction = () => [
  { title: `${import.meta.env.VITE_APP_NAME} | 알림` },
  {
    name: "description",
    content: "나에게 온 알림을 확인하세요.",
  },
  {
    property: "og:title",
    content: `${import.meta.env.VITE_APP_NAME} | 알림`,
  },
  {
    property: "og:description",
    content: "나에게 온 알림을 확인하세요.",
  },
  {
    property: "og:image",
    content:
      "https://wujxmuluphdazgapgwrr.supabase.co/storage/v1/object/public/avatars/e421200d-88ca-4711-a667-b000290ef252",
  },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return redirect("/login");

  const notifications = await getNotifications(client, user.id);

  return { notifications };
};

export default function Notifications({ loaderData }: Route.ComponentProps) {
  const { notifications } = loaderData;
  const revalidator = useRevalidator();

  return (
    <div className="mx-auto max-w-screen-lg space-y-4 py-4">
      <h1 className="px-4 text-3xl font-bold">알림</h1>

      <div>
        {notifications.length > 0 ? (
          notifications.map(
            ({
              notification_id,
              sender,
              type,
              game_id,
              game,
              chat_room_id,
              is_read,
              created_at,
            }) => {
              let title = "";
              let text = "";
              let link = "";

              switch (type) {
                case "CHAT_MESSAGE":
                  title = "채팅";
                  text = `${sender.name}님이 새로운 메시지를 보냈습니다.`;
                  link = `/chats/${chat_room_id}`;
                  break;
                case "GAME_JOIN_REQUEST":
                  title = "게스트";
                  text = `${sender.name}님이 ${game?.gym.name}에 참여를 신청하였습니다.`;
                  link = `/games/${game_id}/participants`;
                  break;
                case "PARTICIPATION_STATUS":
                  title = "참여 내역";
                  text = `${game?.gym.name}의 호스트가 참여 상태를 변경하였습니다.`;
                  link = `/my/registrations`;
                  break;
              }

              return (
                <Link
                  id={notification_id}
                  to={link}
                  className={cn(
                    "flex flex-col gap-1 border-b p-4 last:border-0",
                    is_read ? "bg-muted" : "",
                  )}
                  onClick={async () => {
                    await updateIsRead(browserClient, notification_id);
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p
                        className={cn(
                          "text-primary flex items-center gap-2 text-sm font-bold",
                          is_read ? "text-muted-foreground" : "",
                        )}
                      >
                        {title}
                        <span className="text-muted-foreground text-xs font-light">
                          {DateTime.fromISO(created_at.replace(" ", "T"), {
                            zone: "utc",
                          })
                            .toLocal()
                            .toFormat("MM.dd HH:mm")}
                        </span>
                      </p>
                      <p className={cn(is_read ? "text-muted-foreground" : "")}>
                        {text}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={is_read ? "text-muted-foreground" : ""}
                      onClick={async (e) => {
                        e.preventDefault();
                        await deleteNotification(
                          browserClient,
                          notification_id,
                        );
                        revalidator.revalidate();
                      }}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </Link>
              );
            },
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <OctagonXIcon
              size={80}
              strokeWidth={1}
              className="text-muted-foreground"
            />
            <p className="text-lg font-semibold">알림이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
