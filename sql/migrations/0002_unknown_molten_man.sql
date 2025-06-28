CREATE TYPE "public"."gender_type" AS ENUM('male', 'female', 'mixed');--> statement-breakpoint
ALTER TABLE "basketball_games" ADD COLUMN "gender_type" "gender_type" DEFAULT 'mixed' NOT NULL;