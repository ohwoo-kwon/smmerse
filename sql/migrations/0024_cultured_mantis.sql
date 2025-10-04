DROP POLICY "participants_insert_policy" ON "basketball_game_participants" CASCADE;--> statement-breakpoint
DROP POLICY "participants_select_policy" ON "basketball_game_participants" CASCADE;--> statement-breakpoint
DROP POLICY "participants_update_policy" ON "basketball_game_participants" CASCADE;--> statement-breakpoint
DROP POLICY "participants_delete_policy" ON "basketball_game_participants" CASCADE;--> statement-breakpoint
DROP TABLE "basketball_game_participants" CASCADE;--> statement-breakpoint
DROP POLICY "edit-game-policy" ON "basketball_games" CASCADE;--> statement-breakpoint
DROP POLICY "delete-game-policy" ON "basketball_games" CASCADE;--> statement-breakpoint
DROP POLICY "select-game-policy" ON "basketball_games" CASCADE;--> statement-breakpoint
DROP POLICY "insert-game-policy" ON "basketball_games" CASCADE;--> statement-breakpoint
DROP TABLE "basketball_games" CASCADE;--> statement-breakpoint
DROP TYPE "public"."basketball_skill_level";--> statement-breakpoint
DROP TYPE "public"."gender_type";