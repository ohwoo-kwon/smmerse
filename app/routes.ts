import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("core/layouts/navigation.layout.tsx", [
    index("features/home/screens/home.tsx"),
    route("/error", "core/screens/error.tsx"),
    layout("core/layouts/public.layout.tsx", [
      route("/login", "features/auth/screens/login.tsx"),
      route("/join", "features/auth/screens/join.tsx"),
      ...prefix("/auth", [
        route("/api/resend", "features/auth/apis/resend.tsx"),
        ...prefix("/social", [
          route("/start/:provider", "features/auth/screens/social/start.tsx"),
          route(
            "/complete/:provider",
            "features/auth/screens/social/complete.tsx",
          ),
        ]),
      ]),
    ]),
    layout("core/layouts/private.layout.tsx", { id: "private-auth" }, [
      route("/profile", "features/users/screens/profile.tsx"),
      route("/logout", "features/auth/screens/logout.tsx"),
      // ...prefix("/chats", [
      //   index("features/users/screens/chats.tsx"),
      //   route("/:chatRoomId", "features/users/screens/chat.tsx"),
      // ]),
    ]),
    ...prefix("/basketball", [
      route("/games", "features/basketball/games/screens/games.tsx"),
      layout(
        "core/layouts/private.layout.tsx",
        { id: "private-basketball-game" },
        [
          route(
            "/games/create",
            "features/basketball/games/screens/create-game.tsx",
          ),
          route(
            "/games/:id/edit",
            "features/basketball/games/screens/edit-game.tsx",
          ),
          route("/games/:id", "features/basketball/games/screens/game.tsx"),
        ],
      ),
    ]),
  ]),
  ...prefix("/api", [
    layout("core/layouts/private.layout.tsx", { id: "private-auth-api" }, [
      ...prefix("/users", [
        index("features/users/apis/delete-profile.tsx"),
        route("/password", "features/users/apis/change-password.tsx"),
        route("/email", "features/users/apis/change-email.tsx"),
        route("/profile", "features/users/apis/edit-profile.tsx"),
        route("/message/:userId", "features/users/apis/send-message.tsx"),
      ]),
    ]),
    ...prefix("/crawl", [
      route(
        "/daum",
        "features/basketball/games/apis/crawl-and-create-game.tsx",
      ),
    ]),
    layout(
      "core/layouts/private.layout.tsx",
      { id: "private-basketball-game-api" },
      [
        ...prefix("/basketball", [
          route("/games", "features/basketball/games/apis/create-game.tsx"),
          route("/games/:id", "features/basketball/games/apis/[id].tsx"),
        ]),
      ],
    ),
  ]),
] satisfies RouteConfig;
