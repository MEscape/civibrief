import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import type { SessionData } from "@/features/auth/session";

const sessionOptions = {
  password: process.env.SESSION_SECRET ?? "civibrief-fallback-secret-key-32chars",
  cookieName: "civibrief_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

const PROTECTED_PATHS = ["/dashboard", "/api/pdfs"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  if (!session.municipalityId) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/pdfs/:path*"],
};

