/**
 * Seed-Skript: Legt vordefinierte Kommunen an.
 * Ausführen mit: npx tsx src/lib/seed.ts
 */
import { randomBytes, scryptSync } from "crypto";
import { randomUUID } from "crypto";
import getDb from "./db";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const municipalities = [
  { id: randomUUID(), name: "Lauterbach", slug: "lauterbach", password: "lauterbach2026" },
  { id: randomUUID(), name: "Musterstadt", slug: "musterstadt", password: "musterstadt2026" },
];

const db = getDb();

const insert = db.prepare(
  "INSERT OR IGNORE INTO municipalities (id, name, slug, password_hash) VALUES (?, ?, ?, ?)"
);

for (const m of municipalities) {
  insert.run(m.id, m.name, m.slug, hashPassword(m.password));
  console.log(`✅ Seeded: ${m.name} (slug: ${m.slug}, password: ${m.password})`);
}

console.log("Seeding abgeschlossen.");
process.exit(0);

