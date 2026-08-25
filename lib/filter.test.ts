import { describe, expect, it } from "vitest";
import { buildFilterQuery, parseQuestionFilters } from "./filter";

describe("question filters", () => {
  it("과목, 단원, 유형과 기존 필터를 파싱한다", () => {
    expect(
      parseQuestionFilters({
        subject: " 수신 ",
        chapter: "1단원",
        type: "ox",
        wrong: "1",
        importance: "5",
        q: " 안테나 "
      })
    ).toEqual({
      subject: "수신",
      chapter: "1단원",
      questionType: "ox",
      wrongOnly: true,
      importance: 5,
      search: "안테나"
    });
  });

  it("허용되지 않은 유형과 중요도를 무시한다", () => {
    const filters = parseQuestionFilters({ type: "essay", importance: "9" });
    expect(filters.questionType).toBeUndefined();
    expect(filters.importance).toBeUndefined();
  });

  it("모든 필터를 URL 쿼리로 보존한다", () => {
    const query = buildFilterQuery({
      subject: "데이터 통신",
      chapter: "공통 1단원",
      questionType: "multiple_choice",
      wrongOnly: true,
      importance: 2,
      search: "검색어"
    });
    const params = new URLSearchParams(query.slice(1));

    expect(Object.fromEntries(params)).toEqual({
      subject: "데이터 통신",
      chapter: "공통 1단원",
      type: "multiple_choice",
      wrong: "1",
      importance: "2",
      q: "검색어"
    });
  });
});
