CREATE TYPE "public"."game_time_type" AS ENUM('1시간', '1시간 30분', '2시간', '2시간 30분', '3시간 이상');--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "game_gender_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."game_gender_type";--> statement-breakpoint
CREATE TYPE "public"."game_gender_type" AS ENUM('상관없음', '남자', '여자');--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "game_gender_type" SET DATA TYPE "public"."game_gender_type" USING "game_gender_type"::"public"."game_gender_type";--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "game_time" "game_time_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "end_date";--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "end_time";