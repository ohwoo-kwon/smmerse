import type { Route } from "./+types/gym-create";

import {
  AirVentIcon,
  GlassWaterIcon,
  Loader2Icon,
  ShowerHeadIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import { Form, redirect, useNavigation } from "react-router";
import { z } from "zod";

import FormErrors from "~/core/components/form-errors";
import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";
import { Label } from "~/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/core/components/ui/select";
import { Textarea } from "~/core/components/ui/textarea";
import makeServerClient from "~/core/lib/supa-client.server";

import { createGym, createGymPhoto } from "../mutations";
import { cityEnum } from "../schema";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "체육관 이름을 입력해주세요")
    .max(20, "체육관 이름은 20자 이하로 입력해주세요"),
  description: z.string().nullable(),
  city: z.enum(cityEnum.enumValues, { message: "시도를 선택 해주세요" }),
  district: z
    .string()
    .min(1, "구군을 입력해주세요")
    .max(10, "구군은 10자 이하로 입력해주세요"),
  full_address: z
    .string()
    .min(1, "상세주소를 입력해주세요")
    .max(30, "상세주소는 30자 이하로 입력해주세요"),
  has_water_dispenser: z.coerce.boolean(),
  has_heating_cooling: z.coerce.boolean(),
  has_shower: z.coerce.boolean(),
  parking_info: z.string().nullable(),
  usage_rules: z.string().nullable(),
  images: z
    .any()
    .transform((val) => (Array.isArray(val) ? val : val ? [val] : []))
    .refine((files) => files.every((f) => f instanceof File), {
      message: "파일 형식이 올바르지 않습니다",
    }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const [client] = makeServerClient(request);
  const formData = await request.formData();

  const formValidation = formSchema.safeParse(Object.fromEntries(formData));
  const images = formData.getAll("images") as File[];

  if (!formValidation.success)
    return {
      fieldErrors: formValidation.error.flatten().fieldErrors,
      error: undefined,
    };

  const {
    name,
    description,
    city,
    district,
    full_address,
    has_water_dispenser,
    has_heating_cooling,
    has_shower,
    parking_info,
    usage_rules,
  } = formValidation.data;

  try {
    const gymId = await createGym(client, {
      name,
      description,
      city,
      district,
      full_address,
      has_water_dispenser,
      has_heating_cooling,
      has_shower,
      parking_info,
      usage_rules,
    });

    const photoUrls = await Promise.all(
      images.map(async (file: File, idx: number) => {
        const filePath = `${gymId}/${DateTime.now()}_${idx}`;
        const { error } = await client.storage
          .from("gyms")
          .upload(filePath, file, {
            upsert: true,
          });
        if (error) throw error;

        const {
          data: { publicUrl },
        } = client.storage.from("gyms").getPublicUrl(filePath);

        return publicUrl;
      }),
    );

    await Promise.all(
      photoUrls.map(async (url) => {
        await createGymPhoto(client, { gym_id: gymId, url });
      }),
    );
  } catch (error) {
    if (error instanceof Error)
      return { fieldErrors: undefined, error: error.message };
    return {
      fieldErrors: undefined,
      error: "체육관 등록에 실패하였습니다",
    };
  }
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user || user.id !== "e421200d-88ca-4711-a667-b000290ef252")
    return redirect("/gyms");
};

