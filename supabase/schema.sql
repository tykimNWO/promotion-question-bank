create extension if not exists "pgcrypto";

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  subject text not null default '수신',
  chapter text not null,
  question_type text not null default 'multiple_choice'
    check (question_type in ('multiple_choice', 'ox')),
  question_text text not null,
  option_1 text not null,
  option_2 text not null,
  option_3 text not null,
  option_4 text not null,
  answer integer not null check (answer between 1 and 4),
  explanation text not null default '',
  is_wrong boolean not null default false,
  importance integer not null default 3 check (importance between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint questions_ox_shape_check check (
    question_type <> 'ox'
    or (
      option_1 = 'O'
      and option_2 = 'X'
      and option_3 = ''
      and option_4 = ''
      and answer between 1 and 2
    )
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists questions_set_updated_at on public.questions;
create trigger questions_set_updated_at
before update on public.questions
for each row
execute function public.set_updated_at();

create index if not exists questions_chapter_idx on public.questions (chapter);
create index if not exists questions_subject_chapter_idx on public.questions (subject, chapter);
create index if not exists questions_question_type_idx on public.questions (question_type);
create index if not exists questions_is_wrong_idx on public.questions (is_wrong);
create index if not exists questions_importance_idx on public.questions (importance);
create index if not exists questions_created_at_idx on public.questions (created_at desc);

-- Personal MVP policy:
-- This app performs DB work on the Next.js server using SUPABASE_ANON_KEY.
-- If you enable RLS, keep this broad policy only while APP_ACCESS_CODE protects the app.
alter table public.questions enable row level security;

drop policy if exists "personal question bank access" on public.questions;
create policy "personal question bank access"
on public.questions
for all
to anon
using (true)
with check (true);
