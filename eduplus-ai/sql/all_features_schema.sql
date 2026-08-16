-- ============================================================
-- RUN THIS ENTIRE FILE ONCE IN SUPABASE SQL EDITOR
-- Creates tables for: certifications, github, tracksheet,
-- linkedin checklist, plagiarism submissions
-- (contests + leaderboard need no new tables)
-- ============================================================

create table if not exists certifications (
  id uuid default gen_random_uuid() primary key,
  student_id text not null,
  title text not null,
  provider text not null,
  completion_date date,
  certificate_url text,
  created_at timestamp default now()
);

create table if not exists github_profiles (
  student_id text primary key,
  github_username text not null,
  public_repos int default 0,
  followers int default 0,
  last_synced timestamp default now()
);

create table if not exists tracksheet_entries (
  id uuid default gen_random_uuid() primary key,
  student_id text not null,
  task_name text not null,
  status text default 'pending',
  updated_at timestamp default now()
);

create table if not exists linkedin_checklist (
  student_id text primary key,
  has_photo boolean default false,
  has_summary boolean default false,
  has_experience boolean default false,
  has_skills boolean default false,
  profile_url text,
  updated_at timestamp default now()
);

create table if not exists submissions (
  id uuid default gen_random_uuid() primary key,
  student_id text not null,
  assignment_id text not null,
  content text not null,
  created_at timestamp default now()
);

-- Enable RLS (matches pattern used for attendance tables)
alter table certifications enable row level security;
alter table github_profiles enable row level security;
alter table tracksheet_entries enable row level security;
alter table linkedin_checklist enable row level security;
alter table submissions enable row level security;

-- Permissive policies for hackathon speed (service role bypasses RLS anyway,
-- these just prevent errors if anon key is ever used)
create policy "allow all certifications" on certifications for all using (true) with check (true);
create policy "allow all github_profiles" on github_profiles for all using (true) with check (true);
create policy "allow all tracksheet_entries" on tracksheet_entries for all using (true) with check (true);
create policy "allow all linkedin_checklist" on linkedin_checklist for all using (true) with check (true);
create policy "allow all submissions" on submissions for all using (true) with check (true);
