create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "Admins can read admin allowlist"
on public.admin_users
for select
to authenticated
using (true);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (category in ('notes', 'syllabus', 'events', 'circulars', 'achievements')),
  semester text check (semester in ('Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6')),
  file_path text not null unique,
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "Public can read documents"
on public.documents
for select
to anon, authenticated
using (true);

create policy "Only listed admin can insert documents"
on public.documents
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.email = auth.email()
  )
);

create policy "Only listed admin can delete documents"
on public.documents
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.email = auth.email()
  )
);

insert into storage.buckets (id, name, public)
values ('department-files', 'department-files', true)
on conflict (id) do nothing;

create policy "Public can read files"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'department-files');

create policy "Admin can upload files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'department-files'
  and exists (
    select 1
    from public.admin_users
    where admin_users.email = auth.email()
  )
);

create policy "Admin can delete files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'department-files'
  and exists (
    select 1
    from public.admin_users
    where admin_users.email = auth.email()
  )
);
