"use client";

import { useMemo, useState, useTransition } from "react";
import { setQuestionWrong } from "@/lib/actions";
import type { Question } from "@/lib/types";

type QuizDeckProps = {
  questions: Question[];
};

type SyncState = "idle" | "saving" | "saved";

export function QuizDeck({ questions }: QuizDeckProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [wrongMap, setWrongMap] = useState(() => new Map(questions.map((q) => [q.id, q.is_wrong])));
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [isPending, startTransition] = useTransition();

  const question = questions[index];
  const options = useMemo(
    () =>
      question
        ? question.question_type === "ox"
          ? [question.option_1, question.option_2]
          : [question.option_1, question.option_2, question.option_3, question.option_4]
        : [],
    [question]
  );

  if (!question) {
    return (
      <div className="signal-frame p-6 text-center">
        <p className="text-xl font-black">풀 문제가 없습니다.</p>
        <p className="mt-2 text-sm font-bold text-seoul-line/70">문제를 등록하거나 필터를 바꿔주세요.</p>
      </div>
    );
  }

  const isCorrect = selected === question.answer;
  const isWrong = wrongMap.get(question.id) ?? false;
  const answerLabel =
    question.question_type === "ox"
      ? question.answer === 1
        ? "O"
        : "X"
      : `${question.answer}번`;

  function saveWrongState(nextWrong: boolean) {
    setWrongMap((current) => new Map(current).set(question.id, nextWrong));
    setSyncState("saving");
    startTransition(async () => {
      await setQuestionWrong(question.id, nextWrong);
      setSyncState("saved");
      window.setTimeout(() => setSyncState("idle"), 900);
    });
  }

  function revealAnswer() {
    if (!selected) return;
    setRevealed(true);
    saveWrongState(selected !== question.answer);
  }

  function nextQuestion() {
    setSelected(null);
    setRevealed(false);
    setIndex((current) => (current + 1) % questions.length);
  }

  return (
    <section className="mx-auto grid max-w-2xl gap-4">
      <div className="flex items-center justify-between border-2 border-seoul-line bg-white p-3 text-sm font-black">
        <span>
          {index + 1} / {questions.length}
        </span>
        <span className="text-center text-seoul-light">
          {question.subject} · {question.chapter}
        </span>
        <span>중요도 {question.importance}</span>
      </div>

      <article className="signal-frame p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.18em]">
          <span>{isWrong ? "Wrong note" : "Practice"}</span>
          <span>{syncState === "saving" || isPending ? "저장 중" : syncState === "saved" ? "저장됨" : ""}</span>
        </div>

        <h1 className="mt-5 text-2xl font-black leading-snug sm:text-3xl">{question.question_text}</h1>

        <div className="mt-6 grid gap-3">
          {options.map((option, optionIndex) => {
            const number = optionIndex + 1;
            const isSelected = selected === number;
            const isAnswer = question.answer === number;
            const showCorrect = revealed && isAnswer;
            const showWrongSelected = revealed && isSelected && !isAnswer;

            return (
              <button
                key={number}
                type="button"
                onClick={() => !revealed && setSelected(number)}
                className={[
                  "touch-target border-2 border-seoul-line p-4 text-left font-bold transition",
                  question.question_type === "ox" ? "text-center text-3xl" : "",
                  isSelected && !revealed ? "bg-seoul-light text-white shadow-signal" : "bg-white",
                  showCorrect ? "bg-green-600 text-white" : "",
                  showWrongSelected ? "bg-red-600 text-white" : ""
                ].join(" ")}
              >
                {question.question_type === "multiple_choice" ? (
                  <span className="mr-3 font-black">{number}</span>
                ) : null}
                {option}
              </button>
            );
          })}
        </div>

        {revealed ? (
          <div className="mt-5 border-2 border-seoul-line bg-seoul-smoke p-4">
            <p className={isCorrect ? "font-black text-green-700" : "font-black text-red-700"}>
              {isCorrect
                ? "정답입니다."
                : `${question.question_type === "ox" ? (selected === 1 ? "O" : "X") : `${selected}번`}은 오답입니다. 정답은 ${answerLabel}입니다.`}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{question.explanation || "해설이 없습니다."}</p>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3">
          {!revealed ? (
            <button
              type="button"
              disabled={!selected}
              onClick={revealAnswer}
              className="touch-target col-span-2 border-2 border-seoul-line bg-seoul-light px-4 py-3 font-black text-white disabled:bg-seoul-smoke disabled:text-seoul-line/50"
            >
              정답 확인
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => saveWrongState(!isWrong)}
                className="touch-target border-2 border-seoul-line bg-white px-4 py-3 font-black"
              >
                {isWrong ? "오답 해제" : "오답 등록"}
              </button>
              <button
                type="button"
                onClick={nextQuestion}
                className="touch-target border-2 border-seoul-line bg-seoul-ink px-4 py-3 font-black text-white"
              >
                다음 문제
              </button>
            </>
          )}
        </div>
      </article>
    </section>
  );
}
