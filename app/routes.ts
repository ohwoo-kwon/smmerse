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
    ...prefix("/gyms", [
      index("features/gyms/screens/gyms.tsx"),
      route("/:gymId", "features/gyms/screens/gym.tsx"),
    ]),
    ...prefix("/games", [
      route("/create", "features/games/screens/game-create.tsx"),
      route("/:gameId", "features/games/screens/game.tsx"),
    ]),
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
      ...prefix("/my", [
        index("features/users/screens/my.tsx"),
        route("/profile", "features/users/screens/profile.tsx"),
      ]),
      route("/logout", "features/auth/screens/logout.tsx"),
      ...prefix("/chats", [
        index("features/users/screens/chats.tsx"),
        route("/:chatRoomId", "features/users/screens/chat.tsx"),
      ]),
      ...prefix("/games", [
        ...prefix("/:gameId", [
          route("/participants", "features/games/screens/participants.tsx"),
          route("/update", "features/games/screens/game-update.tsx"),
        ]),
      ]),
      ...prefix("/gyms", [
        route("/create", "features/gyms/screens/gym-create.tsx"),
        route("/:gymId/update", "features/gyms/screens/gym-update.tsx"),
      ]),
      route(
        "/notifications",
        "features/notifications/screens/notifications.tsx",
      ),
      ...prefix("/my", [
        route("/registrations", "features/users/screens/my-registrations.tsx"),
        route("/games", "features/users/screens/my-games.tsx"),
      ]),
    ]),
    // ...prefix("/basketball/games", [
    //   index("features/basketball/games/screens/games.tsx"),
    //   ...prefix("/:id", [index("features/basketball/games/screens/game.tsx")]),
    //   layout(
    //     "core/layouts/private.layout.tsx",
    //     { id: "private-basketball-game" },
    //     [
    //       route("/create", "features/basketball/games/screens/create-game.tsx"),
    //       route("/my", "features/basketball/games/screens/my-games.tsx"),
    //       route(
    //         "/participation",
    //         "features/basketball/games/screens/game-participation.tsx",
    //       ),
    //       ...prefix("/:id", [
    //         route("/edit", "features/basketball/games/screens/edit-game.tsx"),
    //         route(
    //           "/participants",
    //           "features/basketball/games/screens/game-participants.tsx",
    //         ),
    //       ]),
    //     ],
    //   ),
    // ]),
  ]),
  ...prefix("/api", [
    layout("core/layouts/private.layout.tsx", { id: "private-auth-api" }, [
      ...prefix("/users", [
        index("features/users/apis/delete-profile.tsx"),
        route("/password", "features/users/apis/change-password.tsx"),
        route("/email", "features/users/apis/change-email.tsx"),
        route("/profile", "features/users/apis/edit-profile.tsx"),
        route("/chat-room", "features/users/apis/redirect-to-chat-room.tsx"),
        route("/message/:userId", "features/users/apis/send-message.tsx"),
      ]),
    ]),
    ...prefix("/crawl", [
      route("/daum", "features/games/apis/crawl-from-daum.tsx"),
    ]),
    //   layout(
    //     "core/layouts/private.layout.tsx",
    //     { id: "private-basketball-game-api" },
    //     [
    //       ...prefix("/basketball", [
    //         route("/games", "features/basketball/games/apis/create-game.tsx"),
    //         route("/games/:id", "features/basketball/games/apis/[id].tsx"),
    //       ]),
    //     ],
    //   ),
  ]),
] satisfies RouteConfig;
