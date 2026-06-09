import Link from "next/link";
import type { Question } from "@/lib/types";

type QuestionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  question?: Question;
  mode: "create" | "edit";
};

const answerOptions = [1, 2, 3, 4] as const;
const importanceOptions = [1, 2, 3, 4, 5] as const;

export function QuestionForm({ action, question, mode }: QuestionFormProps) {
  return (
    <form action={action} className="grid gap-5">
      <Field label="단원" name="chapter" defaultValue={question?.chapter} required />
      <Field
        label="문제 본문"
        name="question_text"
        defaultValue={question?.question_text}
        required
        textarea
      />

      <div className="grid gap-3 md:grid-cols-2">
        {[1, 2, 3, 4].map((number) => (
          <Field
            key={number}
            label={`보기 ${number}`}
            name={`option_${number}`}
            defaultValue={question?.[`option_${number}` as keyof Question] as string | undefined}
            required
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.2em]">정답 번호</span>
          <select
            name="answer"
            defaultValue={question?.answer ?? 1}
            className="h-12 border-2 border-seoul-line bg-white px-3 font-bold outline-none focus:ring-4 focus:ring-seoul-light/30"
          >
            {answerOptions.map((answer) => (
              <option key={answer} value={answer}>
                {answer}번
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.2em]">중요도</span>
          <select
            name="importance"
            defaultValue={question?.importance ?? 3}
            className="h-12 border-2 border-seoul-line bg-white px-3 font-bold outline-none focus:ring-4 focus:ring-seoul-light/30"
          >
            {importanceOptions.map((importance) => (
              <option key={importance} value={importance}>
                {importance}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Field label="해설" name="explanation" defaultValue={question?.explanation} textarea />

      <div className="sticky bottom-0 -mx-4 flex gap-3 border-t-2 border-seoul-line bg-seoul-paper p-4 sm:static sm:mx-0 sm:border-0 sm:p-0">
        <Link href="/questions" className="touch-target flex-1 border-2 border-seoul-line bg-white px-4 py-3 text-center font-black">
          취소
        </Link>
        <button className="touch-target flex-[2] border-2 border-seoul-line bg-seoul-light px-4 py-3 font-black text-white shadow-signal">
          {mode === "create" ? "문제 저장" : "수정 저장"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  textarea
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const className =
    "w-full border-2 border-seoul-line bg-white px-3 py-3 outline-none focus:ring-4 focus:ring-seoul-light/30";

  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.2em]">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          required={required}
          rows={name === "question_text" ? 5 : 4}
          className={className}
        />
      ) : (
        <input name={name} defaultValue={defaultValue} required={required} className={className} />
      )}
    </label>
  );
}
