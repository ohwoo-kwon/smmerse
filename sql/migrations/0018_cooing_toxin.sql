CREATE TYPE "public"."game_gender_type" AS ENUM('남자만', '여자만', '혼성');--> statement-breakpoint
CREATE TYPE "public"."game_type" AS ENUM('1on1', '3on3', '5on5', '기타');--> statement-breakpoint
CREATE TABLE "games" (
	"game_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "games_game_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid,
	"gym_id" uuid,
	"game_type" "game_type" NOT NULL,
	"game_gender_type" "game_gender_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_date" date NOT NULL,
	"end_time" time NOT NULL,
	"guard" boolean,
	"forward" boolean,
	"center" boolean,
	"min_participants" integer NOT NULL,
	"max_participants" integer NOT NULL,
	"fee" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "games" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_gym_id_gyms_gym_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gyms"("gym_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "edit-game-policy" ON "games" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "games"."profile_id") WITH CHECK ((select auth.uid()) = "games"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-game-policy" ON "games" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "games"."profile_id");--> statement-breakpoint
CREATE POLICY "select-game-policy" ON "games" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "insert-game-policy" ON "games" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "games"."profile_id");