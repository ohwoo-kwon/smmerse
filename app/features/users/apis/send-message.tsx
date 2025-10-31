import type { Route } from "./+types/send-message";

import { data, redirect } from "react-router";
import { z } from "zod";

import { requireMethod } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";

import { getOrCreateChatRoom, sendMessage } from "../mutations";

const formSchema = z.object({
  content: z.string().min(1),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
  requireMethod("POST");
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  const toUserId = params.userId;

  if (!user) return redirect("/login");

  const chatRoomId = await getOrCreateChatRoom(client, {
    fromUserId: user.id,
    toUserId,
  });

  const formData = await request.formData();
  const {
    success,
    data: validData,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    return data(
      { error: error.flatten().fieldErrors.content },
      { status: 400 },
    );
  }

  await sendMessage(client, {
    chatRoomId,
    senderId: user.id,
    recipientId: toUserId,
    content: validData.content,
  });

  return redirect(`/chats/${chatRoomId}`);
};
