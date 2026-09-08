import { describe, expect, it } from "vitest";
import { isCorrectAnswer } from "./answers";
import { questionInputFromFormData } from "./form";

function input(answer: string) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ subject: "수신", chapter: "1단원", question_type: "short_answer", question_text: "주관식", short_answer: answer, importance: "3" })) data.set(key, value);
  return questionInputFromFormData(data);
}

describe("주관식", () => {
  it("정답을 공백과 대소문자 그대로 저장한다", () => {
    expect(input(" 정답 AbC ")).toMatchObject({ question_type: "short_answer", option_1: " 정답 AbC ", option_2: "", option_3: "", option_4: "", answer: 1 });
    expect(() => input("   ")).toThrow("주관식 정답");
  });
  it("완전 일치만 정답이며 공백·대소문자·유사 답안은 오답이다", () => {
    const question = input("정답 AbC");
    expect(isCorrectAnswer(question, null, "정답 AbC")).toBe(true);
    for (const answer of [" 정답 AbC", "정답 AbC ", "정답 abc", "정답AbC", "정답", ""]) expect(isCorrectAnswer(question, null, answer)).toBe(false);
  });
  it("기존 객관식과 O/X의 번호 채점을 유지한다", () => {
    for (const question_type of ["multiple_choice", "ox"] as const) {
      const question = { question_type, answer: 2 as const, option_1: "O" };
      expect(isCorrectAnswer(question, 2, "")).toBe(true);
      expect(isCorrectAnswer(question, 1, "")).toBe(false);
    }
  });
});
