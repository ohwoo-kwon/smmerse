import { sql } from "drizzle-orm";
import {
  bigint,
  pgPolicy,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUid, authUsers, authenticatedRole } from "drizzle-orm/supabase";

import { timestamps } from "~/core/db/timestamp";

export const profiles = pgTable(
  "profiles",
  {
    profile_id: uuid()
      .primaryKey()
      .references(() => authUsers.id, {
        onDelete: "cascade",
      }),
    name: text().notNull(),
    avatar_url: text(),
    ...timestamps,
  },
  (table) => [
    pgPolicy("edit-profile-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("delete-profile-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("select-profile-policy", {
      for: "select",
      to: "public",
      as: "permissive",
      using: sql`true`,
    }),
  ],
);

export const chatRooms = pgTable(
  "chat_rooms",
  {
    chat_room_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("insert-chat-room-member-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`true`,
    }),
    pgPolicy("delete-chat-room-member-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`EXISTS (SELECT 1 FROM public.chat_room_members AS sub WHERE sub.chat_room_id = ${table.chat_room_id} AND sub.profile_id = ${authUid})`,
    }),
    pgPolicy("select-chat-room-member-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`true`,
    }),
  ],
);

export const chatRoomMembers = pgTable(
  "chat_room_members",
  {
    chat_room_id: bigint({ mode: "number" }).references(
      () => chatRooms.chat_room_id,
      { onDelete: "cascade" },
    ),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.chat_room_id, table.profile_id] }),
    pgPolicy("edit-chat-room-member-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("insert-chat-room-member-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`true`,
    }),
    pgPolicy("delete-chat-room-member-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("select-chat-room-member-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`true`,
    }),
  ],
);

export const chats = pgTable(
  "chats",
  {
    chat_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    chat_room_id: bigint({ mode: "number" })
      .references(() => chatRooms.chat_room_id, { onDelete: "cascade" })
      .notNull(),
    sender_id: uuid()
      .references(() => profiles.profile_id, {
        onDelete: "cascade",
      })
      .notNull(),
    content: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("edit-chats-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.sender_id}`,
      using: sql`${authUid} = ${table.sender_id}`,
    }),
    pgPolicy("insert-chats-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.sender_id}`,
    }),
    pgPolicy("delete-chats-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.sender_id}`,
    }),
    pgPolicy("select-chats-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`EXISTS (
      SELECT 1
      FROM public.chat_room_members
      WHERE chat_room_members.chat_room_id = ${table.chat_room_id}
      AND chat_room_members.profile_id = ${authUid}
    )`,
    }),
  ],
);
