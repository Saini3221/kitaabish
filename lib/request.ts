import "server-only";
import { headers } from "next/headers";

/**
 * The visitor's IP address. On Vercel, x-real-ip is set by Vercel's edge from the
 * actual connection and overwrites anything the client sends, so it can't be spoofed.
 * X-Forwarded-For is deliberately ignored: its first entry is client-controlled.
 * Off Vercel (local dev) there is no such header and everyone shares "local".
 */
export async function clientIp() {
  const h = await headers();
  return (h.get("x-real-ip") || "local").trim();
}

/** The string fields of a submitted form, ready for a zod schema. */
export const formFields = (formData: FormData) =>
  Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
