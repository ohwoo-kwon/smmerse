ALTER TABLE "chat_room_members" ALTER COLUMN "chat_room_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_room_members" ALTER COLUMN "profile_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "is_checked" boolean DEFAULT false NOT NULL;