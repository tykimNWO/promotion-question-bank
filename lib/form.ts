import type { QuestionInput } from "@/lib/types";

function text(formData: FormData, key: keyof QuestionInput) {
  return String(formData.get(key) ?? "").trim();
}

function choice(value: FormDataEntryValue | null, fallback: number) {
  const parsed = Number(value);
  return parsed >= 1 && parsed <= 5 ? parsed : fallback;
}

export function questionInputFromFormData(formData: FormData): QuestionInput {
  const input = {
    chapter: text(formData, "chapter"),
    question_text: text(formData, "question_text"),
    option_1: text(formData, "option_1"),
    option_2: text(formData, "option_2"),
    option_3: text(formData, "option_3"),
    option_4: text(formData, "option_4"),
    answer: choice(formData.get("answer"), 1) as QuestionInput["answer"],
    explanation: text(formData, "explanation"),
    importance: choice(formData.get("importance"), 3) as QuestionInput["importance"]
  };

  const missing = [
    ["단원", input.chapter],
    ["문제 본문", input.question_text],
    ["보기 1", input.option_1],
    ["보기 2", input.option_2],
    ["보기 3", input.option_3],
    ["보기 4", input.option_4]
  ].filter(([, value]) => !value);

  if (missing.length > 0) {
    throw new Error(`${missing.map(([label]) => label).join(", ")} 항목을 입력해주세요.`);
  }

  return input;
}
