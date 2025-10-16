import type { Route } from "./+types/navigation.layout";

import {
  HandHelpingIcon,
  HandshakeIcon,
  MenuIcon,
  MessageSquareMoreIcon,
  UniversityIcon,
  UserIcon,
} from "lucide-react";
import { Suspense } from "react";
import { Await, Link, Outlet, useLocation, useNavigation } from "react-router";

import Footer from "../components/footer";
import NavigationBar from "../components/navigation-bar";
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
import { Skeleton } from "../components/ui/skeleton";
import makeServerClient from "../lib/supa-client.server";

export async function loader({ request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const userPromise = client.auth.getUser();
  return { userPromise };
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
          <div className="grid grid-cols-3">
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
            <SheetClose asChild>
              <Link to="/chats" className="flex flex-col items-center gap-2">
                <MessageSquareMoreIcon />
                <span className="text-sm">채팅</span>
              </Link>
            </SheetClose>
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

  return (
    <div>
      <nav className="flex h-12 items-center justify-between border-b px-5 shadow-xs">
        <Link to="/">
          <h1 className="text-lg font-extrabold">
            {import.meta.env.VITE_APP_NAME}
          </h1>
        </Link>
        <Suspense
          fallback={
            <div className="flex gap-1">
              <Skeleton className="size-8" />
              <Skeleton className="size-8" />
              <Skeleton className="size-8" />
            </div>
          }
        >
          <Await resolve={loaderData.userPromise}>
            {({ data: { user } }) => (
              <div className="flex gap-1">
                <MenuButton isLogin={!!user} />
                <Button size="icon" variant="ghost" asChild>
                  <Link to={user ? "/profile" : "/login"}>
                    <UserIcon />
                  </Link>
                </Button>
              </div>
            )}
          </Await>
        </Suspense>
      </nav>
      <div className="min-h-[calc(100vh-48px)]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
