create view public.chats_view with (security_invoker = on) as
 SELECT m1.chat_room_id,
    p.name,
    ( SELECT c.content
           FROM chats c
          WHERE c.chat_room_id = m1.chat_room_id
          ORDER BY c.chat_id DESC
         LIMIT 1) AS last_message,
    ( SELECT pp.name
           FROM chats c
             LEFT JOIN profiles pp ON c.sender_id = pp.profile_id
          WHERE c.chat_room_id = m1.chat_room_id
          ORDER BY c.chat_id DESC
         LIMIT 1) AS last_sender_name,
    ( SELECT c."createdAt"
           FROM chats c
          WHERE c.chat_room_id = m1.chat_room_id
          ORDER BY c.chat_id DESC
         LIMIT 1) AS last_message_time,
    m1.profile_id,
    m2.profile_id AS other_profile_id,
    p.avatar_url
   FROM chat_room_members m1
     JOIN chat_room_members m2 ON m1.chat_room_id = m2.chat_room_id
     JOIN profiles p ON p.profile_id = m2.profile_id;