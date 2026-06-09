import { FilterBar } from "@/components/FilterBar";
import { QuizDeck } from "@/components/QuizDeck";
import { SetupNotice } from "@/components/SetupNotice";
import { parseQuestionFilters } from "@/lib/filter";
import { listChapters, listQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";

type QuizPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const params = (await searchParams) ?? {};
  const filters = parseQuestionFilters(params);
  const [questions, chapters] = await Promise.all([listQuestions(filters), listChapters()]);

  return (
    <main className="grid gap-5 pb-8">
      <SetupNotice />
      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-seoul-light">Mobile drill</p>
        <h1 className="text-3xl font-black">문제 풀이</h1>
      </div>
      <FilterBar chapters={chapters} filters={filters} action="/quiz" />
      <QuizDeck questions={questions} />
    </main>
  );
}
