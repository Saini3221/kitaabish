import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getDb } from "./mongodb";

// Simple fixed-window rate limit for public forms, stored in MongoDB with a TTL index.
type Hit = { key: string; count: number; expiresAt: Date };
let ready: Promise<unknown> | null = null;

export async function clientIpHash() {
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "local").trim();
  // Store only a hash of the IP, never the raw address.
  return createHash("sha256").update(`kb:${ip}`).digest("hex").slice(0, 32);
}

/** Returns false once `key` has been used more than `max` times in `windowMinutes`. */
export async function allow(action: string, max: number, windowMinutes: number): Promise<boolean> {
  const col = (await getDb()).collection<Hit>("public_rate_limits");
  ready ??= Promise.all([
    col.createIndex({ key: 1 }, { unique: true }),
    col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);
  await ready;
  const key = `${action}|${await clientIpHash()}`;
  const now = new Date();
  const existing = await col.findOne({ key, expiresAt: { $gt: now } });
  if (!existing) {
    await col.updateOne(
      { key },
      { $set: { count: 1, expiresAt: new Date(now.getTime() + windowMinutes * 60_000) } },
      { upsert: true },
    );
    return true;
  }
  if (existing.count >= max) return false;
  await col.updateOne({ key }, { $inc: { count: 1 } });
  return true;
}
