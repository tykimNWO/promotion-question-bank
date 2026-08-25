# 승진시험 문제은행 MVP

개인 승진시험 공부용 문제은행입니다. 여러 과목과 단원을 구분해 객관식·O/X 문제를 등록하고, 모바일에서는 URL로 접속해 PWA처럼 문제를 풉니다.

## 1. 전체 프로젝트 구조

```txt
promotion-question-bank/
  app/
    page.tsx                  # 홈: 과목/단원 통계, 진입 버튼
    questions/page.tsx        # 문제 목록, 검색/과목/단원/유형 필터
    questions/new/page.tsx    # 문제 등록
    questions/[id]/edit/page.tsx
    quiz/page.tsx             # 문제 풀이
    wrong-note/page.tsx       # 오답노트
    unlock/page.tsx           # 선택형 접근 코드
    layout.tsx
    globals.css
    manifest.ts
  components/
    FilterBar.tsx             # 과목/단원/유형/오답/중요도 필터
    QuestionCard.tsx
    QuestionForm.tsx
    QuizDeck.tsx
    SetupNotice.tsx
  lib/
    actions.ts                # 서버 액션: CRUD, 오답 저장
    filter.ts                 # URL 필터 파싱
    form.ts                   # FormData -> QuestionInput, 유형별 검증
    questions.ts              # Supabase 조회
    stats.ts                  # 과목/단원 통계 집계
    types.ts
    supabase/
      server.ts
      client.ts
  supabase/schema.sql         # 신규 설치용 전체 스키마
  supabase/migrations/        # 기존 DB 업그레이드 SQL
```

## 2. Supabase SQL

Supabase SQL Editor에서 `supabase/schema.sql`을 실행합니다.

```sql
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
  updated_at timestamptz not null default now()
);
```

전체 SQL에는 `updated_at` 자동 갱신 트리거, 인덱스, MVP용 RLS 정책도 포함되어 있습니다.

### 기존 DB 업그레이드

이미 `questions` 테이블을 사용 중이라면 테이블을 초기화하지 말고 다음 순서로 진행합니다.

1. `public.questions`를 CSV 등으로 백업하고 전체 문제 수를 기록합니다.
2. `supabase/migrations/20260826_multi_subject_ox.sql`을 Supabase SQL Editor에서 실행합니다.
3. 실행 전후 전체 문제 수가 같은지 확인합니다.
4. 기존 문제가 모두 `수신 / multiple_choice`로 조회되는지 샘플 검증합니다.
5. 변경된 애플리케이션을 배포합니다.

O/X는 `option_1='O'`, `option_2='X'`, 나머지 보기는 빈 문자열로 저장하며 정답 `1`은 O, `2`는 X를 뜻합니다.

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
- `/questions`: 문제 목록, 검색, 과목/단원/유형/오답/중요도 필터
- `/questions/new`: 문제 등록
- `/questions/[id]/edit`: 문제 수정
- `/quiz`: 객관식·O/X 문제 풀이와 동일 필터
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
4. 다른 과목의 객관식과 O/X 문제를 각각 등록
5. `/questions`에서 검색, 과목/단원/유형/오답/중요도 필터 확인
6. `/quiz`에서 객관식 보기 또는 O/X 선택 후 `정답 확인`
7. 틀린 문제는 자동으로 `is_wrong=true`
8. 다시 맞히면 자동으로 `is_wrong=false`
9. `/wrong-note`에서 오답 다시 풀기와 오답 해제 확인

코드 검증은 다음 명령으로 실행합니다.

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

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
