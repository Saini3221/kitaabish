import "server-only";
import { createHash } from "node:crypto";
import { MongoServerError } from "mongodb";
import { getDb } from "./mongodb";
import { clientIp } from "./request";

// Simple fixed-window rate limit for public forms, stored in MongoDB with a TTL index.
type Hit = { key: string; count: number; expiresAt: Date };
let ready: Promise<unknown> | null = null;

export async function clientIpHash() {
  // Store only a hash of the IP, never the raw address.
  return createHash("sha256").update(`kb:${await clientIp()}`).digest("hex").slice(0, 32);
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
  // One atomic update: start a fresh window if there is none (or it expired), otherwise count up.
  // Concurrent requests can't all slip past the limit between a read and a write.
  const update = [
    { $set: { fresh: { $or: [{ $not: ["$expiresAt"] }, { $lte: ["$expiresAt", now] }] } } },
    {
      $set: {
        count: { $cond: ["$fresh", 1, { $add: ["$count", 1] }] },
        expiresAt: { $cond: ["$fresh", new Date(now.getTime() + windowMinutes * 60_000), "$expiresAt"] },
      },
    },
    { $unset: "fresh" },
  ];
  for (let attempt = 0; ; attempt++) {
    try {
      const hit = await col.findOneAndUpdate({ key }, update, { upsert: true, returnDocument: "after" });
      return (hit?.count ?? 1) <= max;
    } catch (err) {
      // Two first-time requests raced to insert the same key; the retry updates the winner's doc.
      if (attempt === 0 && err instanceof MongoServerError && err.code === 11000) continue;
      throw err;
    }
  }
}
