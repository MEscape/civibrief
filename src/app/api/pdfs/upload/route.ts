import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getSession } from "@/features/auth/session";
import { insertPdf } from "@/features/pdf-upload/repository";
import { findById } from "@/features/municipalities/repository";

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session.municipalityId) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  // Defensiv: municipality_id gegen DB prüfen (fängt stale Sessions ab)
  const municipality = findById(session.municipalityId);
  if (!municipality) {
    // Session veraltet – z.B. nach Container-Neustart mit neuen IDs
    session.destroy();
    return NextResponse.json(
      { error: "Sitzung abgelaufen. Bitte neu einloggen." },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Keine Datei übermittelt." }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Nur PDF-Dateien sind erlaubt." }, { status: 400 });
  }

  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "Datei zu groß (max. 20 MB)." }, { status: 400 });
  }

  // DATA_DIR kann via Umgebungsvariable überschrieben werden (Railway Volume)
  const dataDir = process.env.DATA_DIR ?? process.cwd();
  const uploadDir = path.join(dataDir, "uploads", session.municipalityId);
  await mkdir(uploadDir, { recursive: true });

  const id = randomUUID();
  const filename = `${id}.pdf`;
  const filePath = path.join(uploadDir, filename);

  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  insertPdf({
    id,
    municipality_id: session.municipalityId,
    filename,
    original_name: file.name,
  });

  return NextResponse.json({ ok: true, id });
}

