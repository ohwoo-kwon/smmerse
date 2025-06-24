CREATE TYPE "public"."basketball_skill_level" AS ENUM('level_0', 'level_1', 'level_2', 'level_3', 'level_4', 'level_5');--> statement-breakpoint
CREATE TABLE "basketball_games" (
	"basketball_game_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "basketball_games_basketball_game_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"skill_level" "basketball_skill_level",
	"max_participants" integer NOT NULL,
	"fee" integer NOT NULL,
	"sido" varchar(50) NOT NULL,
	"city" varchar(50) NOT NULL,
	"address" varchar(255) NOT NULL,
	"link" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "basketball_games" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "basketball_games" ADD CONSTRAINT "basketball_games_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "edit-game-policy" ON "basketball_games" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "basketball_games"."profile_id") WITH CHECK ((select auth.uid()) = "basketball_games"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-game-policy" ON "basketball_games" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "basketball_games"."profile_id");--> statement-breakpoint
CREATE POLICY "select-game-policy" ON "basketball_games" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "insert-game-policy" ON "basketball_games" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "basketball_games"."profile_id");

CREATE TRIGGER set_basketball_games_updated_at
BEFORE UPDATE ON public.basketball_games
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();