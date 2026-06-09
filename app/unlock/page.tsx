import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type UnlockPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UnlockPage({ searchParams }: UnlockPageProps) {
  const params = (await searchParams) ?? {};
  const hasError = params.error === "1";
  const next = typeof params.next === "string" ? params.next : "/";

  async function unlock(formData: FormData) {
    "use server";

    const code = String(formData.get("code") ?? "");
    const expected = process.env.APP_ACCESS_CODE;
    const nextPath = String(formData.get("next") ?? "/");

    if (!expected || code !== expected) {
      redirect(`/unlock?error=1&next=${encodeURIComponent(nextPath)}`);
    }

    const cookieStore = await cookies();
    cookieStore.set("qb_access_code", expected, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/"
    });

    redirect(nextPath.startsWith("/") ? nextPath : "/");
  }

  return (
    <main className="flex min-h-[70dvh] items-center justify-center">
      <form action={unlock} className="signal-frame grid w-full max-w-sm gap-4 p-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-seoul-light">Private signal</p>
          <h1 className="mt-1 text-3xl font-black">접근 코드</h1>
        </div>
        <input type="hidden" name="next" value={next} />
        <input
          name="code"
          type="password"
          autoFocus
          className="h-12 border-2 border-seoul-line bg-white px-3 font-bold outline-none focus:ring-4 focus:ring-seoul-light/30"
          placeholder="코드 입력"
        />
        {hasError ? <p className="text-sm font-black text-seoul-light">코드가 맞지 않습니다.</p> : null}
        <button className="touch-target border-2 border-seoul-line bg-seoul-light px-4 py-3 font-black text-white shadow-signal">
          들어가기
        </button>
      </form>
    </main>
  );
}
