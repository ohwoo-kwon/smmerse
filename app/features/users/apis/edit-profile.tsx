import type { Route } from "./+types/edit-profile";

import { data } from "react-router";
import { z } from "zod";

import makeServerClient from "~/core/lib/supa-client.server";

import { getUserProfile } from "../queries";

const schema = z.object({
  name: z.string().min(1),
  birth: z
    .string()
    .regex(/^\d{8}$/, "생년월일은 YYYYMMDD 형태로 입력해주세요 (예: 20250720)")
    .refine((date) => {
      const year = parseInt(date.substring(0, 4));
      const month = parseInt(date.substring(4, 6));
      const day = parseInt(date.substring(6, 8));

      const dateObj = new Date(year, month - 1, day);
      return (
        dateObj.getFullYear() === year &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getDate() === day &&
        year >= 1900 &&
        year <= new Date().getFullYear()
      );
    }, "올바른 날짜를 입력해주세요"),
  height: z.coerce.number().positive("키를 올바르게 입력해주세요"),
  PG: z.coerce.boolean(),
  SG: z.coerce.boolean(),
  SF: z.coerce.boolean(),
  PF: z.coerce.boolean(),
  C: z.coerce.boolean(),
  avatar: z.instanceof(File),
});

export async function action({ request }: Route.ActionArgs) {
  const [client] = makeServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  if (request.method !== "POST") {
    return data(null, { status: 405 });
  }

  if (!user) {
    return data(null, { status: 401 });
  }

  const formData = await request.formData();
  const {
    success,
    data: validData,
    error,
  } = schema.safeParse(Object.fromEntries(formData));

  const positionError = !(
    formData.get("PG") ||
    formData.get("SG") ||
    formData.get("SF") ||
    formData.get("SG") ||
    formData.get("C")
  );

  if (!success) {
    return data(
      {
        fieldErrors: {
          ...error.flatten().fieldErrors,
          position: positionError
            ? ["최소 한 개의 포지션을 선택해주세요."]
            : undefined,
        },
      },
      { status: 400 },
    );
  }
  if (positionError)
    return data(
      {
        fieldErrors: {
          name: undefined,
          birth: undefined,
          height: undefined,
          position: ["최소 한 개의 포지션을 선택해주세요."],
        },
      },
      { status: 400 },
    );

  const profile = await getUserProfile(client, { userId: user.id });
  let avatarUrl = profile?.avatar_url || null;

  if (
    validData.avatar &&
    validData.avatar instanceof File &&
    validData.avatar.size > 0 &&
    validData.avatar.size < 1024 * 1024 &&
    validData.avatar.type.startsWith("image/")
  ) {
    const { error: uploadError } = await client.storage
      .from("avatars")
      .upload(user.id, validData.avatar, {
        upsert: true,
      });

    if (uploadError) {
      return data({ error: uploadError.message }, { status: 400 });
    }

    const {
      data: { publicUrl },
    } = client.storage.from("avatars").getPublicUrl(user.id);
    avatarUrl = publicUrl;
  }

  const position = [];

  if (validData.PG) position.push("PG");
  if (validData.SG) position.push("SG");
  if (validData.SF) position.push("SF");
  if (validData.PF) position.push("PF");
  if (validData.C) position.push("C");

  const { error: updateProfileError } = await client
    .from("profiles")
    .update({
      name: validData.name,
      birth: validData.birth,
      height: validData.height,
      position,
      avatar_url: avatarUrl,
    })
    .eq("profile_id", user.id);

  const { error: updateError } = await client.auth.updateUser({
    data: {
      name: validData.name,
      display_name: validData.name,
      avatar_url: avatarUrl,
    },
  });

  if (updateError) {
    return data({ error: updateError.message }, { status: 400 });
  }

  if (updateProfileError) {
    return data({ error: updateProfileError.message }, { status: 400 });
  }

  return {
    success: true,
  };
}
