CREATE TABLE "chat_room_members" (
	"chat_room_id" bigint,
	"profile_id" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_room_members_chat_room_id_profile_id_pk" PRIMARY KEY("chat_room_id","profile_id")
);
--> statement-breakpoint
ALTER TABLE "chat_room_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "chat_rooms" (
	"chat_room_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "chat_rooms_chat_room_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_rooms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "chats" (
	"chat_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "chats_chat_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"chat_room_id" bigint NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chats" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "chat_room_members" ADD CONSTRAINT "chat_room_members_chat_room_id_chat_rooms_chat_room_id_fk" FOREIGN KEY ("chat_room_id") REFERENCES "public"."chat_rooms"("chat_room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_room_members" ADD CONSTRAINT "chat_room_members_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_chat_room_id_chat_rooms_chat_room_id_fk" FOREIGN KEY ("chat_room_id") REFERENCES "public"."chat_rooms"("chat_room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_sender_id_profiles_profile_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "edit-chat-room-member-policy" ON "chat_room_members" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "chat_room_members"."profile_id") WITH CHECK ((select auth.uid()) = "chat_room_members"."profile_id");--> statement-breakpoint
CREATE POLICY "insert-chat-room-member-policy" ON "chat_room_members" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "delete-chat-room-member-policy" ON "chat_room_members" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "chat_room_members"."profile_id");--> statement-breakpoint
CREATE POLICY "select-chat-room-member-policy" ON "chat_room_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "insert-chat-room-member-policy" ON "chat_rooms" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "delete-chat-room-member-policy" ON "chat_rooms" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (SELECT 1 FROM public.chat_room_members AS sub WHERE sub.chat_room_id = "chat_rooms"."chat_room_id" AND sub.profile_id = (select auth.uid())));--> statement-breakpoint
CREATE POLICY "select-chat-room-member-policy" ON "chat_rooms" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
    EXISTS (
      SELECT 1 FROM public.chat_room_members AS sub WHERE sub.chat_room_id = "chat_rooms"."chat_room_id" AND sub.profile_id = (select auth.uid())
    )
  );--> statement-breakpoint
CREATE POLICY "edit-chat-room-member-policy" ON "chats" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "chats"."sender_id") WITH CHECK ((select auth.uid()) = "chats"."sender_id");--> statement-breakpoint
CREATE POLICY "insert-chat-room-member-policy" ON "chats" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "chats"."sender_id");--> statement-breakpoint
CREATE POLICY "delete-chat-room-member-policy" ON "chats" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "chats"."sender_id");--> statement-breakpoint
CREATE POLICY "select-chat-room-member-policy" ON "chats" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "chats"."sender_id");