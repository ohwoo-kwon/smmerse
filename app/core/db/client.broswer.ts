import { createBrowserClient } from "@supabase/ssr";
import { type Database } from "database.types";

export const browserClient = createBrowserClient<Database>(
  "https://wujxmuluphdazgapgwrr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1anhtdWx1cGhkYXpnYXBnd3JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NzA1NDMsImV4cCI6MjA2NjI0NjU0M30.G9isChxjjAgbqq4QDSvlyuI3KwFyYrclaaMZi09U3RI",
);
