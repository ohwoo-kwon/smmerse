DROP SEQUENCE IF EXISTS game_participants_participant_id_seq CASCADE;

CREATE TYPE "public"."notification_type" AS ENUM('GAME_JOIN_REQUEST', 'CHAT_MESSAGE', 'PARTICIPATION_STATUS');--> statement-breakpoint
CREATE TABLE "notifications" (
	"notification_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_profile_id" uuid NOT NULL,
	"recipient_profile_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"game_id" bigint,
	"chat_room_id" bigint,
	"participant_id" bigint,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "game_participants" ALTER COLUMN "participant_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "game_participants" ALTER COLUMN "participant_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "game_participants_participant_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sender_profile_id_profiles_profile_id_fk" FOREIGN KEY ("sender_profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_profile_id_profiles_profile_id_fk" FOREIGN KEY ("recipient_profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_game_id_games_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("game_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_chat_room_id_chat_rooms_chat_room_id_fk" FOREIGN KEY ("chat_room_id") REFERENCES "public"."chat_rooms"("chat_room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_participant_id_game_participants_participant_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."game_participants"("participant_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "select-notification-policy" ON "notifications" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "notifications"."recipient_profile_id");--> statement-breakpoint
CREATE POLICY "insert-notification-policy" ON "notifications" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "notifications"."sender_profile_id");--> statement-breakpoint
CREATE POLICY "update-notification-policy" ON "notifications" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "notifications"."recipient_profile_id") WITH CHECK ((select auth.uid()) = "notifications"."recipient_profile_id");--> statement-breakpoint
CREATE POLICY "delete-notification-policy" ON "notifications" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "notifications"."recipient_profile_id");

CREATE TRIGGER set_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();