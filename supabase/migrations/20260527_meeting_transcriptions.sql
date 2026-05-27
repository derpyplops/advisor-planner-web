create table if not exists meeting_transcriptions (
  id serial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  client_name text,
  transcript text not null,
  analysis jsonb,
  created_at timestamptz default now() not null
);

alter table meeting_transcriptions enable row level security;

drop policy if exists "Users can manage their own transcriptions" on meeting_transcriptions;
create policy "Users can manage their own transcriptions" on meeting_transcriptions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
