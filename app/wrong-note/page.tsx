import Link from "next/link";
import { QuestionCard } from "@/components/QuestionCard";
import { SetupNotice } from "@/components/SetupNotice";
import { listQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function WrongNotePage() {
  const questions = await listQuestions({ wrongOnly: true });

  return (
    <main className="grid gap-5">
      <SetupNotice />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-seoul-light">Wrong note</p>
          <h1 className="text-3xl font-black">오답노트</h1>
        </div>
        <Link href="/quiz?wrong=1" className="touch-target border-2 border-seoul-line bg-seoul-light px-4 py-3 text-center font-black text-white shadow-signal">
          오답 다시 풀기
        </Link>
      </div>

      {questions.length === 0 ? (
        <div className="signal-frame p-5">
          <p className="font-black">등록된 오답이 없습니다.</p>
          <p className="mt-2 text-sm font-bold text-seoul-line/70">틀린 문제는 풀이 화면에서 자동으로 오답노트에 들어옵니다.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} compact />
          ))}
        </div>
      )}
    </main>
  );
}
