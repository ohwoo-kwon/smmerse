import type { Route } from "./+types/navigation.layout";

import {
  BellIcon,
  Clock5Icon,
  Gamepad2Icon,
  HandHelpingIcon,
  MenuIcon,
  MessageSquareMoreIcon,
  UniversityIcon,
  UserIcon,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigation } from "react-router";

import { getNotificationsUnReadCount } from "~/features/notifications/queries";

import Footer from "../components/footer";
import { Button } from "../components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import makeServerClient from "../lib/supa-client.server";

export async function loader({ request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (user) {
    const count = await getNotificationsUnReadCount(client, user.id);
    return { user, notificationCount: count };
  }

  return { user };
}

function MenuButton({ isLogin }: { isLogin: boolean }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-8 px-4">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div>
          <h3 className="text-xl font-semibold">픽업 게임</h3>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">매치</h3>
          <div className="grid grid-cols-3 gap-y-6">
            <SheetClose asChild>
              <Link to="/login" className="flex flex-col items-center gap-2">
                <HandHelpingIcon />
                <span className="text-sm">게스트</span>
              </Link>
            </SheetClose>
            {/* <SheetClose asChild>
              <Link to="/" className="flex flex-col items-center gap-2">
                <HandshakeIcon />
                <span className="text-sm">팀 모집</span>
              </Link>
            </SheetClose> */}
            <SheetClose asChild>
              <Link to="/gyms" className="flex flex-col items-center gap-2">
                <UniversityIcon />
                <span className="text-sm">체육관</span>
              </Link>
            </SheetClose>
            {isLogin && (
              <>
                <SheetClose asChild>
                  <Link
                    to="/chats"
                    className="flex flex-col items-center gap-2"
                  >
                    <MessageSquareMoreIcon />
                    <span className="text-sm">채팅</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/my/registrations"
                    className="flex flex-col items-center gap-2"
                  >
                    <Clock5Icon />
                    <span className="text-sm">신청 내역</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/my/games"
                    className="flex flex-col items-center gap-2"
                  >
                    <Gamepad2Icon />
                    <span className="text-sm">모집 내역</span>
                  </Link>
                </SheetClose>
              </>
            )}
          </div>
        </div>
        {isLogin && (
          <SheetFooter>
            <Button variant="secondary" asChild>
              <SheetClose asChild>
                <Link to="/logout">로그아웃</Link>
              </SheetClose>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default function NavigationLayout({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";
  const { user, notificationCount } = loaderData;

  return (
    <div>
      <nav className="flex h-12 items-center justify-between border-b px-5 shadow-xs">
        <Link to="/">
          <h1 className="text-lg font-extrabold">
            {import.meta.env.VITE_APP_NAME}
          </h1>
        </Link>
        <div className="flex gap-0.5">
          {!!user && (
            <Button size="icon" variant="ghost" asChild>
              <Link className="relative" to={"/notifications"}>
                <BellIcon />
                {!!notificationCount && (
                  <div className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-600 text-center text-xs text-white" />
                )}
              </Link>
            </Button>
          )}
          <Button size="icon" variant="ghost" asChild>
            <Link to={user ? "/profile" : "/login"}>
              <UserIcon />
            </Link>
          </Button>
          <MenuButton isLogin={!!user} />
        </div>
      </nav>
      <div className="min-h-[calc(100vh-48px)]">
        <Outlet />
      </div>
      {!(
        location.pathname.includes("/games/") ||
        location.pathname.includes("/chats")
      ) && <Footer />}
    </div>
  );
}
