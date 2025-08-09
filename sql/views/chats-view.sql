create or replace view chats_view as
select
  m1.chat_room_id,
  p.name,
  (
    select
      content
    from
      public.chats c
    where
      c.chat_room_id = m1.chat_room_id
    order by
      chat_id desc
    limit
      1
  ) as last_message,
  (
    select
      pp.name
    from
      public.chats c
    left join public.profiles pp on c.sender_id = pp.profile_id
    where
      c.chat_room_id = m1.chat_room_id
    order by
      chat_id desc
    limit
      1
  ) as last_sender_name,
  (
    select
      c."createdAt"
    from
      public.chats c
    where
      c.chat_room_id = m1.chat_room_id
    order by
      chat_id desc
    limit
      1
  ) as last_message_time,
  m1.profile_id,
  m2.profile_id as other_profile_id,
  p.avatar_url
from
  public.chat_room_members m1
  inner join public.chat_room_members m2 on m1.chat_room_id = m2.chat_room_id
  inner join public.profiles p on p.profile_id = m2.profile_id;