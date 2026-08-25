import type { Question, QuestionStats } from "./types";

export function buildQuestionStats(questions: Question[]): QuestionStats {
  const subjectMap = new Map<string, { count: number; chapters: Map<string, number> }>();

  for (const question of questions) {
    const subject = subjectMap.get(question.subject) ?? { count: 0, chapters: new Map() };
    subject.count += 1;
    subject.chapters.set(question.chapter, (subject.chapters.get(question.chapter) ?? 0) + 1);
    subjectMap.set(question.subject, subject);
  }

  const subjects = Array.from(subjectMap.entries())
    .map(([subject, value]) => ({
      subject,
      count: value.count,
      chapters: Array.from(value.chapters.entries())
        .map(([chapter, count]) => ({ chapter, count }))
        .sort((a, b) => b.count - a.count || a.chapter.localeCompare(b.chapter, "ko"))
    }))
    .sort((a, b) => b.count - a.count || a.subject.localeCompare(b.subject, "ko"));

  return {
    total: questions.length,
    wrong: questions.filter((question) => question.is_wrong).length,
    chapterCount: subjects.reduce((sum, subject) => sum + subject.chapters.length, 0),
    subjects
  };
}
