CREATE TYPE "public"."participant_status" AS ENUM('대기', '입금 요청', '입금 완료', '참가 확정');--> statement-breakpoint
CREATE TABLE "game_participants" (
	"participant_id" serial PRIMARY KEY NOT NULL,
	"game_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	"status" "participant_status" DEFAULT '대기' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "game_participants" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "game_participants" ADD CONSTRAINT "game_participants_game_id_games_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("game_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_participants" ADD CONSTRAINT "game_participants_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "participants_insert_policy" ON "game_participants" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "game_participants"."profile_id");--> statement-breakpoint
CREATE POLICY "participants_select_policy" ON "game_participants" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
    (select auth.uid()) = "game_participants"."profile_id" OR
    EXISTS (
      SELECT 1 FROM public.games games 
      WHERE games.game_id = "game_participants"."game_id" 
      AND games.profile_id = (select auth.uid())
    )
  );--> statement-breakpoint
CREATE POLICY "participants_update_policy" ON "game_participants" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (
    (select auth.uid()) = "game_participants"."profile_id" OR
    EXISTS (
      SELECT 1 FROM public.games games 
      WHERE games.game_id = "game_participants"."game_id" 
      AND games.profile_id = (select auth.uid())
    )
  ) WITH CHECK (
    (select auth.uid()) = "game_participants"."profile_id" OR
    EXISTS (
      SELECT 1 FROM public.games games 
      WHERE games.game_id = "game_participants"."game_id" 
      AND games.profile_id = (select auth.uid())
    )
  );--> statement-breakpoint
CREATE POLICY "participants_delete_policy" ON "game_participants" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "game_participants"."profile_id");

CREATE TRIGGER set_game_participants_updated_at
BEFORE UPDATE ON public.game_participants
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();