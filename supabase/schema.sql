-- 在 Supabase SQL Editor 中执行一次即可

create table if not exists public.users (
  id text primary key,
  username text not null unique,
  hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.plans (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists plans_user_id_idx on public.plans (user_id);

alter table public.users enable row level security;
alter table public.plans enable row level security;
