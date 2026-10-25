"use server";

import { revalidatePath } from "next/cache";
import { MongoServerError } from "mongodb";
import { getGiveaway, giveawayCollections, statusOf } from "@/lib/giveaways";
import { allow, clientIpHash } from "@/lib/rate-limit";
import { entrySchema, subscribeSchema, toFormState, type FormState } from "@/lib/validation";

let indexesReady: Promise<unknown> | null = null;
async function ensureIndexes() {
  const { entries, subscribers } = await giveawayCollections();
  indexesReady ??= Promise.all([
    entries.createIndex({ giveawaySlug: 1, email: 1 }, { unique: true }),
    subscribers.createIndex({ email: 1 }, { unique: true, partialFilterExpression: { email: { $gt: "" } } }),
    subscribers.createIndex({ whatsapp: 1 }, { unique: true, partialFilterExpression: { whatsapp: { $gt: "" } } }),
  ]);
  await indexesReady;
}

const fields = (formData: FormData) =>
  Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;

// Bots fill every field; humans never see the hidden "website" field.
const isBot = (formData: FormData) => String(formData.get("website") ?? "").length > 0;

export async function enterGiveaway(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { success: "You're in!" };
  if (!(await allow("giveaway-entry", 8, 60))) {
    return { error: "Too many entries from your network. Please try again in an hour." };
  }

  const parsed = entrySchema.safeParse(fields(formData));
  if (!parsed.success) return toFormState(parsed.error);
  const { slug, name, email, whatsapp, instagram } = parsed.data;

  const giveaway = await getGiveaway(slug);
  if (!giveaway) return { error: "This giveaway doesn't exist." };
  const status = statusOf(giveaway);
  if (status !== "live") {
    return { error: status === "upcoming" ? "This giveaway hasn't started yet." : "This giveaway has ended." };
  }

  await ensureIndexes();
  const { entries } = await giveawayCollections();
  try {
    await entries.insertOne({ giveawaySlug: slug, name, email, whatsapp, instagram, ipHash: await clientIpHash(), createdAt: new Date() });
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      return { error: "You're already entered with this email. Good luck! 🍀" };
    }
    throw err;
  }

  revalidatePath(`/giveaways/${slug}`);
  revalidatePath("/giveaways");
  return { success: `You're in, ${name.split(" ")[0]}! 🎉 We'll announce the winner here and on Instagram.` };
}

export async function subscribeUpdates(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { success: "Subscribed!" };
  if (!(await allow("giveaway-subscribe", 5, 60))) {
    return { error: "Too many requests. Please try again in an hour." };
  }

  const parsed = subscribeSchema.safeParse(fields(formData));
  if (!parsed.success) return toFormState(parsed.error);
  const { name, email, whatsapp } = parsed.data;

  await ensureIndexes();
  const { subscribers } = await giveawayCollections();
  const filter = email ? { email } : { whatsapp };
  try {
    await subscribers.updateOne(
      filter,
      { $set: { name, email, whatsapp, source: "giveaways" }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
  } catch (err) {
    // The WhatsApp number is already registered under another email — that's fine.
    if (!(err instanceof MongoServerError && err.code === 11000)) throw err;
  }
  return { success: "You're on the list! We'll let you know as soon as the next giveaway goes live. 🎁" };
}
