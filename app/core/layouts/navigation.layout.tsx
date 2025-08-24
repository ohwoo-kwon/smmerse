import type { Route } from "./+types/navigation.layout";

import { Suspense } from "react";
import { Await, Outlet, useLocation, useNavigation } from "react-router";

import Footer from "../components/footer";
import LoadingPage from "../components/loading-page";
import NavigationBar from "../components/navigation-bar";
import makeServerClient from "../lib/supa-client.server";

export async function loader({ request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const userPromise = client.auth.getUser();
  return { userPromise };
}

export default function NavigationLayout({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";
  const isSamePage = navigation.location?.pathname === location.pathname;

  const showLoading = isLoading && !isSamePage;

  return (
    <div className="min-h-screen">
      <Suspense fallback={<NavigationBar loading={true} />}>
        <Await resolve={loaderData.userPromise}>
          {({ data: { user } }) =>
            user === null ? (
              <NavigationBar loading={false} />
            ) : (
              <NavigationBar
                name={user.user_metadata.name || "익명의 사용자"}
                email={user.email}
                avatarUrl={user.user_metadata.avatar_url}
                loading={false}
              />
            )
          }
        </Await>
      </Suspense>
      <div className="min-h-[calc(100vh-64px)] py-4 md:py-8">
        {showLoading ? <LoadingPage /> : <Outlet />}
      </div>
      <Footer />
    </div>
  );
}
