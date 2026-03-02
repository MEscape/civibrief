import getDb from "@/lib/db";
import type { Summary } from "../pdf-upload/types";

export function getSummaryByPdfId(pdfId: string): Summary | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM summaries WHERE pdf_id = ?").get(pdfId) as Summary | undefined;
}

export function insertSummary(summary: Omit<Summary, "created_at">): void {
  const db = getDb();
  db.prepare(
    "INSERT OR REPLACE INTO summaries (id, pdf_id, content, model) VALUES (?, ?, ?, ?)"
  ).run(summary.id, summary.pdf_id, summary.content, summary.model);
}

