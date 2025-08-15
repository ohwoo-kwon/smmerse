CREATE TABLE "basketball_game_participants" (
	"participant_id" serial PRIMARY KEY NOT NULL,
	"basketball_game_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "basketball_game_participants_basketball_game_id_profile_id_unique" UNIQUE("basketball_game_id","profile_id")
);
--> statement-breakpoint
ALTER TABLE "basketball_game_participants" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "basketball_game_participants" ADD CONSTRAINT "basketball_game_participants_basketball_game_id_basketball_games_basketball_game_id_fk" FOREIGN KEY ("basketball_game_id") REFERENCES "public"."basketball_games"("basketball_game_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "basketball_game_participants" ADD CONSTRAINT "basketball_game_participants_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "participants_insert_policy" ON "basketball_game_participants" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (profile_id = auth.uid());--> statement-breakpoint
CREATE POLICY "participants_select_policy" ON "basketball_game_participants" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
    profile_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.basketball_games bg 
      WHERE bg.basketball_game_id = public.basketball_game_participants.basketball_game_id 
      AND bg.profile_id = auth.uid()
    )
  );--> statement-breakpoint
CREATE POLICY "participants_update_policy" ON "basketball_game_participants" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (
    profile_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.basketball_games bg 
      WHERE bg.basketball_game_id = public.basketball_game_participants.basketball_game_id 
      AND bg.profile_id = auth.uid()
    )
  ) WITH CHECK (
    profile_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.basketball_games bg 
      WHERE bg.basketball_game_id = public.basketball_game_participants.basketball_game_id 
      AND bg.profile_id = auth.uid()
    )
  );--> statement-breakpoint
CREATE POLICY "participants_delete_policy" ON "basketball_game_participants" AS PERMISSIVE FOR DELETE TO "authenticated" USING (profile_id = auth.uid());

CREATE TRIGGER set_participants_updated_at
BEFORE UPDATE ON public.basketball_game_participants
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();