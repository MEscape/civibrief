import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/features/auth/session";
import { findBySlug, verifyPassword } from "@/features/municipalities/repository";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { slug, password } = body;

  if (!slug || !password) {
    return NextResponse.json({ error: "Fehlende Anmeldedaten." }, { status: 400 });
  }

  const municipality = findBySlug(slug);

  if (!municipality || !municipality.password_hash) {
    return NextResponse.json({ error: "Ungültige Anmeldedaten." }, { status: 401 });
  }

  const valid = verifyPassword(password, municipality.password_hash);

  if (!valid) {
    return NextResponse.json({ error: "Ungültige Anmeldedaten." }, { status: 401 });
  }

  const session = await getSession();
  session.municipalityId = municipality.id;
  session.municipalitySlug = municipality.slug;
  session.municipalityName = municipality.name;
  await session.save();

  return NextResponse.json({ ok: true, municipality: { id: municipality.id, name: municipality.name, slug: municipality.slug } });
}

