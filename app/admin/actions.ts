"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ObjectId, type Collection, type Document } from "mongodb";
import { login, logout, requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { markupToBlocks, wordCount } from "@/lib/markup";
import {
  isSlug,
  pageSeoSchema,
  portfolioSchema,
  postSchema,
  readSchema,
  siteSeoSchema,
  slugify,
  toFormState,
  type FormState,
} from "@/lib/validation";
import { PAGES } from "@/lib/seo";
import { randomInt } from "node:crypto";
import { getGiveaway, giveawayCollections, publicName } from "@/lib/giveaways";
import { giveawaySchema } from "@/lib/validation";
import { messagesCollection } from "@/lib/messages";

// ---------- Auth ----------
export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").slice(0, 200);
  const password = String(formData.get("password") ?? "").slice(0, 500);
  if (!email || !password) return { error: "Enter your email and password." };
  const res = await login(email, password);
  if (!res.ok) return { error: res.error };
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

// ---------- Helpers ----------
async function uniqueSlug(col: Collection<Document>, title: string) {
  const base = slugify(title);
  // "new" is reserved for the admin's /new pages.
  let slug = base === "new" ? "new-1" : base;
  for (let i = 2; await col.findOne({ slug }, { projection: { _id: 1 } }); i++) slug = `${base}-${i}`;
  return slug;
}

const fields = (formData: FormData) =>
  Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;

/** Shared create/update flow: originalSlug present = edit, absent = create. */
async function upsert(
  collection: string,
  formData: FormData,
  doc: Document,
  title: string,
  extra?: (slug: string) => Promise<void>,
): Promise<FormState> {
  const admin = await requireAdmin();
  const col = (await getDb()).collection(collection);
  const original = formData.get("originalSlug");
  const stamp = { updatedAt: new Date(), updatedBy: admin.email };

  if (original) {
    if (!isSlug(original)) return { error: "Invalid item." };
    const res = await col.updateOne({ slug: original }, { $set: { ...doc, ...stamp } });
    if (res.matchedCount === 0) return { error: "This item no longer exists." };
    await extra?.(original);
  } else {
    const slug = await uniqueSlug(col, title);
    await col.insertOne({ ...doc, slug, createdAt: new Date(), ...stamp });
    await extra?.(slug);
  }
  return undefined;
}

async function remove(collection: string, slug: unknown) {
  await requireAdmin();
  if (!isSlug(slug)) return;
  await (await getDb()).collection(collection).deleteOne({ slug });
}

// ---------- Recommended reads ----------
export async function saveRead(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = readSchema.safeParse(fields(formData));
  if (!parsed.success) return toFormState(parsed.error);
  const { c1, c2, fg, art, ...rest } = parsed.data;
  const res = await upsert("reads", formData, { ...rest, cover: { c1, c2, fg, art } }, rest.title);
  if (res) return res;
  revalidatePath("/");
  redirect("/admin/reads?saved=1");
}

export async function deleteRead(slug: string) {
  await remove("reads", slug);
  revalidatePath("/");
  redirect("/admin/reads?deleted=1");
}

// ---------- Portfolio ----------
export async function savePortfolio(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = portfolioSchema.safeParse(fields(formData));
  if (!parsed.success) return toFormState(parsed.error);
  const { c1, c2, fg, art, ...rest } = parsed.data;
  const res = await upsert("portfolio", formData, { ...rest, cover: { c1, c2, fg, art } }, rest.title);
  if (res) return res;
  revalidatePath("/portfolio");
  revalidatePath("/");
  redirect("/admin/portfolio?saved=1");
}

export async function deletePortfolio(slug: string) {
  await remove("portfolio", slug);
  revalidatePath("/portfolio");
  revalidatePath("/");
  redirect("/admin/portfolio?deleted=1");
}

// ---------- Blog posts ----------
export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = postSchema.safeParse(fields(formData));
  if (!parsed.success) return toFormState(parsed.error);
  const d = parsed.data;
  const content = markupToBlocks(d.body);
  if (content.length === 0) return { error: "Please fix the highlighted fields.", fieldErrors: { body: "Write the post body" } };

  const doc = {
    title: d.title,
    excerpt: d.excerpt,
    category: d.category,
    tags: d.tags,
    author: { name: d.authorName, role: d.authorRole },
    publishedAt: d.publishedAt,
    readingTime: Math.max(1, Math.ceil(wordCount(content) / 220)),
    cover: { url: d.coverUrl, alt: d.coverAlt, credit: d.coverCredit || "Unsplash" },
    featured: d.featured,
    content,
    seo: {
      title: d.seoTitle,
      description: d.seoDescription,
      keywords: d.seoKeywords,
      ogImage: d.seoOgImage,
      canonical: d.seoCanonical,
      noindex: d.seoNoindex,
    },
  };

  const res = await upsert("posts", formData, doc, d.title, async (slug) => {
    // Only one featured story at a time.
    if (d.featured) {
      await (await getDb()).collection("posts").updateMany({ slug: { $ne: slug } }, { $set: { featured: false } });
    }
  });
  if (res) return res;
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/");
  redirect("/admin/posts?saved=1");
}

