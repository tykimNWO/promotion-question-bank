import Link from "next/link";
import { SetupNotice } from "@/components/SetupNotice";
import { getQuestionStats } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const stats = await getQuestionStats();

  return (
    <main className="grid gap-6">
      <SetupNotice />

      <section className="signal-frame p-5 sm:p-8">
        <div className="rail-title">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-seoul-light">
              Personal promotion test bank
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">
              출근길 한 손 풀이용
              <br />
              문제은행
            </h1>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="전체 문제" value={stats.total} />
          <Metric label="오답 문제" value={stats.wrong} accent />
          <Metric label="과목 수" value={stats.subjects.length} />
          <Metric label="단원 수" value={stats.chapterCount} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/quiz" className="touch-target border-2 border-seoul-line bg-seoul-light px-5 py-4 text-center text-lg font-black text-white shadow-signal">
            문제 풀기 시작
          </Link>
          <Link href="/questions" className="touch-target border-2 border-seoul-line bg-white px-5 py-4 text-center text-lg font-black">
            문제 관리
          </Link>
        </div>
      </section>

      <section className="grid gap-3">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-black">과목별 단원</h2>
          <Link href="/questions/new" className="border-2 border-seoul-line bg-white px-3 py-2 text-sm font-black">
            새 문제
          </Link>
        </div>
        {stats.subjects.length === 0 ? (
          <p className="border-2 border-seoul-line bg-white p-4 font-bold">아직 등록된 문제가 없습니다.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {stats.subjects.map((subject) => (
              <article key={subject.subject} className="border-2 border-seoul-line bg-white p-4">
                <div className="flex items-baseline justify-between gap-3 border-b-2 border-seoul-line pb-3">
                  <h3 className="text-xl font-black">{subject.subject}</h3>
                  <Link
                    href={`/questions?subject=${encodeURIComponent(subject.subject)}`}
                    className="font-black text-seoul-light"
                  >
                    {subject.count}문제
                  </Link>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {subject.chapters.map((chapter) => (
                    <Link
                      key={chapter.chapter}
                      href={`/questions?subject=${encodeURIComponent(subject.subject)}&chapter=${encodeURIComponent(chapter.chapter)}`}
                      className="flex justify-between gap-3 border border-seoul-line p-3 font-bold"
                    >
                      <span>{chapter.chapter}</span>
                      <span className="text-seoul-light">{chapter.count}</span>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Metric({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="border-2 border-seoul-line bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em]">{label}</p>
      <p className={accent ? "mt-2 text-4xl font-black text-seoul-light" : "mt-2 text-4xl font-black"}>
        {value}
      </p>
    </div>
  );
}
