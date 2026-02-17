create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  creator_type text not null check (creator_type in ('travel_creator', 'agency', 'traveler')),
  use_case text not null,
  source_page text not null check (source_page in ('home', 'plans', 'download', 'studio', 'hub')),
  consent boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_signups_email_idx
  on public.waitlist_signups (lower(email));

create table if not exists public.route_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  map_style_id text not null,
  vehicle_model_id text not null,
  points_json jsonb not null,
  playback_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists route_projects_user_idx on public.route_projects (user_id, updated_at desc);

alter table public.waitlist_signups enable row level security;
alter table public.route_projects enable row level security;
alter table public.profiles enable row level security;

create policy if not exists "Route projects are viewable by owner"
on public.route_projects
for select using (auth.uid() = user_id);

create policy if not exists "Route projects are insertable by owner"
on public.route_projects
for insert with check (auth.uid() = user_id);

create policy if not exists "Route projects are updatable by owner"
on public.route_projects
for update using (auth.uid() = user_id);

create policy if not exists "Route projects are deletable by owner"
on public.route_projects
for delete using (auth.uid() = user_id);

create policy if not exists "Profiles are viewable by owner"
on public.profiles
for select using (auth.uid() = id);

create policy if not exists "Profiles are updatable by owner"
on public.profiles
for update using (auth.uid() = id);
