create table if not exists leads (
  id serial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  age integer,
  family_info text,
  client_request text,
  transcription_id integer references meeting_transcriptions(id) on delete set null,
  created_at timestamptz default now() not null
);

alter table leads enable row level security;

drop policy if exists "Users can manage their own leads" on leads;
create policy "Users can manage their own leads" on leads
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
