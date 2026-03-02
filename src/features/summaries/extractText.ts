import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { PDFParse } = require("pdf-parse") as any;

export async function extractTextFromPdf(filePath: string): Promise<string> {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  const buffer = fs.readFileSync(absolutePath);

  // mehmet-kozan/pdf-parse: PDFParse-Klasse mit getText()
  const parser = new PDFParse({ data: buffer, verbosity: 0 });
  const result = await parser.getText();

  const text: string = result.text ?? "";
  // Begrenze auf ~4000 Zeichen für die API (BART hat Token-Limit)
  return text.slice(0, 4000).trim();
}
