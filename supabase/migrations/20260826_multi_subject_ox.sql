-- Existing database upgrade: preserve every row as 수신 / 객관식.
-- Before running, export public.questions and record:
-- select count(*) as question_count_before from public.questions;

begin;

alter table public.questions
  add column if not exists subject text;

update public.questions
set subject = '수신'
where subject is null or btrim(subject) = '';

alter table public.questions
  alter column subject set default '수신',
  alter column subject set not null;

alter table public.questions
  add column if not exists question_type text;

update public.questions
set question_type = 'multiple_choice'
where question_type is null or btrim(question_type) = '';

alter table public.questions
  alter column question_type set default 'multiple_choice',
  alter column question_type set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'questions_question_type_check'
      and conrelid = 'public.questions'::regclass
  ) then
    alter table public.questions
      add constraint questions_question_type_check
      check (question_type in ('multiple_choice', 'ox'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'questions_ox_shape_check'
      and conrelid = 'public.questions'::regclass
  ) then
    alter table public.questions
      add constraint questions_ox_shape_check
      check (
        question_type <> 'ox'
        or (
          option_1 = 'O'
          and option_2 = 'X'
          and option_3 = ''
          and option_4 = ''
          and answer between 1 and 2
        )
      );
  end if;
end
$$;

create index if not exists questions_subject_chapter_idx
  on public.questions (subject, chapter);
create index if not exists questions_question_type_idx
  on public.questions (question_type);

commit;

-- Verify after migration. The first count must match question_count_before.
select count(*) as question_count_after from public.questions;
select subject, question_type, count(*)
from public.questions
group by subject, question_type
order by subject, question_type;
