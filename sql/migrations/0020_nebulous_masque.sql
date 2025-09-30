ALTER TABLE "games" ALTER COLUMN "game_time" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."game_time_type";--> statement-breakpoint
CREATE TYPE "public"."game_time_type" AS ENUM('1시간', '1시간 30분', '2시간', '2시간 30분', '3시간', '3시간 30분 이상');--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "game_time" SET DATA TYPE "public"."game_time_type" USING "game_time"::"public"."game_time_type";