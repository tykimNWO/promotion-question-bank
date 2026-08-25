import type { QuestionInput, QuestionType } from "@/lib/types";

function text(formData: FormData, key: keyof QuestionInput) {
  return String(formData.get(key) ?? "").trim();
}

function integerInRange(
  value: FormDataEntryValue | null,
  minimum: number,
  maximum: number,
  label: string
) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(`${label} 값이 올바르지 않습니다.`);
  }
  return parsed;
}

function questionType(value: FormDataEntryValue | null): QuestionType {
  if (value === "multiple_choice" || value === "ox") return value;
  throw new Error("문제 유형 값이 올바르지 않습니다.");
}

export function questionInputFromFormData(formData: FormData): QuestionInput {
  const type = questionType(formData.get("question_type"));
  const common = {
    subject: text(formData, "subject"),
    chapter: text(formData, "chapter"),
    question_type: type,
    question_text: text(formData, "question_text"),
    explanation: text(formData, "explanation"),
    importance: integerInRange(formData.get("importance"), 1, 5, "중요도") as QuestionInput["importance"]
  };

  const missing = [
    ["과목", common.subject],
    ["단원", common.chapter],
    ["문제 본문", common.question_text]
  ].filter(([, value]) => !value);

  if (missing.length > 0) {
    throw new Error(`${missing.map(([label]) => label).join(", ")} 항목을 입력해주세요.`);
  }

  if (type === "ox") {
    return {
      ...common,
      option_1: "O",
      option_2: "X",
      option_3: "",
      option_4: "",
      answer: integerInRange(formData.get("answer"), 1, 2, "정답") as 1 | 2
    };
  }

  const options = {
    option_1: text(formData, "option_1"),
    option_2: text(formData, "option_2"),
    option_3: text(formData, "option_3"),
    option_4: text(formData, "option_4")
  };
  const missingOptions = Object.entries(options)
    .filter(([, value]) => !value)
    .map(([key]) => `보기 ${key.at(-1)}`);

  if (missingOptions.length > 0) {
    throw new Error(`${missingOptions.join(", ")} 항목을 입력해주세요.`);
  }

  return {
    ...common,
    ...options,
    answer: integerInRange(formData.get("answer"), 1, 4, "정답") as QuestionInput["answer"]
  };
}
