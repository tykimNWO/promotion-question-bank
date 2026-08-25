import Link from "next/link";
import { deleteQuestion, setQuestionWrong } from "@/lib/actions";
import type { Question } from "@/lib/types";

type QuestionCardProps = {
  question: Question;
  compact?: boolean;
};

export function QuestionCard({ question, compact }: QuestionCardProps) {
  const deleteAction = deleteQuestion.bind(null, question.id);
  const clearWrongAction = setQuestionWrong.bind(null, question.id, false);

  return (
    <article className="question-card border-2 border-seoul-line bg-white p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs font-black">
        <span className="bg-seoul-light px-2 py-1 text-white">{question.subject}</span>
        <span className="border border-seoul-line px-2 py-1">{question.chapter}</span>
        <span className="border border-seoul-line px-2 py-1">
          {question.question_type === "ox" ? "O/X" : "객관식"}
        </span>
        <span className="border border-seoul-line px-2 py-1">중요도 {question.importance}</span>
        {question.is_wrong ? (
          <span className="border border-seoul-light px-2 py-1 text-seoul-light">오답</span>
        ) : null}
      </div>

      <h2 className="mt-4 line-clamp-3 text-lg font-black leading-snug">{question.question_text}</h2>

      {!compact ? (
        <p className="mt-3 line-clamp-2 text-sm text-seoul-line/75">{question.explanation || "해설 없음"}</p>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-2 sm:flex">
        <Link href={`/questions/${question.id}/edit`} className="touch-target border-2 border-seoul-line px-3 py-2 text-center text-sm font-black">
          수정
        </Link>
        <form action={deleteAction}>
          <button className="touch-target w-full border-2 border-seoul-line px-3 py-2 text-sm font-black">
            삭제
          </button>
        </form>
        {question.is_wrong ? (
          <form action={clearWrongAction}>
            <button className="touch-target w-full border-2 border-seoul-line bg-seoul-smoke px-3 py-2 text-sm font-black">
              오답 해제
            </button>
          </form>
        ) : null}
      </div>
    </article>
  );
}
