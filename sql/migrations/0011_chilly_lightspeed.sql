ALTER TABLE "basketball_game_participants" DROP CONSTRAINT "basketball_game_participants_basketball_game_id_basketball_games_basketball_game_id_fk";
--> statement-breakpoint
ALTER TABLE "basketball_game_participants" DROP CONSTRAINT "basketball_game_participants_profile_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "basketball_games" DROP CONSTRAINT "basketball_games_profile_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "basketball_game_participants" ADD CONSTRAINT "basketball_game_participants_basketball_game_id_basketball_games_basketball_game_id_fk" FOREIGN KEY ("basketball_game_id") REFERENCES "public"."basketball_games"("basketball_game_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "basketball_game_participants" ADD CONSTRAINT "basketball_game_participants_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "basketball_games" ADD CONSTRAINT "basketball_games_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;