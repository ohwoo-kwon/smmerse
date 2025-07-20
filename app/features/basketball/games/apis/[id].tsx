import type { Route } from "./+types/[id]";

import { data } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";

import { deleteBasketballGame, updateBasketballGame } from "../mutations";
import { basketballGameSchema } from "../types";

export async function action({ request, params }: Route.ActionArgs) {
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return data({ message: "Unauthorized" }, { status: 401 });
  }

  if (request.method === "PUT") {
    const formData = await request.formData();
    const {
      success,
      data: validData,
      error,
    } = basketballGameSchema.safeParse(Object.fromEntries(formData));
    if (!success) {
      return data(
        { fieldErrors: error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    await updateBasketballGame(client, Number(params.id), validData);
    return data({ success: true }, { status: 200 });
  }

  if (request.method === "DELETE") {
    await deleteBasketballGame(client, params.id);
    return data({ success: true }, { status: 200 });
  }

  return data({ message: "Method not allowed" }, { status: 405 });
}
