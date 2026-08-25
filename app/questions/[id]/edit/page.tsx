import { notFound } from "next/navigation";
import { QuestionForm } from "@/components/QuestionForm";
import { updateQuestion } from "@/lib/actions";
import { getQuestion, listQuestionTaxonomy } from "@/lib/questions";

export const dynamic = "force-dynamic";

type EditQuestionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditQuestionPage({ params }: EditQuestionPageProps) {
  const { id } = await params;
  const [question, taxonomy] = await Promise.all([getQuestion(id), listQuestionTaxonomy()]);

  if (!question) notFound();

  const action = updateQuestion.bind(null, id);

  return (
    <main className="mx-auto max-w-3xl">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-seoul-light">Edit question</p>
        <h1 className="text-3xl font-black">문제 수정</h1>
      </div>
      <div className="signal-frame p-4 sm:p-6">
        <QuestionForm action={action} question={question} taxonomy={taxonomy} mode="edit" />
      </div>
    </main>
  );
}
