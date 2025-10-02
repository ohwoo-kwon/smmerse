import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  date,
  integer,
  pgEnum,
  pgPolicy,
  pgTable,
  serial,
  text,
  time,
  uuid,
} from "drizzle-orm/pg-core";
import { authUid, authenticatedRole } from "drizzle-orm/supabase";

import { timestamps } from "~/core/db/timestamp";
import { gyms } from "~/features/gyms/schema";
import { profiles } from "~/features/users/schema";

export const gameTypeEnum = pgEnum("game_type", [
  "1on1",
  "3on3",
  "5on5",
  "기타",
]);

export const gameGenderTypeEnum = pgEnum("game_gender_type", [
  "상관없음",
  "남자",
  "여자",
]);

export const gameTimeEnum = pgEnum("game_time_type", [
  "1시간",
  "1시간 30분",
  "2시간",
  "2시간 30분",
  "3시간",
  "3시간 30분 이상",
]);

export const games = pgTable(
  "games",
  {
    game_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    profile_id: uuid()
      .references(() => profiles.profile_id, {
        onDelete: "cascade",
      })
      .notNull(),
    gym_id: uuid()
      .references(() => gyms.gym_id, {
        onDelete: "cascade",
      })
      .notNull(),
    game_type: gameTypeEnum().notNull(),
    game_gender_type: gameGenderTypeEnum().notNull(),
    description: text(),
    start_date: date().notNull(),
    start_time: time().notNull(),
    game_time: gameTimeEnum().notNull(),
    guard: boolean(),
    forward: boolean(),
    center: boolean(),
    min_participants: integer().notNull(),
    max_participants: integer().notNull(),
    fee: integer().notNull(),
    ...timestamps,
  },
  (table) => [
    pgPolicy("edit-game-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("delete-game-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("select-game-policy", {
      for: "select",
      to: "public",
      as: "permissive",
      using: sql`true`,
    }),
    pgPolicy("insert-game-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);

export const participantStatusEnum = pgEnum("participant_status", [
  "대기",
  "입금 요청",
  "입금 완료",
  "참가 확정",
]);

export const gameParticipants = pgTable(
  "game_participants",
  {
    participant_id: serial().primaryKey(),
    game_id: bigint({ mode: "number" })
      .references(() => games.game_id, {
        onDelete: "cascade",
      })
      .notNull(),
    profile_id: uuid()
      .references(() => profiles.profile_id, {
        onDelete: "cascade",
      })
      .notNull(),
    status: participantStatusEnum().default("대기").notNull(),
    ...timestamps,
  },
  (table) => ({
    insertPolicy: pgPolicy("participants_insert_policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    selectPolicy: pgPolicy("participants_select_policy", {
      for: "select",
      to: authenticatedRole,
      using: sql`
    ${authUid} = ${table.profile_id} OR
    EXISTS (
      SELECT 1 FROM public.games games 
      WHERE games.game_id = ${table.game_id} 
      AND games.profile_id = ${authUid}
    )
  `,
    }),
    updatePolicy: pgPolicy("participants_update_policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`
    ${authUid} = ${table.profile_id} OR
    EXISTS (
      SELECT 1 FROM public.games games 
      WHERE games.game_id = ${table.game_id} 
      AND games.profile_id = ${authUid}
    )
  `,
      using: sql`
    ${authUid} = ${table.profile_id} OR
    EXISTS (
      SELECT 1 FROM public.games games 
      WHERE games.game_id = ${table.game_id} 
      AND games.profile_id = ${authUid}
    )
  `,
    }),
    deletePolicy: pgPolicy("participants_delete_policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
  }),
);
