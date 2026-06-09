import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "승진시험 문제은행",
  description: "개인 승진시험 공부용 문제은행 MVP",
  appleWebApp: {
    capable: true,
    title: "문제은행",
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "rgb(255, 72, 0)"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <div className="mx-auto min-h-dvh max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <header className="mb-6 flex items-center justify-between border-2 border-seoul-line bg-seoul-ink p-2 text-white">
            <Link href="/" className="px-2 text-sm font-black tracking-[0.18em] sm:text-base">
              SEOUL STUDY SIGNAL
            </Link>
            <nav className="flex gap-1 text-xs font-black sm:text-sm">
              <Link href="/quiz" className="touch-target px-3 py-2 hover:bg-seoul-light">
                풀이
              </Link>
              <Link href="/questions" className="touch-target px-3 py-2 hover:bg-seoul-light">
                관리
              </Link>
              <Link href="/wrong-note" className="touch-target px-3 py-2 hover:bg-seoul-light">
                오답
              </Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
