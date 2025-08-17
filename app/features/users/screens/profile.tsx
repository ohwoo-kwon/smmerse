import type { Route } from "./+types/profile";

import { DateTime } from "luxon";
import { Suspense } from "react";
import { Await } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";

import EditProfileForm from "../components/edit-profile-form";
import { getUserProfile } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [{ title: `프로필 | ${import.meta.env.VITE_APP_NAME}` }];
};

export async function loader({ request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  const profile = getUserProfile(client, { userId: user!.id });
  return {
    profile,
  };
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { profile } = loaderData;

  return (
    <div className="flex w-full flex-col items-center gap-10 pt-0 pb-8">
      <Suspense
        fallback={
          <div className="bg-card animate-fast-pulse h-60 w-full max-w-screen-md rounded-xl border shadow-sm" />
        }
      >
        <Await
          resolve={profile}
          errorElement={
            <div className="text-red-500">
              프로필 정보를 가져올 수 없습니다.
            </div>
          }
        >
          {(profile) => {
            if (!profile) {
              return null;
            }

            return (
              <EditProfileForm
                name={profile.name}
                birth={
                  profile.birth
                    ? DateTime.fromFormat(profile.birth, "yyyy-MM-dd").toFormat(
                        "yyyyMMdd",
                      )
                    : ""
                }
                sex={profile.sex}
                height={profile.height}
                position={profile.position}
                avatarUrl={profile.avatar_url}
              />
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
