import type { QuestionFilters } from "@/lib/types";

type FilterBarProps = {
  chapters: string[];
  filters: QuestionFilters;
  action?: string;
};

const importanceOptions = [1, 2, 3, 4, 5];

export function FilterBar({ chapters, filters, action = "/questions" }: FilterBarProps) {
  return (
    <form action={action} className="grid gap-3 border-2 border-seoul-line bg-white p-3 md:grid-cols-[1fr_auto_auto_auto]">
      <input
        name="q"
        defaultValue={filters.search}
        placeholder="문제, 단원, 해설 검색"
        className="h-11 border-2 border-seoul-line px-3 outline-none focus:ring-4 focus:ring-seoul-light/30"
      />

      <select
        name="chapter"
        defaultValue={filters.chapter ?? ""}
        className="h-11 border-2 border-seoul-line bg-white px-3 font-bold"
      >
        <option value="">전체 단원</option>
        {chapters.map((chapter) => (
          <option key={chapter} value={chapter}>
            {chapter}
          </option>
        ))}
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
        <label className="flex h-11 flex-1 items-center justify-center gap-2 border-2 border-seoul-line px-3 font-black md:flex-none">
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
