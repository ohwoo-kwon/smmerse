import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  pgEnum,
  pgPolicy,
  pgTable,
  uuid,
} from "drizzle-orm/pg-core";
import { authUid, authenticatedRole } from "drizzle-orm/supabase";

import { timestamps } from "~/core/db/timestamp";

import { gameParticipants, games } from "../games/schema";
import { chatRooms, profiles } from "../users/schema";

export const notificationTypeEnum = pgEnum("notification_type", [
  "GAME_JOIN_REQUEST",
  "CHAT_MESSAGE",
  "PARTICIPATION_STATUS",
]);

export const notifications = pgTable(
  "notifications",
  {
    notification_id: uuid().defaultRandom().primaryKey(),
    sender_profile_id: uuid()
      .references(() => profiles.profile_id, {
        onDelete: "cascade",
      })
      .notNull(),
    recipient_profile_id: uuid()
      .references(() => profiles.profile_id, {
        onDelete: "cascade",
      })
      .notNull(),
    type: notificationTypeEnum().notNull(),
    game_id: bigint({ mode: "number" }).references(() => games.game_id, {
      onDelete: "cascade",
    }),
    chat_room_id: bigint({ mode: "number" }).references(
      () => chatRooms.chat_room_id,
      {
        onDelete: "cascade",
      },
    ),
    participant_id: bigint({ mode: "number" }).references(
      () => gameParticipants.participant_id,
      {
        onDelete: "cascade",
      },
    ),
    is_read: boolean("is_read").default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    // 읽기 권한: 본인(recipient_profile_id)만 접근 가능
    pgPolicy("select-notification-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.recipient_profile_id} or ${authUid} = ${table.sender_profile_id}`,
    }),
    // 삽입 권한: 로그인한 사용자가 자신의 알림만 추가 가능
    pgPolicy("insert-notification-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.sender_profile_id}`,
    }),
    // 업데이트 권한 (읽음 표시 등): 본인만 가능
    pgPolicy("update-notification-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.recipient_profile_id}`,
      withCheck: sql`${authUid} = ${table.recipient_profile_id}`,
    }),
    // 삭제 권한 (옵션): 본인만 가능
    pgPolicy("delete-notification-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.recipient_profile_id}`,
    }),
  ],
);
