import type { Route } from "./+types/chat";

import { Loader2Icon, SendHorizonalIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { redirect, useFetcher } from "react-router";
import { z } from "zod";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/core/components/ui/avatar";
import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";
import makeServerClient from "~/core/lib/supa-client.server";

import { createMessage } from "../mutations";
import { getMessages } from "../queries";

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

  await createMessage(client, {
    chat_room_id: paramsData.chatRoomId,
    sender_id: formValidData.senderId,
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

  const messages = await getMessages(client, paramsData.chatRoomId);
  return { messages, userId: user.id, chatRoomId: paramsData.chatRoomId };
};

export default function Chat({ loaderData, actionData }: Route.ComponentProps) {
  const { messages, userId } = loaderData;

  const formRef = useRef<HTMLFormElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data.ok) formRef.current?.reset();
  }, [fetcher.data]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex min-h-[calc(100vh-96px)] flex-col">
      <div className="flex-1 overflow-y-auto px-4">
        <div
          ref={scrollRef}
          className="flex h-[calc(100vh-148px)] flex-col gap-y-4 overflow-y-auto last:pb-4"
        >
          {messages.map((message) => (
            <div
              key={`chat_${message.chat_id}`}
              className={`flex items-center gap-2 ${userId === message.sender_id ? "justify-end" : ""}`}
            >
              {userId !== message.sender_id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender.avatar_url || ""} />
                  <AvatarFallback>
                    {message.sender.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-3/4 rounded-lg px-4 py-2 ${userId === message.sender_id ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                <p className="text-sm wrap-break-word">{message.content}</p>
              </div>
            </div>
          ))}
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
