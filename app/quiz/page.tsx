import Link from "next/link";
import { QuizDeck } from "@/components/QuizDeck";
import { SetupNotice } from "@/components/SetupNotice";
import { one } from "@/lib/filter";
import { listQuestions, listQuestionTaxonomy } from "@/lib/questions";

export const dynamic = "force-dynamic";
type QuizPageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const params = (await searchParams) ?? {};
  const subject = one(params.subject)?.trim();
  const wrongOnly = one(params.wrong) === "1";
  const returnHref = wrongOnly ? "/quiz?wrong=1" : "/quiz";
  if (subject) {
    const questions = await listQuestions({ subject, wrongOnly });
    return <main className="grid gap-5 pb-8">
      <SetupNotice />
      <Link href={returnHref} className="font-bold text-seoul-light">← 과목 다시 선택</Link>
      <QuizDeck key={`${subject}:${wrongOnly}`} questions={questions} wrongOnly={wrongOnly} />
    </main>;
  }
  const subjects = wrongOnly
    ? [...new Set((await listQuestions({ wrongOnly: true })).map(q => q.subject))]
    : (await listQuestionTaxonomy()).map(item => item.subject);
  return <main className="grid gap-5 pb-8">
    <SetupNotice />
    <h1 className="text-3xl font-black">{wrongOnly ? "오답 다시 풀기" : "문제 풀이"}</h1>
    <p className="font-bold">과목을 선택하면 해당 과목의 모든 문제를 랜덤 순서로 풀이합니다.</p>
    <div className="grid gap-4 sm:grid-cols-2">
      {subjects.map(subject => <Link key={subject}
        href={`/quiz?${new URLSearchParams({ subject, ...(wrongOnly ? { wrong: "1" } : {}) })}`}
        className="signal-frame p-6 text-xl font-black hover:bg-seoul-smoke">{subject}</Link>)}
    </div>
    {subjects.length === 0 && <p className="signal-frame p-6 font-bold">{wrongOnly ? "등록된 오답이 없습니다." : "등록된 문제가 없습니다."}</p>}
  </main>;
}
