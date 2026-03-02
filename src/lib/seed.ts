/**
 * Seed-Skript: Legt vordefinierte Kommunen an.
 * Ausführen mit: npx tsx src/lib/seed.ts
 *
 * WICHTIG: IDs sind deterministisch (slug-basiert) damit sie über
 * Container-Restarts hinweg stabil bleiben.
 */
import { randomBytes, scryptSync, createHash } from "crypto";
import getDb from "./db";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/** Deterministisch: gleicher slug → immer gleiche UUID */
function deterministicUUID(slug: string): string {
  const hash = createHash("sha256").update(`civibrief-municipality-${slug}`).digest("hex");
  // UUID v4 Format aus Hash bauen
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    "4" + hash.slice(13, 16),
    ((parseInt(hash[16], 16) & 0x3) | 0x8).toString(16) + hash.slice(17, 20),
    hash.slice(20, 32),
  ].join("-");
}

const municipalities = [
  { id: deterministicUUID("lauterbach"), name: "Lauterbach", slug: "lauterbach", password: "lauterbach2026" },
  { id: deterministicUUID("musterstadt"), name: "Musterstadt", slug: "musterstadt", password: "musterstadt2026" },
];

const db = getDb();

for (const m of municipalities) {
  // Prüfe ob schon vorhanden (per slug, da slug UNIQUE ist)
  const existing = db.prepare("SELECT id FROM municipalities WHERE slug = ?").get(m.slug) as { id: string } | undefined;

  if (!existing) {
    db.prepare(
      "INSERT INTO municipalities (id, name, slug, password_hash) VALUES (?, ?, ?, ?)"
    ).run(m.id, m.name, m.slug, hashPassword(m.password));
    console.log(`✅ Seeded: ${m.name} (slug: ${m.slug}, password: ${m.password})`);
  } else {
    console.log(`⏭️  Already exists: ${m.name} (id: ${existing.id})`);
  }
}

console.log("Seeding abgeschlossen.");
process.exit(0);

