import type { Route } from "./+types/create-game";

import { data, redirect } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";

import { insertBasketballGame } from "../mutations";
import { basketballGameSchema } from "../types";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const {
    success,
    data: validData,
    error,
  } = basketballGameSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    return data({ fieldErrors: error.flatten().fieldErrors }, { status: 400 });
  }

  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return redirect("/login");

  // @ts-ignore
  insertBasketballGame(client, { profileId: user.id, ...validData });

  return data({ success: true }, { status: 200 });
}
