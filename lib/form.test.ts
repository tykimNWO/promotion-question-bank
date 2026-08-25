import { describe, expect, it } from "vitest";
import { questionInputFromFormData } from "./form";

const baseValues: Record<string, string> = {
  subject: "수신",
  chapter: "1단원",
  question_type: "multiple_choice",
  question_text: "테스트 문제",
  option_1: "보기 A",
  option_2: "보기 B",
  option_3: "보기 C",
  option_4: "보기 D",
  answer: "3",
  explanation: "테스트 해설",
  importance: "4"
};

function formData(overrides: Record<string, string> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ ...baseValues, ...overrides })) {
    data.set(key, value);
  }
  return data;
}

describe("questionInputFromFormData", () => {
  it("객관식 입력을 변환한다", () => {
    expect(questionInputFromFormData(formData())).toEqual({
      subject: "수신",
      chapter: "1단원",
      question_type: "multiple_choice",
      question_text: "테스트 문제",
      option_1: "보기 A",
      option_2: "보기 B",
      option_3: "보기 C",
      option_4: "보기 D",
      answer: 3,
      explanation: "테스트 해설",
      importance: 4
    });
  });

  it("O/X 입력의 선택지를 서버 표준값으로 바꾼다", () => {
    const input = questionInputFromFormData(
      formData({ question_type: "ox", answer: "2", option_1: "변조값" })
    );

    expect(input).toMatchObject({
      question_type: "ox",
      option_1: "O",
      option_2: "X",
      option_3: "",
      option_4: "",
      answer: 2
    });
  });

  it("O/X 정답 범위를 벗어나면 저장을 거부한다", () => {
    expect(() => questionInputFromFormData(formData({ question_type: "ox", answer: "3" }))).toThrow(
      "정답 값이 올바르지 않습니다."
    );
  });

  it("과목과 객관식 보기를 필수로 검증한다", () => {
    expect(() => questionInputFromFormData(formData({ subject: "" }))).toThrow(
      "과목 항목을 입력해주세요."
    );
    expect(() => questionInputFromFormData(formData({ option_4: "" }))).toThrow(
      "보기 4 항목을 입력해주세요."
    );
  });

  it("알 수 없는 문제 유형을 거부한다", () => {
    expect(() => questionInputFromFormData(formData({ question_type: "essay" }))).toThrow(
      "문제 유형 값이 올바르지 않습니다."
    );
  });
});
