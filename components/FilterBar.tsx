"use client";

import { useMemo, useState } from "react";
import type { QuestionFilters, SubjectTaxonomy } from "@/lib/types";

type FilterBarProps = {
  taxonomy: SubjectTaxonomy[];
  filters: QuestionFilters;
  action?: string;
};

const importanceOptions = [1, 2, 3, 4, 5];

export function FilterBar({ taxonomy, filters, action = "/questions" }: FilterBarProps) {
  const [subject, setSubject] = useState(filters.subject ?? "");
  const [chapter, setChapter] = useState(filters.chapter ?? "");
  const chapters = useMemo(() => {
    if (subject) return taxonomy.find((item) => item.subject === subject)?.chapters ?? [];
    return Array.from(new Set(taxonomy.flatMap((item) => item.chapters))).sort((a, b) =>
      a.localeCompare(b, "ko")
    );
  }, [subject, taxonomy]);

  return (
    <form action={action} className="grid gap-3 border-2 border-seoul-line bg-white p-3 md:grid-cols-2 xl:grid-cols-[minmax(12rem,1fr)_repeat(5,auto)]">
      <input
        name="q"
        defaultValue={filters.search}
        placeholder="문제, 과목, 단원, 해설 검색"
        className="h-11 border-2 border-seoul-line px-3 outline-none focus:ring-4 focus:ring-seoul-light/30"
      />

      <select
        name="subject"
        value={subject}
        onChange={(event) => {
          setSubject(event.target.value);
          setChapter("");
        }}
        className="h-11 border-2 border-seoul-line bg-white px-3 font-bold"
      >
        <option value="">전체 과목</option>
        {taxonomy.map((item) => (
          <option key={item.subject} value={item.subject}>
            {item.subject}
          </option>
        ))}
      </select>

      <select
        name="chapter"
        value={chapter}
        onChange={(event) => setChapter(event.target.value)}
        className="h-11 border-2 border-seoul-line bg-white px-3 font-bold"
      >
        <option value="">전체 단원</option>
        {chapters.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        name="type"
        defaultValue={filters.questionType ?? ""}
        className="h-11 border-2 border-seoul-line bg-white px-3 font-bold"
      >
        <option value="">전체 유형</option>
        <option value="multiple_choice">객관식</option>
        <option value="ox">O/X</option>
      </select>

      <select
        name="importance"
        defaultValue={filters.importance ?? ""}
        className="h-11 border-2 border-seoul-line bg-white px-3 font-bold"
      >
        <option value="">전체 중요도</option>
        {importanceOptions.map((importance) => (
          <option key={importance} value={importance}>
            중요도 {importance}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <label className="flex h-11 flex-1 items-center justify-center gap-2 border-2 border-seoul-line px-3 font-black xl:flex-none">
          <input type="checkbox" name="wrong" value="1" defaultChecked={filters.wrongOnly} />
          오답만
        </label>
        <button className="h-11 border-2 border-seoul-line bg-seoul-ink px-4 font-black text-white">
          적용
        </button>
      </div>
    </form>
  );
}
