import { sql } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgPolicy,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { authUid, authenticatedRole } from "drizzle-orm/supabase";

import { timestamps } from "~/core/db/timestamp";

export const cityEnum = pgEnum("city", [
  "서울",
  "경기",
  "인천",
  "강원",
  "부산",
  "대구",
  "광주",
  "대전",
  "세종",
  "울산",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
]);

export const gyms = pgTable(
  "gyms",
  {
    gym_id: uuid("gym_id").defaultRandom().primaryKey(),
    name: text().notNull(),
    description: text(),
    city: cityEnum().notNull(),
    district: text().notNull(),
    full_address: text().notNull(),
    has_water_dispenser: boolean().default(false).notNull(),
    has_heating_cooling: boolean().default(false).notNull(),
    has_shower: boolean().default(false).notNull(),
    parking_info: text(),
    usage_rules: text(),
    ...timestamps,
  },
  (table) => [
    pgPolicy("edit-gym-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} IN ('e421200d-88ca-4711-a667-b000290ef252'::uuid)`,
      using: sql`${authUid} IN ('e421200d-88ca-4711-a667-b000290ef252'::uuid)`,
    }),
    pgPolicy("delete-gym-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} IN ('e421200d-88ca-4711-a667-b000290ef252'::uuid)`,
    }),
    pgPolicy("select-gym-policy", {
      for: "select",
      to: "public",
      as: "permissive",
      using: sql`true`,
    }),
    pgPolicy("insert-gym-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} IN ('e421200d-88ca-4711-a667-b000290ef252'::uuid)`,
    }),
  ],
);

export const gymPhotos = pgTable(
  "gym_photos",
  {
    gym_photo_id: serial().primaryKey(),
    gym_id: uuid()
      .notNull()
      .references(() => gyms.gym_id, { onDelete: "cascade" }),
    url: varchar({ length: 500 }).notNull(),
    created_at: timestamp().defaultNow().notNull(),
  },
  (table) => [
    pgPolicy("edit-gym-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} IN ('e421200d-88ca-4711-a667-b000290ef252'::uuid)`,
      using: sql`${authUid} IN ('e421200d-88ca-4711-a667-b000290ef252'::uuid)`,
    }),
    pgPolicy("delete-gym-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} IN ('e421200d-88ca-4711-a667-b000290ef252'::uuid)`,
    }),
    pgPolicy("select-gym-policy", {
      for: "select",
      to: "public",
      as: "permissive",
      using: sql`true`,
    }),
    pgPolicy("insert-gym-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} IN ('e421200d-88ca-4711-a667-b000290ef252'::uuid)`,
    }),
  ],
);
