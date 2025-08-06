ALTER POLICY "edit-chat-room-member-policy" ON "chats" RENAME TO "edit-chats-policy";--> statement-breakpoint
ALTER POLICY "insert-chat-room-member-policy" ON "chats" RENAME TO "insert-chats-policy";--> statement-breakpoint
ALTER POLICY "delete-chat-room-member-policy" ON "chats" RENAME TO "delete-chats-policy";--> statement-breakpoint
ALTER POLICY "select-chat-room-member-policy" ON "chats" RENAME TO "select-chats-policy";