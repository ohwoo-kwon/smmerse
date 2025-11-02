/**
 * Authentication Database Queries
 *
 * This file contains server-side database queries related to user authentication.
 * It provides utility functions to check user existence and other auth-related operations.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import { count, eq } from "drizzle-orm";
import { authUsers } from "drizzle-orm/supabase";

import db from "~/core/db/drizzle-client.server";

export async function doesUserExist(email: string) {
  const totalUsers = await db
    .select({
      count: count(),
    })
    .from(authUsers)
    .where(eq(authUsers.email, email));

  return totalUsers[0].count > 0;
}

export async function isUserInfoExist(
  client: SupabaseClient<Database>,
  profileId: string,
) {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("profile_id", profileId)
    .single();

  if (error) throw new Error(error.message);

  if (!data.birth || !data.height || !data.position || !data.sex) return false;
  return true;
}
