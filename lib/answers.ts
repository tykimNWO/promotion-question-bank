import type { Question } from "./types";

export function isCorrectAnswer(
  question: Pick<Question, "question_type" | "answer" | "option_1">,
  selected: number | null,
  typedAnswer: string
): boolean {
  return question.question_type === "short_answer"
    ? typedAnswer === question.option_1
    : selected === question.answer;
}
