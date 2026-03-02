import getDb from "@/lib/db";
import type { Pdf, PdfWithSummary } from "./types";

export function getPdfsByMunicipality(municipalityId: string): PdfWithSummary[] {
  const db = getDb();
  const pdfs = db
    .prepare("SELECT * FROM pdfs WHERE municipality_id = ? ORDER BY uploaded_at DESC")
    .all(municipalityId) as Pdf[];

  return pdfs.map((pdf) => {
    const summary = db
      .prepare("SELECT * FROM summaries WHERE pdf_id = ?")
      .get(pdf.id) as PdfWithSummary["summary"];
    return { ...pdf, summary };
  });
}

export function getPdfById(id: string): Pdf | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM pdfs WHERE id = ?").get(id) as Pdf | undefined;
}

export function insertPdf(pdf: Omit<Pdf, "uploaded_at">): void {
  const db = getDb();
  db.prepare(
    "INSERT INTO pdfs (id, municipality_id, filename, original_name) VALUES (?, ?, ?, ?)"
  ).run(pdf.id, pdf.municipality_id, pdf.filename, pdf.original_name);
}

export function deletePdf(id: string): void {
  const db = getDb();
  db.prepare("DELETE FROM summaries WHERE pdf_id = ?").run(id);
  db.prepare("DELETE FROM pdfs WHERE id = ?").run(id);
}

