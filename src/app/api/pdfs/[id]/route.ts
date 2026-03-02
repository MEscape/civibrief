import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/features/auth/session";
import { getPdfById, deletePdf } from "@/features/pdf-upload/repository";
import { getSummaryByPdfId } from "@/features/summaries/repository";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session.municipalityId) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const pdf = getPdfById(id);
  if (!pdf || pdf.municipality_id !== session.municipalityId) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }

  deletePdf(id);
  return NextResponse.json({ ok: true });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session.municipalityId) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const pdf = getPdfById(id);
  if (!pdf || pdf.municipality_id !== session.municipalityId) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }

  const summary = getSummaryByPdfId(id);
  return NextResponse.json({ ...pdf, summary });
}


