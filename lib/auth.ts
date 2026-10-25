import "server-only";
import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "./mongodb";
import { clientIp } from "./request";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number, opts: object) => Promise<Buffer>;

export const SESSION_COOKIE = "kb_admin_session";
const SESSION_HOURS = 8;
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

type Admin = { email: string; passwordHash: string; name?: string };
type Session = { tokenHash: string; email: string; createdAt: Date; expiresAt: Date; ip: string };
type Attempt = { key: string; count: number; expiresAt: Date };

// ---------- Password hashing (scrypt) ----------
// Format: scrypt$N$r$p$saltB64$hashB64 — the same format scripts/create-admin.mjs writes.
const PARAMS = { N: 16384, r: 8, p: 1 };

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, N, r, p, saltB64, hashB64] = stored.split("$");
  if (algo !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length, {
    N: Number(N),
    r: Number(r),
    p: Number(p),
    maxmem: 64 * 1024 * 1024,
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Used when the email doesn't exist, so failed logins take the same time either way.
const DUMMY_HASH = `scrypt$${PARAMS.N}$${PARAMS.r}$${PARAMS.p}$${randomBytes(16).toString("base64")}$${randomBytes(64).toString("base64")}`;

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

let indexesReady: Promise<unknown> | null = null;
async function collections() {
  const db = await getDb();
  const admins = db.collection<Admin>("admins");
  const sessions = db.collection<Session>("admin_sessions");
  const attempts = db.collection<Attempt>("admin_login_attempts");
  // TTL indexes make MongoDB delete expired sessions and lockouts on its own.
  indexesReady ??= Promise.all([
    admins.createIndex({ email: 1 }, { unique: true }),
    sessions.createIndex({ tokenHash: 1 }, { unique: true }),
    sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    attempts.createIndex({ key: 1 }, { unique: true }),
    attempts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);
  await indexesReady;
  return { admins, sessions, attempts };
}

// ---------- Login / logout ----------
export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(emailRaw: string, password: string): Promise<LoginResult> {
  const email = emailRaw.trim().toLowerCase();
  const ip = await clientIp();
  const { admins, sessions, attempts } = await collections();

  // Throttle per IP+email and per IP, so one address can't brute-force many accounts.
  const keys = [`${ip}|${email}`, `${ip}|*`];
  const existing = await attempts.find({ key: { $in: keys }, expiresAt: { $gt: new Date() } }).toArray();
  if (existing.some((a) => a.count >= (a.key.endsWith("|*") ? MAX_ATTEMPTS * 4 : MAX_ATTEMPTS))) {
    return { ok: false, error: `Too many attempts. Please try again in ${LOCK_MINUTES} minutes.` };
  }

  const admin = await admins.findOne({ email });
  const valid = await verifyPassword(password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !valid) {
    const expiresAt = new Date(Date.now() + LOCK_MINUTES * 60_000);
    await Promise.all(
      keys.map((key) => attempts.updateOne({ key }, { $inc: { count: 1 }, $set: { expiresAt } }, { upsert: true })),
    );
    return { ok: false, error: "Invalid email or password." };
  }

  await attempts.deleteOne({ key: keys[0] });

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 3_600_000);
  await sessions.insertOne({ tokenHash: sha256(token), email, createdAt: new Date(), expiresAt, ip });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
  return { ok: true };
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const { sessions } = await collections();
    await sessions.deleteOne({ tokenHash: sha256(token) });
  }
  jar.delete(SESSION_COOKIE);
}

// ---------- Session checks ----------
// cache(): one DB lookup per request even if several components ask.
export const getAdmin = cache(async (): Promise<{ email: string } | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  try {
    const { sessions } = await collections();
    const s = await sessions.findOne({ tokenHash: sha256(token), expiresAt: { $gt: new Date() } });
    return s ? { email: s.email } : null;
  } catch {
    return null;
  }
});

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
