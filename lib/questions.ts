import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { buildQuestionStats } from "@/lib/stats";
import type { Question, QuestionFilters, QuestionStats, SubjectTaxonomy } from "@/lib/types";

export async function listQuestions(filters: QuestionFilters = {}): Promise<Question[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createSupabaseServerClient();
  let query = supabase.from("questions").select("*").order("created_at", { ascending: false });

  if (filters.subject) query = query.eq("subject", filters.subject);
  if (filters.chapter) query = query.eq("chapter", filters.chapter);
  if (filters.questionType) query = query.eq("question_type", filters.questionType);
  if (filters.wrongOnly) query = query.eq("is_wrong", true);
  if (filters.importance) query = query.eq("importance", filters.importance);
  if (filters.search) {
    const term = filters.search.replaceAll("%", "\\%");
    query = query.or(
      `question_text.ilike.%${term}%,subject.ilike.%${term}%,chapter.ilike.%${term}%,explanation.ilike.%${term}%`
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

export async function listQuestionTaxonomy(): Promise<SubjectTaxonomy[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("questions")
    .select("subject, chapter")
    .order("subject")
    .order("chapter");

  if (error) throw new Error(error.message);

  const taxonomy = new Map<string, Set<string>>();
  for (const row of data ?? []) {
    if (!row.subject || !row.chapter) continue;
    const chapters = taxonomy.get(row.subject) ?? new Set<string>();
    chapters.add(row.chapter);
    taxonomy.set(row.subject, chapters);
  }

  return Array.from(taxonomy.entries()).map(([subject, chapters]) => ({
    subject,
    chapters: Array.from(chapters)
  }));
}

export async function getQuestionStats(): Promise<QuestionStats> {
  if (!isSupabaseConfigured()) {
    return { total: 0, wrong: 0, chapterCount: 0, subjects: [] };
  }

  return buildQuestionStats(await listQuestions());
}
