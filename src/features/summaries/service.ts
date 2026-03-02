/**
 * Summary Service – abstrahiert die KI-Zusammenfassungslogik.
 * Kann später gegen ein anderes Modell oder einen anderen Provider ausgetauscht werden.
 */

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL = "facebook/bart-large-cnn";
const HF_API_URL = `https://router.huggingface.co/models/${MODEL}`;

export async function generateSummary(text: string): Promise<string> {
  if (!text || text.trim().length < 100) {
    return "Der Text ist zu kurz für eine sinnvolle Zusammenfassung.";
  }

  if (!HF_API_KEY || HF_API_KEY === "your_hf_token_here") {
    // Fallback: einfache Zusammenfassung ohne API
    return generateLocalSummary(text);
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text.slice(0, 1024),
        parameters: {
          max_length: 250,
          min_length: 50,
          do_sample: false,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("HF API Error:", error);
      // Fallback bei API-Fehler
      return generateLocalSummary(text);
    }

    const result = await response.json();

    if (Array.isArray(result) && result[0]?.summary_text) {
      return result[0].summary_text;
    }

    return generateLocalSummary(text);
  } catch (err) {
    console.error("Summary generation failed:", err);
    return generateLocalSummary(text);
  }
}

/**
 * Lokaler Fallback: Extrahiert die ersten N Sätze als Zusammenfassung.
 */
function generateLocalSummary(text: string): string {
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/[.!?]\s+/)
    .filter((s) => s.trim().length > 20);

  const summary = sentences.slice(0, 5).join(". ").trim();
  return summary ? `${summary}.` : "Keine Zusammenfassung verfügbar.";
}

