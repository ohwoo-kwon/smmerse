CREATE TYPE "public"."city" AS ENUM('서울', '경기', '인천', '강원', '부산', '대구', '광주', '대전', '세종', '울산', '충북', '충남', '전북', '전남', '경북', '경남', '제주');--> statement-breakpoint
CREATE TABLE "gyms" (
	"gym_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"city" "city" NOT NULL,
	"district" text NOT NULL,
	"full_address" text NOT NULL,
	"has_water_dispenser" boolean DEFAULT false NOT NULL,
	"has_heating_cooling" boolean DEFAULT false NOT NULL,
	"has_shower" boolean DEFAULT false NOT NULL,
	"parking_info" text,
	"usage_rules" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TRIGGER set_gyms_updated_at
BEFORE UPDATE ON public.gyms
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();