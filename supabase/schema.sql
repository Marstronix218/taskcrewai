create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  user_id text primary key,
  username text not null,
  email text not null,
  plan text not null check (plan in ('Free', 'Premium')),
  total_xp integer not null default 0,
  streak_count integer not null default 0,
  message_count jsonb not null default '{}'::jsonb,
  crew jsonb not null default '[]'::jsonb,
  bond_levels jsonb not null default '{}'::jsonb,
  chat_history jsonb not null default '{}'::jsonb,
  tasks jsonb not null default '[]'::jsonb,
  last_task_check text not null,
  last_login text,
  last_checkin_time bigint,
  custom_character jsonb,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.set_user_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists trg_user_profiles_updated_at on public.user_profiles;
create trigger trg_user_profiles_updated_at
before update on public.user_profiles
for each row
execute function public.set_user_profiles_updated_at();

alter table public.user_profiles enable row level security;

drop policy if exists "anon can manage own user_id profile" on public.user_profiles;
create policy "anon can manage own user_id profile"
on public.user_profiles
for all
using (true)
with check (true);
