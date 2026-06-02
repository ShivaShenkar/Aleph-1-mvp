import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const groups: string[] = payload["cognito:groups"] ?? [];
    const isTutor = groups.includes("Tutors");

    if (request.nextUrl.pathname.startsWith("/tutor") && !isTutor) {
      return NextResponse.redirect(new URL("/student", request.url));
    }

    if (request.nextUrl.pathname.startsWith("/student") && isTutor) {
      return NextResponse.redirect(new URL("/tutor", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/tutor/:path*", "/student/:path*"],
};
