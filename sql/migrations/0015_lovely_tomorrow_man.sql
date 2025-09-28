CREATE TABLE "gym_photos" (
	"gym_photo_id" serial PRIMARY KEY NOT NULL,
	"gym_id" uuid NOT NULL,
	"url" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gym_photos" ADD CONSTRAINT "gym_photos_gym_id_gyms_gym_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gyms"("gym_id") ON DELETE cascade ON UPDATE no action;