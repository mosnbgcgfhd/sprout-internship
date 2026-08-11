-- Run this in the Supabase SQL editor once, on a fresh project.

create extension if not exists "uuid-ossp";

-- Internship listings pulled in by scripts/fetch-listings.mjs
create table if not exists listings (
  id uuid primary key default uuid_generate_v4(),
  source text not null,              -- 'adzuna' | 'greenhouse' | 'lever'
  source_id text not null,           -- id from the upstream API, for dedup
  title text not null,
  company text not null,
  location text,
  remote boolean default false,
  description text,
  apply_url text not null,
  category text,                     -- e.g. 'engineering', 'marketing'
  stipend text,                      -- free-form, upstream data is inconsistent
  posted_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now(),
  unique (source, source_id)
);

create index if not exists listings_posted_at_idx on listings (posted_at desc);
create index if not exists listings_company_idx on listings (company);

-- One row per student-saved application
create table if not exists saved_applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users (id) on delete cascade not null,
  listing_id uuid references listings (id) on delete cascade not null,
  status text not null default 'saved', -- saved | applied | interview | offer | rejected
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, listing_id)
);

alter table listings enable row level security;
alter table saved_applications enable row level security;

-- Listings are public read-only data; only the service role (used by the
-- fetch script) can write.
create policy "listings are publicly readable"
  on listings for select
  using (true);

-- Students can only see and manage their own saved applications.
create policy "users manage their own saved applications"
  on saved_applications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
