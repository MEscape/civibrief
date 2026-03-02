import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/features/auth/session";
import { getPdfById } from "@/features/pdf-upload/repository";
import fs from "fs";
import path from "path";

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

  const filePath = path.join(
    process.cwd(),
    "uploads",
    pdf.municipality_id,
    pdf.filename
  );

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${encodeURIComponent(pdf.original_name)}"`,
      "Content-Length": String(fileBuffer.byteLength),
    },
  });
}

