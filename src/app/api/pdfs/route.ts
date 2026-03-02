import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/session";
import { getPdfsByMunicipality } from "@/features/pdf-upload/repository";

export async function GET() {
  const session = await getSession();

  if (!session.municipalityId) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const pdfs = getPdfsByMunicipality(session.municipalityId);
  return NextResponse.json(pdfs);
}

