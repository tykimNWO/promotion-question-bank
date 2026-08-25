"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Question, QuestionType, SubjectTaxonomy } from "@/lib/types";

type QuestionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  question?: Question;
  taxonomy: SubjectTaxonomy[];
  mode: "create" | "edit";
};

const answerOptions = [1, 2, 3, 4] as const;
const importanceOptions = [1, 2, 3, 4, 5] as const;

export function QuestionForm({ action, question, taxonomy, mode }: QuestionFormProps) {
  const initialType = question?.question_type ?? "multiple_choice";
  const [type, setType] = useState<QuestionType>(initialType);
  const [subject, setSubject] = useState(question?.subject ?? "수신");
  const [chapter, setChapter] = useState(question?.chapter ?? "");
  const [multipleChoiceAnswer, setMultipleChoiceAnswer] = useState<number>(
    initialType === "multiple_choice" ? (question?.answer ?? 1) : 1
  );
  const [oxAnswer, setOxAnswer] = useState<number>(
    initialType === "ox" && question?.answer && question.answer <= 2 ? question.answer : 1
  );
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState(() =>
    initialType === "multiple_choice"
      ? [
          question?.option_1 ?? "",
          question?.option_2 ?? "",
          question?.option_3 ?? "",
          question?.option_4 ?? ""
        ]
      : ["", "", "", ""]
  );

  const chapterSuggestions = useMemo(() => {
    const selected = taxonomy.find((item) => item.subject === subject);
    if (selected) return selected.chapters;
    return Array.from(new Set(taxonomy.flatMap((item) => item.chapters))).sort((a, b) =>
      a.localeCompare(b, "ko")
    );
  }, [subject, taxonomy]);

  const answer = type === "ox" ? oxAnswer : multipleChoiceAnswer;

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.2em]">과목</span>
          <input
            name="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            list="subject-suggestions"
            required
            className="field-control"
          />
          <datalist id="subject-suggestions">
            {taxonomy.map((item) => (
              <option key={item.subject} value={item.subject} />
            ))}
          </datalist>
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.2em]">단원</span>
          <input
            name="chapter"
            value={chapter}
            onChange={(event) => setChapter(event.target.value)}
            list="chapter-suggestions"
            required
            className="field-control"
          />
          <datalist id="chapter-suggestions">
            {chapterSuggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.2em]">문제 유형</span>
        <select
          name="question_type"
          value={type}
          onChange={(event) => setType(event.target.value as QuestionType)}
          className="field-control h-12 font-bold"
        >
          <option value="multiple_choice">객관식</option>
          <option value="ox">O/X</option>
        </select>
      </label>

      <Field
        label="문제 본문"
        name="question_text"
        defaultValue={question?.question_text}
        required
        textarea
      />

      {type === "multiple_choice" ? (
        <div className="grid gap-3 md:grid-cols-2">
          {multipleChoiceOptions.map((option, index) => (
            <label key={index} className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.2em]">보기 {index + 1}</span>
              <input
                name={`option_${index + 1}`}
                value={option}
                onChange={(event) =>
                  setMultipleChoiceOptions((current) =>
                    current.map((value, optionIndex) =>
                      optionIndex === index ? event.target.value : value
                    )
                  )
                }
                required
                className="field-control"
              />
            </label>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3" aria-label="O/X 선택지 안내">
          <div className="border-2 border-seoul-line bg-white p-4 text-center text-2xl font-black">O</div>
          <div className="border-2 border-seoul-line bg-white p-4 text-center text-2xl font-black">X</div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.2em]">정답</span>
          <select
            name="answer"
            value={answer}
            onChange={(event) => {
              const nextAnswer = Number(event.target.value);
              if (type === "ox") setOxAnswer(nextAnswer);
              else setMultipleChoiceAnswer(nextAnswer);
            }}
            className="field-control h-12 font-bold"
          >
            {type === "ox"
              ? ([1, 2] as const).map((value) => (
                  <option key={value} value={value}>
                    {value === 1 ? "O" : "X"}
                  </option>
                ))
              : answerOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}번
                  </option>
                ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.2em]">중요도</span>
          <select
            name="importance"
            defaultValue={question?.importance ?? 3}
            className="field-control h-12 font-bold"
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
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.2em]">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          required={required}
          rows={name === "question_text" ? 5 : 4}
          className="field-control"
        />
      ) : (
        <input name={name} defaultValue={defaultValue} required={required} className="field-control" />
      )}
    </label>
  );
}
