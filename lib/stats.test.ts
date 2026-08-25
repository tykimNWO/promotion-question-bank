import { describe, expect, it } from "vitest";
import { buildQuestionStats } from "./stats";
import type { Question } from "./types";

function question(
  id: string,
  subject: string,
  chapter: string,
  isWrong = false
): Question {
  return {
    id,
    subject,
    chapter,
    question_type: "multiple_choice",
    question_text: `문제 ${id}`,
    option_1: "1",
    option_2: "2",
    option_3: "3",
    option_4: "4",
    answer: 1,
    explanation: "",
    is_wrong: isWrong,
    importance: 3,
    created_at: "2026-08-26T00:00:00Z",
    updated_at: "2026-08-26T00:00:00Z"
  };
}

describe("buildQuestionStats", () => {
  it("동일 단원명도 과목이 다르면 별도 단원으로 집계한다", () => {
    const stats = buildQuestionStats([
      question("1", "수신", "1단원"),
      question("2", "수신", "1단원", true),
      question("3", "정보보안", "1단원")
    ]);

    expect(stats.total).toBe(3);
    expect(stats.wrong).toBe(1);
    expect(stats.chapterCount).toBe(2);
    expect(stats.subjects).toEqual([
      { subject: "수신", count: 2, chapters: [{ chapter: "1단원", count: 2 }] },
      { subject: "정보보안", count: 1, chapters: [{ chapter: "1단원", count: 1 }] }
    ]);
  });
});
