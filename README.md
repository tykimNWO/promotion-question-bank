# 승진시험 문제은행 MVP

개인 승진시험 공부용 문제은행입니다. PC에서는 문제를 등록/수정/삭제하고, 모바일에서는 URL로 접속해 PWA처럼 문제를 풉니다.

## 1. 전체 프로젝트 구조

```txt
promotion-question-bank/
  app/
    page.tsx                  # 홈: 통계, 단원별 문제 수, 진입 버튼
    questions/page.tsx        # 문제 목록, 검색/단원/오답/중요도 필터
    questions/new/page.tsx    # 문제 등록
    questions/[id]/edit/page.tsx
    quiz/page.tsx             # 문제 풀이
    wrong-note/page.tsx       # 오답노트
    unlock/page.tsx           # 선택형 접근 코드
    layout.tsx
    globals.css
    manifest.ts
  components/
    FilterBar.tsx
    QuestionCard.tsx
    QuestionForm.tsx
    QuizDeck.tsx
    SetupNotice.tsx
  lib/
    actions.ts                # 서버 액션: CRUD, 오답 저장
    filter.ts                 # URL 필터 파싱
    form.ts                   # FormData -> QuestionInput
    questions.ts              # Supabase 조회
    types.ts
    supabase/
      server.ts
      client.ts
  supabase/schema.sql
```

## 2. Supabase SQL

Supabase SQL Editor에서 `supabase/schema.sql`을 실행합니다.

```sql
create extension if not exists "pgcrypto";

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  chapter text not null,
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
  updated_at timestamptz not null default now()
);
```

전체 SQL에는 `updated_at` 자동 갱신 트리거, 인덱스, MVP용 RLS 정책도 포함되어 있습니다.

## 3. 환경변수

`.env.local`:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# 선택 사항: 설정하면 앱 진입 전에 접근 코드를 요구합니다.
APP_ACCESS_CODE=your-private-code
```

브라우저 Supabase 클라이언트 유틸도 준비되어 있지만 현재 CRUD는 서버 액션으로 처리합니다. 그래서 MVP 실행에는 `NEXT_PUBLIC_` 키가 필요 없습니다.

## 4. App Router 라우트

- `/`: 홈
- `/questions`: 문제 목록, 검색, 단원/오답/중요도 필터
- `/questions/new`: 문제 등록
- `/questions/[id]/edit`: 문제 수정
- `/quiz`: 문제 풀이
- `/quiz?wrong=1`: 오답만 다시 풀기
- `/wrong-note`: 오답노트
- `/unlock`: `APP_ACCESS_CODE` 설정 시 접근 코드 입력

## 5. 실행 방법

```bash
npm install
cp .env.example .env.local
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 6. 확인 방법

1. Supabase에서 `schema.sql` 실행
2. `.env.local` 입력
3. `/questions/new`에서 문제 등록
4. `/questions`에서 검색, 단원 필터, 오답 필터, 중요도 필터 확인
5. `/quiz`에서 보기 선택 후 `정답 확인`
6. 틀린 문제는 자동으로 `is_wrong=true`
7. 다시 맞히면 자동으로 `is_wrong=false`
8. `/wrong-note`에서 오답 다시 풀기와 오답 해제 확인

## 7. Vercel 배포

1. GitHub에 프로젝트 push
2. Vercel에서 Next.js 프로젝트로 Import
3. Environment Variables에 아래 값 추가
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `APP_ACCESS_CODE` 선택
4. Build Command: `npm run build`
5. Output Directory: Next.js 기본값

## 8. 최소 보호 방법

개인 MVP라 로그인은 생략했습니다. 대신 `APP_ACCESS_CODE`를 설정하면 미들웨어가 모든 화면 앞에 접근 코드 입력 화면을 둡니다. 더 안전하게 확장하려면 나중에 Supabase Auth를 붙이고 RLS 정책을 `auth.uid()` 기반으로 바꾸면 됩니다.
