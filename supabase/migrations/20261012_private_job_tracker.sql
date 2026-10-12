-- Andrea portfolio / private job application tracker
-- Prepared migration only. Apply to a NEW personal Supabase project, NEVER to Hope Club.
-- Owner-only: every row belongs to auth.uid(); no anonymous access.

create extension if not exists pgcrypto;

create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company text not null check (char_length(trim(company)) between 1 and 160),
  role_title text not null check (char_length(trim(role_title)) between 1 and 180),
  location text check (char_length(location) <= 160),
  work_mode text check (work_mode in ('onsite','hybrid','remote')),
  source text check (char_length(source) <= 120),
  job_url text check (char_length(job_url) <= 2048),
  status text not null default 'applied' check (status in ('wishlist','applied','screening','interview','assessment','offer','rejected','withdrawn','accepted')),
  applied_on date,
  next_action_on date,
  salary_min integer check (salary_min >= 0),
  salary_max integer check (salary_max >= 0),
  currency text not null default 'EUR' check (char_length(currency) = 3),
  cv_language text check (cv_language in ('it','en','other')),
  notes text check (char_length(notes) <= 20000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_salary_range check (salary_min is null or salary_max is null or salary_min <= salary_max),
  unique (id, owner_id)
);

create table public.application_activities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  application_id uuid not null,
  kind text not null check (kind in ('note','email','call','interview','assessment','follow_up','status_change','other')),
  title text not null check (char_length(trim(title)) between 1 and 200),
  details text check (char_length(details) <= 20000),
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  foreign key (application_id, owner_id) references public.job_applications(id, owner_id) on delete cascade
);

create index job_applications_owner_date_idx on public.job_applications(owner_id, applied_on desc);
create index job_applications_owner_status_idx on public.job_applications(owner_id, status);
create index application_activities_owner_application_idx on public.application_activities(owner_id, application_id, occurred_at desc);

create or replace function public.set_job_application_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger job_application_updated_at
before update on public.job_applications
for each row execute function public.set_job_application_updated_at();

alter table public.job_applications enable row level security;
alter table public.application_activities enable row level security;

revoke all on public.job_applications from anon;
revoke all on public.application_activities from anon;
grant select, insert, update, delete on public.job_applications to authenticated;
grant select, insert, update, delete on public.application_activities to authenticated;

create policy "owner_select_applications" on public.job_applications for select to authenticated using (owner_id = (select auth.uid()));
create policy "owner_insert_applications" on public.job_applications for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "owner_update_applications" on public.job_applications for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "owner_delete_applications" on public.job_applications for delete to authenticated using (owner_id = (select auth.uid()));

create policy "owner_select_activities" on public.application_activities for select to authenticated using (owner_id = (select auth.uid()));
create policy "owner_insert_activities" on public.application_activities for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "owner_update_activities" on public.application_activities for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "owner_delete_activities" on public.application_activities for delete to authenticated using (owner_id = (select auth.uid()));
