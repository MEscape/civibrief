import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { randomUUID } from "crypto";
import { getSession } from "@/features/auth/session";
import { getPdfById } from "@/features/pdf-upload/repository";
import { generateSummary } from "@/features/summaries/service";
import { extractTextFromPdf } from "@/features/summaries/extractText";
import { insertSummary } from "@/features/summaries/repository";

export async function POST(
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

  const dataDir = process.env.DATA_DIR ?? process.cwd();
  const filePath = path.join(dataDir, "uploads", session.municipalityId, pdf.filename);

  try {
    const text = await extractTextFromPdf(filePath);
    const summaryText = await generateSummary(text);

    insertSummary({
      id: randomUUID(),
      pdf_id: id,
      content: summaryText,
      model: "facebook/bart-large-cnn",
    });

    return NextResponse.json({ ok: true, summary: summaryText });
  } catch (err) {
    console.error("Summarize error:", err);
    return NextResponse.json(
      { error: "Zusammenfassung konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}

