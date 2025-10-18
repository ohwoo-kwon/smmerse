create view public.chats_view with (security_invoker = on) as
select
  m1.chat_room_id,
  p.name,
  (
    select
      c.content
    from
      chats c
    where
      c.chat_room_id = m1.chat_room_id
    order by
      c.chat_id desc
    limit
      1
  ) as last_message,
  (
    select
      pp.name
    from
      chats c
      left join profiles pp on c.sender_id = pp.profile_id
    where
      c.chat_room_id = m1.chat_room_id
    order by
      c.chat_id desc
    limit
      1
  ) as last_sender_name,
  (
    select
      c."createdAt"
    from
      chats c
    where
      c.chat_room_id = m1.chat_room_id
    order by
      c.chat_id desc
    limit
      1
  ) as last_message_time,
  (
    select
      COUNT(chat_id)
    from
      public.chats c
    where
      c.chat_room_id = m1.chat_room_id
      and c.is_checked is false
      and c.sender_id = m2.profile_id
  ) as un_checked_count,
  m1.profile_id,
  m2.profile_id as other_profile_id,
  p.avatar_url
from
  chat_room_members m1
  join chat_room_members m2 on m1.chat_room_id = m2.chat_room_id
  join profiles p on p.profile_id = m2.profile_id;