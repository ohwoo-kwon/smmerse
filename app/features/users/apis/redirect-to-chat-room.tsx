import type { Route } from "./+types/redirect-to-chat-room";

import { data, redirect } from "react-router";
import { z } from "zod";

import { requireMethod } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";

import { getOrCreateChatRoom } from "../mutations";

const formSchema = z.object({
  fromUserId: z.string().min(1),
  toUserId: z.string().min(1),
});

export const action = async ({ request }: Route.ActionArgs) => {
  requireMethod("POST");
  const [client] = makeServerClient(request);

  const formData = await request.formData();
  const {
    success,
    data: validData,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    return data({ error: error.flatten().fieldErrors }, { status: 400 });
  }

  const chatRoomId = await getOrCreateChatRoom(client, {
    fromUserId: validData.fromUserId,
    toUserId: validData.toUserId,
  });

  return redirect(`/chats/${chatRoomId}`);
};
