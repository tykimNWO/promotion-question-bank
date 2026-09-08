-- Allow short-answer questions without modifying existing rows or columns.
-- option_1 stores the exact answer; answer remains 1 for short-answer rows.
begin;
alter table public.questions
  drop constraint if exists questions_question_type_check;
alter table public.questions
  add constraint questions_question_type_check
  check (question_type in ('multiple_choice', 'ox', 'short_answer'));
commit;
