ALTER POLICY "select-chats-policy" ON "chats" TO authenticated USING (EXISTS (
      SELECT 1
      FROM public.chat_room_members
      WHERE chat_room_members.chat_room_id = "chats"."chat_room_id"
      AND chat_room_members.profile_id = (select auth.uid())
    ));