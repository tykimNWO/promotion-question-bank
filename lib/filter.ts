import type { QuestionFilters, QuestionType } from "@/lib/types";

type SearchValue = string | string[] | undefined;

export function one(value: SearchValue) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseQuestionFilters(searchParams: Record<string, SearchValue>): QuestionFilters {
  const chapter = one(searchParams.chapter)?.trim();
  const subject = one(searchParams.subject)?.trim();
  const type = one(searchParams.type);
  const wrongOnly = one(searchParams.wrong) === "1";
  const importanceValue = Number(one(searchParams.importance));
  const search = one(searchParams.q)?.trim();

  return {
    subject: subject || undefined,
    chapter: chapter || undefined,
    questionType:
      type === "multiple_choice" || type === "ox" ? (type as QuestionType) : undefined,
    wrongOnly,
    importance:
      importanceValue >= 1 && importanceValue <= 5
        ? (importanceValue as QuestionFilters["importance"])
        : undefined,
    search: search || undefined
  };
}

export function buildFilterQuery(filters: QuestionFilters) {
  const params = new URLSearchParams();

  if (filters.subject) params.set("subject", filters.subject);
  if (filters.chapter) params.set("chapter", filters.chapter);
  if (filters.questionType) params.set("type", filters.questionType);
  if (filters.wrongOnly) params.set("wrong", "1");
  if (filters.importance) params.set("importance", String(filters.importance));
  if (filters.search) params.set("q", filters.search);

  const query = params.toString();
  return query ? `?${query}` : "";
}
