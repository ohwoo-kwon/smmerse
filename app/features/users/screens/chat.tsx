import type { Database } from "database.types";

import type { Route } from "./+types/chat";

import { Loader2Icon, SendHorizonalIcon } from "lucide-react";
import { DateTime } from "luxon";
import { Fragment, useEffect, useRef, useState } from "react";
import { redirect, useFetcher } from "react-router";
import { z } from "zod";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/core/components/ui/avatar";
import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";
import { browserClient } from "~/core/db/client.broswer";
import makeServerClient from "~/core/lib/supa-client.server";
import { cn } from "~/core/lib/utils";

import { sendMessage, updateChecked } from "../mutations";
import { getMessages, getRoomsParticipant } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `채팅방 | ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      name: "description",
      content: `${import.meta.env.VITE_APP_NAME}의 다른 사용자들과 대화할 수 있는 채팅방입니다.`,
    },
  ];
};

const paramsSchema = z.object({
  chatRoomId: z.coerce.number(),
});

const formSchema = z.object({
  senderId: z.string().min(1),
  recipientId: z.string().min(1),
  content: z.string().min(1),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
  const [client] = makeServerClient(request);

  const formData = await request.formData();
  const {
    data: formValidData,
    success: formSuccess,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!formSuccess) return { ok: false };

  const { data: paramsData, success } = paramsSchema.safeParse(params);
  if (!success) return redirect("/chats");

  await sendMessage(client, {
    chatRoomId: paramsData.chatRoomId,
    senderId: formValidData.senderId,
    recipientId: formValidData.recipientId,
    content: formValidData.content,
  });

  return { ok: true };
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);
  const { data: paramsData, success } = paramsSchema.safeParse(params);
  if (!success) return redirect("/chats");
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return redirect("/login");

  await updateChecked(client, {
    chatRoomId: paramsData.chatRoomId,
    profileId: user.id,
  });
  const messages = await getMessages(client, user.id, paramsData.chatRoomId);

  const participant = await getRoomsParticipant(client, {
    chatRoomId: paramsData.chatRoomId,
    userId: user.id,
  });

  return {
    messages,
    userId: user.id,
    chatRoomId: paramsData.chatRoomId,
    participant,
  };
};

export default function Chat({ loaderData }: Route.ComponentProps) {
  const { userId, participant, chatRoomId } = loaderData;

  const [messages, setMessages] = useState(loaderData.messages);

  const formRef = useRef<HTMLFormElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.ok) {
      formRef.current?.reset();
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const changes = browserClient
      .channel(`room:${chatRoomId}-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        async (payload) => {
          const newMessage =
            payload.new as Database["public"]["Tables"]["chats"]["Row"];

          if (newMessage.sender_id !== userId) {
            await browserClient
              .from("chats")
              .update({ is_checked: true })
              .eq("chat_id", newMessage.chat_id);
          }

          setMessages((prev) => [...prev, newMessage]);
        },
      )
      .subscribe();

    return () => {
      changes.unsubscribe();
    };
  }, [chatRoomId, userId]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-96px)] max-w-screen-md flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div
          ref={scrollRef}
          className="flex h-[calc(100vh-148px)] flex-col gap-y-4 overflow-y-auto last:pb-4"
        >
          <div className="text-muted-foreground text-center text-xs">
            채팅은 최대 30일 동안 보관됩니다.
          </div>
          {messages.map((message, index) => {
            const messageDate = DateTime.fromISO(
              message.createdAt.replace(" ", "T"),
              { zone: "utc" },
            )
              .toLocal()
              .toFormat("yyyy-MM-dd");
            const prevMessage = messages[index - 1];
            const prevDate = prevMessage
              ? DateTime.fromISO(prevMessage.createdAt)
                  .toLocal()
                  .toFormat("yyyy-MM-dd")
              : null;

            const showDateDivider = messageDate !== prevDate;
            return (
              <Fragment key={`chat_${message.chat_id}`}>
                {showDateDivider && (
                  <div className="mx-8 my-2 flex items-center justify-center">
                    <div className="flex-1 border-t"></div>
                    <span className="text-muted-foreground mx-3 text-xs">
                      {DateTime.fromISO(message.createdAt.replace(" ", "T"), {
                        zone: "utc",
                      })
                        .toLocal()
                        .toFormat("yyyy년 MM월 dd일")}
                    </span>
                    <div className="flex-1 border-t"></div>
                  </div>
                )}

                <div
                  className={`flex items-start gap-2 ${userId === message.sender_id ? "flex-row-reverse" : ""}`}
                >
                  {userId !== message.sender_id && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.profile.avatar_url || ""} />
                      <AvatarFallback>
                        {participant.profile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-3/4 rounded-lg border-none px-4 py-2 text-sm wrap-break-word whitespace-pre-wrap ${userId === message.sender_id ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none"}`}
                  >
                    {message.content}
                  </div>
                  <div className="flex flex-col items-end self-end">
                    {!message.is_checked && (
                      <span
                        className={cn(
                          "text-primary text-center text-xs",
                          userId === message.sender_id ? "" : "self-start",
                        )}
                      >
                        1
                      </span>
                    )}
                    <span className="text-muted-foreground text-xs">
                      {DateTime.fromISO(message.createdAt.replace(" ", "T"), {
                        zone: "utc",
                      })
                        .toLocal()
                        .toFormat("HH:mm")}
                    </span>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
      <div className="border-t p-4 pb-0">
        <fetcher.Form
          ref={formRef}
          method="POST"
          className="flex items-center gap-2"
        >
          <Input name="senderId" type="hidden" defaultValue={userId} />
          <Input
            name="recipientId"
            type="hidden"
            defaultValue={participant.profile.profile_id}
          />
          <Input
            name="content"
            placeholder="메시지를 작성해주세요."
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <SendHorizonalIcon />
            )}
          </Button>
        </fetcher.Form>
      </div>
    </div>
  );
}

export const shouldRevalidate = () => false;
