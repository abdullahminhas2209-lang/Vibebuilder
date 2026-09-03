-- ==============================================================================
-- VibeBuilder Supabase Database Schema
-- Production ready schema for AI Website Builder
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Projects Table
create table if not exists public.projects (
  id text primary key,
  name text not null,
  description text default '',
  type text default 'Web Application',
  status text check (status in ('draft', 'active', 'updated')) default 'draft',
  preview_config jsonb default '{}'::jsonb,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Project Files Table
create table if not exists public.project_files (
  id uuid default uuid_generate_v4() primary key,
  project_id text references public.projects(id) on delete cascade not null,
  path text not null,
  name text not null,
  language text default 'tsx',
  code text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(project_id, path)
);

-- 3. Chat Messages Table
create table if not exists public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  project_id text references public.projects(id) on delete cascade not null,
  role text check (role in ('user', 'assistant', 'system')) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indices for rapid querying
create index if not exists idx_projects_user on public.projects(user_id);
create index if not exists idx_project_files_project on public.project_files(project_id);
create index if not exists idx_chat_messages_project on public.chat_messages(project_id, created_at);

-- Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.project_files enable row level security;
alter table public.chat_messages enable row level security;

-- Public read / write policies (supports both authenticated users and anonymous sessions)
create policy "Allow all access to projects" on public.projects
  for all using (true) with check (true);

create policy "Allow all access to project_files" on public.project_files
  for all using (true) with check (true);

create policy "Allow all access to chat_messages" on public.chat_messages
  for all using (true) with check (true);