export default function GymCreate({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  return (
    <div className="mx-auto max-w-screen-lg space-y-8 p-4">
      <h1 className="text-3xl font-bold">체육관 등록</h1>

      {/* Form */}
      <Form method="POST" encType="multipart/form-data" className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="images">체육관 사진</Label>
          <Input id="images" name="images" type="file" multiple />
          {actionData &&
          "fieldErrors" in actionData &&
          actionData.fieldErrors?.images ? (
            <FormErrors errors={actionData.fieldErrors?.images} />
          ) : null}
        </div>
        <div className="space-y-1">
          <Label htmlFor="name">체육관 이름</Label>
          <Input id="name" name="name" placeholder="서울 강남 스멀스 체육관" />
          {actionData &&
          "fieldErrors" in actionData &&
          actionData.fieldErrors?.name ? (
            <FormErrors errors={actionData.fieldErrors?.name} />
          ) : null}
        </div>
        <div className="space-y-1">
          <Label htmlFor="description">체육관 소개</Label>
          <Textarea
            id="description"
            name="description"
            placeholder={`서울 강남 중심에 위치한 스멀스 체육관
개인 연습 및 3vs3 하기 좋은 체육관입니다.`}
            className="h-30 resize-none"
          />
          {actionData &&
          "fieldErrors" in actionData &&
          actionData.fieldErrors?.description ? (
            <FormErrors errors={actionData.fieldErrors?.description} />
          ) : null}
        </div>
        <div className="space-y-1">
          <Label htmlFor="city">시/도</Label>
          <Select name="city">
            <SelectTrigger id="city" className="w-full">
              <SelectValue placeholder="도시를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {cityEnum.enumValues.map((city) => (
                <SelectItem key={`select_${city}`} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {actionData &&
          "fieldErrors" in actionData &&
          actionData.fieldErrors?.city ? (
            <FormErrors errors={actionData.fieldErrors?.city} />
          ) : null}
        </div>
        <div className="space-y-1">
          <Label htmlFor="district">구/군</Label>
          <Input id="district" name="district" placeholder="강남구" />
          {actionData &&
          "fieldErrors" in actionData &&
          actionData.fieldErrors?.district ? (
            <FormErrors errors={actionData.fieldErrors?.district} />
          ) : null}
        </div>
        <div className="space-y-1">
          <Label htmlFor="full_address">상세주소</Label>
          <Input
            id="full_address"
            name="full_address"
            placeholder="서울특별시 강남구 압구정로 306"
          />
          {actionData &&
          "fieldErrors" in actionData &&
          actionData.fieldErrors?.full_address ? (
            <FormErrors errors={actionData.fieldErrors?.full_address} />
          ) : null}
        </div>
        <div className="space-y-1">
          <Label>시설</Label>
          <div className="flex gap-8">
            <div className="flex flex-col items-center gap-1">
              <Input
                id="has_water_dispenser"
                name="has_water_dispenser"
                type="checkbox"
                className="peer hidden"
              />
              <Label
                htmlFor="has_water_dispenser"
                className="text-muted-foreground flex size-14 items-center justify-center rounded-full border p-2 peer-checked:border-blue-300 peer-checked:bg-blue-100 peer-checked:text-blue-800"
              >
                <GlassWaterIcon />
              </Label>
              <span className="text-muted-foreground text-xs line-through peer-checked:text-blue-800 peer-checked:no-underline">
                정수기
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Input
                id="has_heating_cooling"
                name="has_heating_cooling"
                type="checkbox"
                className="peer hidden"
              />
              <Label
                htmlFor="has_heating_cooling"
                className="text-muted-foreground flex size-14 items-center justify-center rounded-full border p-2 peer-checked:border-green-300 peer-checked:bg-green-100 peer-checked:text-green-800"
              >
                <AirVentIcon />
              </Label>
              <span className="text-muted-foreground text-xs line-through peer-checked:text-green-800 peer-checked:no-underline">
                냉난방
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Input
                id="has_shower"
                name="has_shower"
                type="checkbox"
                className="peer hidden"
              />
              <Label
                htmlFor="has_shower"
                className="text-muted-foreground flex size-14 items-center justify-center rounded-full border p-2 peer-checked:border-purple-300 peer-checked:bg-purple-100 peer-checked:text-purple-800"
              >
                <ShowerHeadIcon />
              </Label>
              <span className="text-muted-foreground text-xs line-through peer-checked:text-purple-800 peer-checked:no-underline">
                샤워 가능
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="parking_info">주차 정보</Label>
          <Textarea
            id="parking_info"
            name="parking_info"
            placeholder={`주차는 체육관 옆 공터에 가능합니다.
주차비는 무료이며, 최대 14대까지 가능합니다.`}
            className="h-30 resize-none"
          />
          {actionData &&
          "fieldErrors" in actionData &&
          actionData.fieldErrors?.parking_info ? (
            <FormErrors errors={actionData.fieldErrors?.parking_info} />
          ) : null}
        </div>
        <div className="space-y-1">
          <Label htmlFor="usage_rules">이용 규칙</Label>
          <Textarea
            id="usage_rules"
            name="usage_rules"
            placeholder={`흡연은 체육관 밖에 나가서 가능합니다.
물을 제외한 음료 및 음식 반입을 금지합니다.
실내 전용 운동화를 착용하고 경기를 뛰어주세요.`}
            className="h-30 resize-none"
          />
          {actionData &&
          "fieldErrors" in actionData &&
          actionData.fieldErrors?.usage_rules ? (
            <FormErrors errors={actionData.fieldErrors?.usage_rules} />
          ) : null}
        </div>
        <Button className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "등록"}
        </Button>
        {actionData && "error" in actionData && actionData.error ? (
          <FormErrors errors={[actionData.error]} />
        ) : null}
      </Form>
    </div>
  );
}
