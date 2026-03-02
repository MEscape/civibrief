import { scryptSync, timingSafeEqual } from "crypto";
import getDb from "@/lib/db";
import type { Municipality } from "./types";

export function findBySlug(slug: string): Municipality | undefined {
  const db = getDb();
  return db
    .prepare("SELECT * FROM municipalities WHERE slug = ?")
    .get(slug) as Municipality | undefined;
}

export function findById(id: string): Municipality | undefined {
  const db = getDb();
  return db
    .prepare("SELECT id, name, slug FROM municipalities WHERE id = ?")
    .get(id) as Municipality | undefined;
}

export function verifyPassword(plaintext: string, hash: string): boolean {
  try {
    const [salt, storedHash] = hash.split(":");
    const derivedHash = scryptSync(plaintext, salt, 64).toString("hex");
    return timingSafeEqual(Buffer.from(derivedHash), Buffer.from(storedHash));
  } catch {
    return false;
  }
}

