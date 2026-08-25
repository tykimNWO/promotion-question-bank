import Link from "next/link";
import { FilterBar } from "@/components/FilterBar";
import { QuestionCard } from "@/components/QuestionCard";
import { SetupNotice } from "@/components/SetupNotice";
import { parseQuestionFilters } from "@/lib/filter";
import { listQuestionTaxonomy, listQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";

type QuestionsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
  const params = (await searchParams) ?? {};
  const filters = parseQuestionFilters(params);
  const [questions, taxonomy] = await Promise.all([
    listQuestions(filters),
    listQuestionTaxonomy()
  ]);

  return (
    <main className="grid gap-5">
      <SetupNotice />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-seoul-light">Question control</p>
          <h1 className="text-3xl font-black">문제 목록</h1>
        </div>
        <Link href="/questions/new" className="touch-target border-2 border-seoul-line bg-seoul-light px-4 py-3 text-center font-black text-white shadow-signal">
          문제 등록
        </Link>
      </div>

      <FilterBar taxonomy={taxonomy} filters={filters} />

      <div className="grid gap-4">
        {questions.length === 0 ? (
          <p className="border-2 border-seoul-line bg-white p-5 font-bold">조건에 맞는 문제가 없습니다.</p>
        ) : (
          questions.map((question) => <QuestionCard key={question.id} question={question} />)
        )}
      </div>
    </main>
  );
}
