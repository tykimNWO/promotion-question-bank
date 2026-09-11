"use client";

import Link from "next/link";
import { isCorrectAnswer } from "@/lib/answers";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { setQuestionWrong } from "@/lib/actions";
import type { Question } from "@/lib/types";

type QuizDeckProps = {
  questions: Question[];
  wrongOnly?: boolean;
};

type SyncState = "idle" | "saving" | "saved" | "error";

export function QuizDeck({ questions, wrongOnly = false }: QuizDeckProps) {
  const [initialQuestions] = useState(questions);
  const [deck, setDeck] = useState<Question[] | null>(null);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    const shuffled = [...initialQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDeck(shuffled);
  }, [initialQuestions]);
  const [index, setIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [wrongMap, setWrongMap] = useState(() => new Map(questions.map((q) => [q.id, q.is_wrong])));
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [isPending, startTransition] = useTransition();
  const pendingWrong = useRef(false);

  const question = finished ? undefined : deck?.[index];
  const options = useMemo(
    () =>
      question
        ? question.question_type === "short_answer"
          ? []
          : question.question_type === "ox"
          ? [question.option_1, question.option_2]
          : [question.option_1, question.option_2, question.option_3, question.option_4]
        : [],
    [question]
  );

  if (deck === null) return <p className="font-bold">문제를 섞고 있습니다.</p>;

  if (!question) {
    return (
      <div className="signal-frame p-6 text-center">
        <p className="text-xl font-black">{finished ? "오답을 모두 풀었습니다." : "풀 문제가 없습니다."}</p>
        <Link href="/wrong-note" className="mt-3 inline-block font-bold text-seoul-light">오답노트로 이동</Link>
        <p className="mt-2 text-sm font-bold text-seoul-line/70">다른 과목을 선택하거나 문제를 등록해 주세요.</p>
      </div>
    );
  }

  const questionId = question.id;
  const isShortAnswer = question.question_type === "short_answer";
  const hasAnswer = isShortAnswer ? typedAnswer.length > 0 : selected !== null;
  const isCorrect = isCorrectAnswer(question, selected, typedAnswer);
  const isWrong = wrongMap.get(question.id) ?? false;
  const answerLabel =
    isShortAnswer ? question.option_1 : question.question_type === "ox"
      ? question.answer === 1
        ? "O"
        : "X"
      : `${question.answer}번`;

  function saveWrongState(nextWrong: boolean) {
    pendingWrong.current = nextWrong;
    setSyncState("saving");
    startTransition(async () => {
      try {
        await setQuestionWrong(questionId, nextWrong);
        setWrongMap((current) => new Map(current).set(questionId, nextWrong));
        setSyncState("saved");
      } catch {
        setSyncState("error");
      }
    });
  }

  function revealAnswer() {
    if (!hasAnswer || revealed || isPending) return;
    setRevealed(true);
    saveWrongState(!isCorrect);
  }

  function nextQuestion() {
    if (isPending || syncState === "error") return;
    if (wrongOnly) {
      const next = Array.from({ length: deck!.length }, (_, offset) => (index + offset + 1) % deck!.length)
        .find(candidate => wrongMap.get(deck![candidate].id));
      if (next === undefined) { setFinished(true); return; }
      setIndex(next);
    } else {
      setIndex((current) => (current + 1) % deck!.length);
    }
    setSelected(null);
    setTypedAnswer("");
    setRevealed(false);
    setSyncState("idle");
  }

  return (
    <section className="mx-auto grid w-full min-w-0 max-w-2xl gap-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-2 border-seoul-line bg-white p-3 text-sm font-black">
        <span className="whitespace-nowrap">
          {index + 1} / {deck.length}
        </span>
        <span className="min-w-0 break-words text-center text-seoul-light">
          {question.subject} · {question.chapter}
        </span>
        <span className="whitespace-nowrap">중요도 {question.importance}</span>
      </div>

      <article className="signal-frame p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.18em]">
          <span>{isWrong ? "Wrong note" : "Practice"}</span>
          <span>{syncState === "saving" || isPending ? "저장 중" : syncState === "saved" ? "저장됨" : ""}</span>
        </div>

        <h1 className="mt-5 text-2xl font-black leading-snug sm:text-3xl">{question.question_text}</h1>

        {isShortAnswer && <label className="mt-6 grid gap-2">
          <span className="text-sm font-black">주관식 답안</span>
          <input value={typedAnswer} onChange={event => setTypedAnswer(event.target.value)} disabled={revealed}
            onKeyDown={event => { if (event.key === "Enter" && !event.nativeEvent.isComposing) { event.preventDefault(); revealAnswer(); } }}
            className="field-control" placeholder="정답을 입력하세요" autoComplete="off" autoCapitalize="none" spellCheck={false} />
          <span className="text-xs">공백·대소문자까지 정확히 입력해 주세요.</span>
        </label>}
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
                  showCorrect
                    ? "bg-green-600 text-white"
                    : showWrongSelected
                      ? "bg-red-600 text-white"
                      : isSelected && !revealed
                        ? "bg-seoul-light text-white shadow-signal"
                        : "bg-white text-seoul-ink"
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
            <p className={isCorrect ? "whitespace-pre-wrap font-black text-green-700" : "whitespace-pre-wrap font-black text-red-700"}>
              {isCorrect
                ? "정답입니다."
                : isShortAnswer ? `오답입니다. 정답은 ${answerLabel}입니다.` : `${question.question_type === "ox" ? (selected === 1 ? "O" : "X") : `${selected}번`}은 오답입니다. 정답은 ${answerLabel}입니다.`}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{question.explanation || "해설이 없습니다."}</p>
          </div>
        ) : null}

        {revealed && !isCorrect && syncState === "saved" && (
          <Link href="/wrong-note" prefetch={false} className="touch-target mt-4 block border-2 border-seoul-line bg-seoul-light px-4 py-3 text-center font-black text-white">오답노트로 이동</Link>
        )}
        {syncState === "error" && <div role="alert" className="mt-4 text-sm font-bold text-red-700">
          저장하지 못했습니다. <button onClick={() => saveWrongState(pendingWrong.current)} className="underline">다시 저장</button>
        </div>}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {!revealed ? (
            <button
              type="button"
              disabled={!hasAnswer}
              onClick={revealAnswer}
              className="touch-target col-span-2 border-2 border-seoul-line bg-seoul-light px-4 py-3 font-black text-white disabled:bg-seoul-smoke disabled:text-seoul-line/50"
            >
              정답 확인
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={isPending || syncState === "error"}
                onClick={() => saveWrongState(!isWrong)}
                className="touch-target border-2 border-seoul-line bg-white px-4 py-3 font-black"
              >
                {isWrong ? "오답 해제" : "오답 등록"}
              </button>
              <button
                type="button"
                disabled={isPending || syncState === "error"}
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
