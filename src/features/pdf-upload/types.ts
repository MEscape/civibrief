export interface Pdf {
  id: string;
  municipality_id: string;
  filename: string;
  original_name: string;
  uploaded_at: string;
}

export interface Summary {
  id: string;
  pdf_id: string;
  content: string;
  model: string;
  created_at: string;
}

export interface PdfWithSummary extends Pdf {
  summary?: Summary;
}

