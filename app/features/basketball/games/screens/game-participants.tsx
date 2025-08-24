import type { Route } from "./+types/game-participants";

import {
  CalendarIcon,
  Loader2Icon,
  MessageSquareIcon,
  RulerIcon,
  VenusAndMarsIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import { Suspense, useEffect, useState } from "react";
import {
  Await,
  data,
  redirect,
  useFetcher,
  useSearchParams,
} from "react-router";
import { z } from "zod";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/core/components/ui/avatar";
import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "~/core/components/ui/tabs";
import makeServerClient from "~/core/lib/supa-client.server";
import { calculateAge } from "~/core/lib/utils";

import ParticipantBox from "../components/participant-box";
import { updateApplication } from "../mutations";
import {
  getBasketballGameById,
  getBasketballGameParticipants,
} from "../queries";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `참가자 관리 | ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      name: "description",
      content:
        "내 모집글에 신청한 농구 게스트 참가자들을 확인하고 관리할 수 있는 페이지입니다.",
    },
  ];
};

const formSchema = z.object({
  participantId: z.coerce.number(),
  profileId: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
  const [client] = makeServerClient(request);

  const basketballGameId = Number(params.id);

  const formData = await request.formData();
  const {
    data: validData,
    success,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success)
    return data({ fieldErrors: error.flatten().fieldErrors }, { status: 400 });

  const { participantId, profileId, status } = validData;

  await updateApplication(client, {
    profileId,
    basketballGameId,
    participantId,
    status,
  });
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const basketballGameId = Number(params.id);

  const basketballGame = await getBasketballGameById(client, basketballGameId);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (basketballGame.profile_id !== user!.id)
    return redirect("/basketball/games/my");

  const participants = getBasketballGameParticipants(client, basketballGameId);

  return { participants, userId: user!.id };
};

export default function GameParticipants({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "pending";

  useEffect(() => {
    if (!searchParams.get("status")) {
      searchParams.set("status", "pending");
      setSearchParams(searchParams);
    }
  }, []);
  return (
    <Card className="mx-4 mx-auto min-h-[calc(100vh-96px)] max-w-screen-md border-none p-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle>참가자 관리</CardTitle>
        <CardDescription>
          참가 신청자들의 정보를 확인하고 승인 혹은 거절하세요.
        </CardDescription>
      </CardHeader>
      <Tabs
        value={status}
        onValueChange={(v) => {
          searchParams.set("status", v);
          setSearchParams(searchParams);
        }}
      >
        <TabsList className="w-full">
          <TabsTrigger value="pending">대기</TabsTrigger>
          <TabsTrigger value="approved">승인</TabsTrigger>
          <TabsTrigger value="rejected">거절</TabsTrigger>
        </TabsList>
      </Tabs>
      <CardContent className="flex flex-col gap-2 px-0">
        <Suspense
          fallback={
            <>
              <div className="bg-accent flex h-40 animate-pulse flex-col rounded" />
              <div className="bg-accent flex h-40 animate-pulse flex-col rounded" />
              <div className="bg-accent flex h-40 animate-pulse flex-col rounded" />
              <div className="bg-accent flex h-40 animate-pulse flex-col rounded" />
            </>
          }
        >
          <Await
            resolve={loaderData.participants}
            children={(participants) =>
              participants.filter(
                ({ status: participantStatus }) => status === participantStatus,
              ).length > 0 ? (
                participants.map(
                  ({
                    participant_id,
                    profile: {
                      profile_id,
                      avatar_url,
                      name,
                      birth,
                      height,
                      position,
                      sex,
                    },
                    status: participantStatus,
                  }) =>
                    participantStatus === status && (
                      <ParticipantBox
                        key={`participant_${participant_id}`}
                        status={status}
                        avatar_url={avatar_url || ""}
                        name={name}
                        profile_id={profile_id}
                        userId={loaderData.userId}
                        position={position || []}
                        participant_id={participant_id}
                        birth={birth || ""}
                        height={height || 0}
                        sex={sex || "male"}
                      />
                    ),
                )
              ) : (
                <div className="flex flex-col items-center gap-2 text-center md:text-xl">
                  해당되는 사용자가 없습니다.
                </div>
              )
            }
          ></Await>
        </Suspense>
      </CardContent>
    </Card>
  );
}
