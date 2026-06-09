import { isSupabaseConfigured } from "@/lib/supabase/server";

export function SetupNotice() {
  if (isSupabaseConfigured()) return null;

  return (
    <div className="border-2 border-seoul-line bg-white p-4 text-sm shadow-signal">
      <p className="font-black">Supabase 연결 대기 중</p>
      <p className="mt-2 text-seoul-line/80">
        `.env.local`에 `SUPABASE_URL`, `SUPABASE_ANON_KEY`를 넣고 `supabase/schema.sql`을
        실행하면 데이터가 표시됩니다.
      </p>
    </div>
  );
}
