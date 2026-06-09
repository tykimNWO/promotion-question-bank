import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/unlock", "/manifest.webmanifest", "/icon.svg"];

export function middleware(request: NextRequest) {
  const accessCode = process.env.APP_ACCESS_CODE;

  if (!accessCode) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const isPublic =
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (isPublic) return NextResponse.next();

  const cookie = request.cookies.get("qb_access_code")?.value;
  if (cookie === accessCode) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/unlock";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api).*)"]
};
