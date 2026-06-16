-- Run this in Supabase Dashboard → SQL Editor

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  phone text,
  otp text,
  selected_app text default 'flipkart',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists registrations_session_id_idx on public.registrations (session_id);
create index if not exists registrations_created_at_idx on public.registrations (created_at desc);

alter table public.registrations enable row level security;

create policy "anon can insert registrations"
  on public.registrations for insert
  to anon
  with check (true);

create policy "anon can update registrations"
  on public.registrations for update
  to anon
  using (true)
  with check (true);

create policy "anon can select registrations"
  on public.registrations for select
  to anon
  using (true);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists registrations_updated_at on public.registrations;
create trigger registrations_updated_at
  before update on public.registrations
  for each row execute function public.set_updated_at();
