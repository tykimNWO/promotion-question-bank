import { QuestionForm } from "@/components/QuestionForm";
import { createQuestion } from "@/lib/actions";
import { listQuestionTaxonomy } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function NewQuestionPage() {
  const taxonomy = await listQuestionTaxonomy();

  return (
    <main className="mx-auto max-w-3xl">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-seoul-light">New question</p>
        <h1 className="text-3xl font-black">문제 등록</h1>
      </div>
      <div className="signal-frame p-4 sm:p-6">
        <QuestionForm action={createQuestion} taxonomy={taxonomy} mode="create" />
      </div>
    </main>
  );
}