// ---------- Giveaways ----------
const revalidateGiveaways = () => {
  // The live-giveaway bar appears on every page, so refresh the whole site.
  revalidatePath("/", "layout");
};

export async function saveGiveaway(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = giveawaySchema.safeParse(fields(formData));
  if (!parsed.success) return toFormState(parsed.error);
  const d = parsed.data;

  const original = formData.get("originalSlug");
  const existing = isSlug(original) ? await getGiveaway(original, true) : null;
  const winner = d.winnerName
    ? {
        name: d.winnerName,
        note: d.winnerNote,
        announcedAt: existing?.winner?.announcedAt ? new Date(existing.winner.announcedAt) : new Date(),
      }
    : null;

  const doc = {
    title: d.title,
    prize: d.prize,
    summary: d.summary,
    description: d.description,
    rules: d.rules,
    image: { url: d.imageUrl, alt: d.imageAlt },
    startsAt: d.startsAt,
    endsAt: d.endsAt,
    published: d.published,
    winner,
  };
  const res = await upsert("giveaways", formData, doc, d.title);
  if (res) return res;
  revalidateGiveaways();
  redirect("/admin/giveaways?saved=1");
}

export async function deleteGiveaway(slug: string) {
  await remove("giveaways", slug);
  if (isSlug(slug)) {
    const { entries } = await giveawayCollections();
    await entries.deleteMany({ giveawaySlug: slug });
  }
  revalidateGiveaways();
  redirect("/admin/giveaways?deleted=1");
}

/** Pick a winner uniformly at random (crypto RNG) from all entries of an ended giveaway. */
export async function pickWinner(slug: string) {
  await requireAdmin();
  if (!isSlug(slug)) return;
  const g = await getGiveaway(slug, true);
  if (!g) redirect("/admin/giveaways");
  if (g.status !== "ended") redirect(`/admin/giveaways/${slug}?error=notended`);

  const { giveaways, entries } = await giveawayCollections();
  const n = await entries.countDocuments({ giveawaySlug: slug });
  if (n === 0) redirect(`/admin/giveaways/${slug}?error=noentries`);

  const [entry] = await entries
    .find({ giveawaySlug: slug })
    .sort({ createdAt: 1, _id: 1 })
    .skip(randomInt(n))
    .limit(1)
    .toArray();

  await giveaways.updateOne(
    { slug },
    {
      $set: {
        winner: { name: publicName(entry.name), note: "", announcedAt: new Date() },
        // Private: who actually won, so you can contact them. Never shown publicly.
        winnerEntry: {
          name: entry.name,
          email: entry.email,
          whatsapp: entry.whatsapp,
          instagram: entry.instagram,
          pickedAt: new Date(),
          poolSize: n,
        },
      },
    },
  );
  revalidateGiveaways();
  redirect(`/admin/giveaways/${slug}?picked=1`);
}

// ---------- SEO ----------
type SeoDoc = { _id: string };

export async function saveSiteSeo(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = siteSeoSchema.safeParse(fields(formData));
  if (!parsed.success) return toFormState(parsed.error);
  await (await getDb())
    .collection<SeoDoc>("seo")
    .updateOne({ _id: "site" }, { $set: { ...parsed.data, updatedAt: new Date(), updatedBy: admin.email } }, { upsert: true });
  // Site settings affect every page's <head>, the sitemap and robots.txt.
  revalidatePath("/", "layout");
  return { success: "Site SEO saved — every page has been updated." };
}

export async function savePageSeo(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = pageSeoSchema.safeParse(fields(formData));
  if (!parsed.success) return toFormState(parsed.error);
  const { key, ...seo } = parsed.data;
  await (await getDb())
    .collection<SeoDoc>("seo")
    .updateOne({ _id: `page:${key}` }, { $set: { ...seo, updatedAt: new Date(), updatedBy: admin.email } }, { upsert: true });
  revalidatePath(PAGES[key].path);
  revalidatePath("/sitemap.xml");
  return { success: `${PAGES[key].label} SEO saved.` };
}

export async function deletePost(slug: string) {
  await remove("posts", slug);
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/");
  redirect("/admin/posts?deleted=1");
}

// ---------- Contact messages ----------
const messageId = (id: string) => (/^[a-f0-9]{24}$/.test(id) ? new ObjectId(id) : null);

export async function toggleMessageRead(id: string, read: boolean) {
  await requireAdmin();
  const _id = messageId(id);
  if (_id) await (await messagesCollection()).updateOne({ _id }, { $set: { read } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  const _id = messageId(id);
  if (_id) await (await messagesCollection()).deleteOne({ _id });
  redirect("/admin/messages?deleted=1");
}
