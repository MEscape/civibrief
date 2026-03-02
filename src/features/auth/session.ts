import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  municipalityId?: string;
  municipalitySlug?: string;
  municipalityName?: string;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET ?? "civibrief-fallback-secret-key-32chars",
  cookieName: "civibrief_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8, // 8 Stunden
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

