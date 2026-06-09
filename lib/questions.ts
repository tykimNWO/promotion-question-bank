import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Question, QuestionFilters, QuestionStats } from "@/lib/types";

export async function listQuestions(filters: QuestionFilters = {}): Promise<Question[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createSupabaseServerClient();
  let query = supabase.from("questions").select("*").order("created_at", { ascending: false });

  if (filters.chapter) query = query.eq("chapter", filters.chapter);
  if (filters.wrongOnly) query = query.eq("is_wrong", true);
  if (filters.importance) query = query.eq("importance", filters.importance);
  if (filters.search) {
    const term = filters.search.replaceAll("%", "\\%");
    query = query.or(
      `question_text.ilike.%${term}%,chapter.ilike.%${term}%,explanation.ilike.%${term}%`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function getQuestion(id: string): Promise<Question | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("questions").select("*").eq("id", id).single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  return data;
}

export async function listChapters(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("questions").select("chapter").order("chapter");

  if (error) throw new Error(error.message);

  return Array.from(new Set((data ?? []).map((row) => row.chapter).filter(Boolean)));
}

export async function getQuestionStats(): Promise<QuestionStats> {
  if (!isSupabaseConfigured()) {
    return { total: 0, wrong: 0, chapters: [] };
  }

  const [questions, wrongQuestions] = await Promise.all([
    listQuestions(),
    listQuestions({ wrongOnly: true })
  ]);

  const chapterMap = questions.reduce<Map<string, number>>((map, question) => {
    map.set(question.chapter, (map.get(question.chapter) ?? 0) + 1);
    return map;
  }, new Map());

  return {
    total: questions.length,
    wrong: wrongQuestions.length,
    chapters: Array.from(chapterMap.entries())
      .map(([chapter, count]) => ({ chapter, count }))
      .sort((a, b) => b.count - a.count)
  };
}
