import type { Route } from "@rr/app/features/users/apis/+types/edit-profile";

import { UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";

import FetcherFormButton from "~/core/components/fetcher-form-button";
import FormErrors from "~/core/components/form-errors";
import FormSuccess from "~/core/components/form-success";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/core/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Input } from "~/core/components/ui/input";
import { Label } from "~/core/components/ui/label";

import PostionCheckbox from "./position-checkbox";

export default function EditProfileForm({
  name,
  birth,
  height,
  position,
  avatarUrl,
}: {
  name: string;
  birth: string;
  height: number | null;
  position: string[] | null;
  avatarUrl: string | null;
}) {
  const fetcher = useFetcher<Route.ComponentProps["actionData"]>();
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (fetcher.data && "success" in fetcher.data && fetcher.data.success) {
      formRef.current?.blur();
      formRef.current?.querySelectorAll("input").forEach((input) => {
        input.blur();
      });
    }
  }, [fetcher.data]);
  const [avatar, setAvatar] = useState<string | null>(avatarUrl);
  const onChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };
  return (
    <fetcher.Form
      method="post"
      className="w-full max-w-screen-md"
      encType="multipart/form-data"
      ref={formRef}
      action="/api/users/profile"
    >
      <Card className="justify-between">
        <CardHeader>
          <CardTitle>프로필 수정</CardTitle>
          <CardDescription>프로필을 수정해주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full flex-col gap-7">
            <div className="flex items-center gap-10">
              <Label
                htmlFor="avatar"
                className="flex flex-col items-start gap-2"
              >
                <span>프로필 이미지</span>
                <Avatar className="size-24">
                  {avatar ? <AvatarImage src={avatar} alt="Avatar" /> : null}
                  <AvatarFallback>
                    <UserIcon className="text-muted-foreground size-10" />
                  </AvatarFallback>
                </Avatar>
              </Label>
              <div className="text-muted-foreground flex w-1/2 flex-col gap-2 text-sm">
                <div className="flex flex-col gap-1">
                  <span>최대 용량: 1MB</span>
                  <span>파일 형식: PNG, JPG, GIF</span>
                </div>
                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  onChange={onChangeAvatar}
                />
              </div>
            </div>
            <div className="flex flex-col items-start space-y-2">
              <Label htmlFor="name" className="flex flex-col items-start gap-1">
                이름
              </Label>
              <Input
                id="name"
                name="name"
                required
                type="text"
                placeholder="스멀스"
                defaultValue={name}
              />
              {fetcher.data &&
              "fieldErrors" in fetcher.data &&
              fetcher.data.fieldErrors?.name ? (
                <FormErrors errors={fetcher.data?.fieldErrors?.name} />
              ) : null}
            </div>
            <div className="flex flex-col items-start space-y-2">
              <Label
                htmlFor="birth"
                className="flex flex-col items-start gap-1"
              >
                생년월일
              </Label>
              <Input
                id="birth"
                name="birth"
                required
                type="number"
                placeholder="20250720"
                defaultValue={birth || ""}
              />
              {fetcher.data &&
              "fieldErrors" in fetcher.data &&
              fetcher.data.fieldErrors?.birth ? (
                <FormErrors errors={fetcher.data?.fieldErrors?.birth} />
              ) : null}
            </div>
            <div className="flex flex-col items-start space-y-2">
              <Label
                htmlFor="height"
                className="flex flex-col items-start gap-1"
              >
                신장
              </Label>
              <Input
                id="height"
                name="height"
                required
                type="number"
                placeholder="180"
                defaultValue={height || ""}
              />
              {fetcher.data &&
              "fieldErrors" in fetcher.data &&
              fetcher.data.fieldErrors?.height ? (
                <FormErrors errors={fetcher.data?.fieldErrors?.height} />
              ) : null}
            </div>
            <div className="flex flex-col items-start space-y-2">
              <Label
                htmlFor="position"
                className="flex flex-col items-start gap-1"
              >
                포지션
              </Label>
              <div className="flex w-full justify-between gap-2">
                {["PG", "SG", "SF", "PF", "C"].map((v) => (
                  <PostionCheckbox
                    key={`position_${v}`}
                    defaultChecked={position?.includes(v) || false}
                    position={v}
                  />
                ))}
              </div>
              {fetcher.data &&
              "fieldErrors" in fetcher.data &&
              fetcher.data.fieldErrors?.position ? (
                <FormErrors errors={fetcher.data?.fieldErrors?.position} />
              ) : null}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <FetcherFormButton
            submitting={fetcher.state === "submitting"}
            label="프로필 저장"
            className="w-full"
          />
          {fetcher.data && "success" in fetcher.data && fetcher.data.success ? (
            <FormSuccess message="프로필 수정 완료" />
          ) : null}
          {fetcher.data && "error" in fetcher.data && fetcher.data.error ? (
            <FormErrors errors={[fetcher.data.error]} />
          ) : null}
        </CardFooter>
      </Card>
    </fetcher.Form>
  );
}
