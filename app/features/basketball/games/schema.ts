import { sql } from "drizzle-orm";
import {
  bigint,
  date,
  integer,
  pgEnum,
  pgPolicy,
  pgTable,
  text,
  time,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { authUid, authenticatedRole } from "drizzle-orm/supabase";

import { timestamps } from "~/core/db/timestamp";
import { profiles } from "~/features/users/schema";

export const basketballSkillLevelEnum = pgEnum("basketball_skill_level", [
  "level_0",
  "level_1",
  "level_2",
  "level_3",
  "level_4",
  "level_5",
]);

export const genderTypeEnum = pgEnum("gender_type", [
  "male",
  "female",
  "mixed",
]);

export const basketballGames = pgTable(
  "basketball_games",
  {
    baskteballGameId: bigint("basketball_game_id", { mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    profileId: uuid("profile_id").references(() => profiles.profile_id),
    title: text().notNull(),
    description: text(),
    date: date().notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    skillLevel: basketballSkillLevelEnum("skill_level").notNull(),
    minParticipants: integer("min_participants").default(0).notNull(),
    maxParticipants: integer("max_participants").notNull(),
    currentParticipants: integer("current_participants").default(0).notNull(),
    fee: integer().notNull(),
    sido: varchar({ length: 50 }).notNull(),
    city: varchar({ length: 50 }).notNull(),
    address: varchar({ length: 255 }).notNull(),
    genderType: genderTypeEnum("gender_type").notNull().default("mixed"),
    link: text(),
    ...timestamps,
  },
  (table) => [
    pgPolicy("edit-game-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profileId}`,
      using: sql`${authUid} = ${table.profileId}`,
    }),
    pgPolicy("delete-game-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profileId}`,
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
      withCheck: sql`${authUid} = ${table.profileId}`,
    }),
  ],
);
