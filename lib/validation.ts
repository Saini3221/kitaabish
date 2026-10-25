import { z } from "zod";
import { isArtId } from "./artworks";
import { CONTACT_TOPICS } from "./contact";

// Server-side validation for every admin form. Never trust the browser.

const hex = z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex colour like #2c2690");
const text = (max: number, label: string) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} must be under ${max} characters`);
const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
const list = (max: number) =>
  z
    .string()
    .trim()
    .max(1000)
    .transform((s) =>
      s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .slice(0, max),
    );
const int = (min: number, max: number, label: string) =>
  z.coerce.number({ invalid_type_error: `${label} must be a number` }).int().min(min).max(max);
const checkbox = z
  .string()
  .optional()
  .transform((v) => v === "on");

const cover = {
  c1: hex,
  c2: hex,
  fg: hex,
  art: z.string().refine((v) => isArtId(v), "Pick an artwork from the list"),
};

export const readSchema = z.object({
  title: text(120, "Title"),
  author: text(120, "Author"),
  genre: text(60, "Genre"),
  note: text(200, "Note"),
  order: int(0, 9999, "Order"),
  ...cover,
});

export const portfolioSchema = z.object({
  title: text(120, "Title"),
  author: text(120, "Author"),
  genre: text(60, "Genre"),
  year: int(1900, 2100, "Year"),
  pages: int(1, 5000, "Pages"),
  formats: list(10),
  services: list(12),
  blurb: text(800, "Blurb"),
  quote: optionalText(300),
  featured: checkbox,
  order: int(0, 9999, "Order"),
  ...cover,
});

// ---------- SEO ----------
const isHttps = (v: string) => {
  try {
    return new URL(v).protocol === "https:";
  } catch {
    return false;
  }
};
const httpsUrlOptional = z
  .string()
  .trim()
  .max(500)
  .optional()
  .default("")
  .refine((v) => v === "" || isHttps(v), "Must be a full https:// image URL");
// Accept either the bare code or the whole <meta … content="CODE"> tag the console gives you.
const verification = z
  .string()
  .trim()
  .max(300)
  .optional()
  .default("")
  .transform((v) => v.match(/content=["']([^"']+)["']/)?.[1] ?? v)
  .refine((v) => /^[\w\-=]*$/.test(v), "Paste the verification code (or the whole meta tag)");

export const siteSeoSchema = z.object({
  siteName: text(60, "Site name"),
  siteUrl: z
    .string()
    .trim()
    .max(200)
    .refine((v) => {
      try {
        const u = new URL(v);
        return (u.protocol === "https:" || u.protocol === "http:") && (u.pathname === "/" || u.pathname === "");
      } catch {
        return false;
      }
    }, "Enter the site address only, e.g. https://kitaabish.com")
    .transform((v) => v.replace(/\/$/, "")),
  titleTemplate: z
    .string()
    .trim()
    .max(80)
    .refine((v) => v.includes("%s"), "Must contain %s where the page title goes, e.g. %s | Kitaabish"),
  defaultTitle: text(70, "Default title"),
  defaultDescription: text(200, "Default description"),
  keywords: list(20),
  ogImage: httpsUrlOptional,
  twitterHandle: z
    .string()
    .trim()
    .max(16)
    .optional()
    .default("")
    .refine((v) => v === "" || /^@?\w{1,15}$/.test(v), "e.g. @kitaabish")
    .transform((v) => (v && !v.startsWith("@") ? `@${v}` : v)),
  googleVerification: verification,
  bingVerification: verification,
  allowIndexing: checkbox,
});

export const pageSeoSchema = z.object({
  key: z.enum(["home", "about", "services", "portfolio", "blog", "contact"]),
  title: optionalText(70),
  description: optionalText(200),
  keywords: list(20),
  ogImage: httpsUrlOptional,
  noindex: checkbox,
});

const postSeo = {
  seoTitle: optionalText(70),
  seoDescription: optionalText(200),
  seoKeywords: list(20),
  seoOgImage: httpsUrlOptional,
  seoCanonical: z
    .string()
    .trim()
    .max(500)
    .optional()
    .default("")
    .refine((v) => v === "" || isHttps(v), "Canonical must be a full https:// URL (leave empty for this page)"),
  seoNoindex: checkbox,
};

export const postSchema = z.object({
  ...postSeo,
  title: text(160, "Title"),
  excerpt: text(400, "Excerpt"),
  category: text(40, "Category"),
  tags: list(10),
  authorName: text(80, "Author name"),
  authorRole: optionalText(120),
  publishedAt: z.coerce.date({ invalid_type_error: "Pick a publish date" }),
  coverUrl: z
    .string()
    .trim()
    .url("Cover must be a valid URL")
    .refine((u) => {
      try {
        const url = new URL(u);
        return url.protocol === "https:" && url.hostname === "images.unsplash.com";
      } catch {
        return false;
      }
    }, "Cover image must be an https://images.unsplash.com/… URL")
    // Store the bare photo URL; the site adds its own size parameters.
    .transform((u) => u.split("?")[0]),
  coverAlt: text(160, "Cover description"),
  coverCredit: optionalText(80),
  featured: checkbox,
  body: z.string().max(60_000, "Post is too long").refine((s) => s.trim().length > 0, "Write the post body"),
});

// ---------- Giveaways ----------
const unsplashUrl = z
  .string()
  .trim()
  .url("Image must be a valid URL")
  .refine((u) => {
    try {
      const url = new URL(u);
      return url.protocol === "https:" && url.hostname === "images.unsplash.com";
    } catch {
      return false;
    }
  }, "Image must be an https://images.unsplash.com/… URL")
  .transform((u) => u.split("?")[0]);

// <input type="datetime-local"> gives "2026-11-01T18:00" — interpret it as India time.
const istDateTime = (label: string) =>
  z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, `Pick a ${label} date and time`)
    .transform((v) => new Date(`${v}:00+05:30`));

export const giveawaySchema = z
  .object({
    title: text(120, "Title"),
    prize: text(160, "Prize"),
    summary: text(240, "Summary"),
    description: text(3000, "Description"),
    rules: z
      .string()
      .max(3000)
      .transform((s) =>
        s
          .split("\n")
          .map((l) => l.replace(/^[-•*]\s*/, "").trim())
          .filter(Boolean)
          .slice(0, 15),
      )
      .refine((r) => r.every((l) => l.length <= 200), "Keep each rule under 200 characters"),
    imageUrl: unsplashUrl,
    imageAlt: text(160, "Image description"),
    startsAt: istDateTime("start"),
    endsAt: istDateTime("end"),
    published: checkbox,
    winnerName: optionalText(80),
    winnerNote: optionalText(200),
  })
  .superRefine((d, ctx) => {
    if (d.endsAt <= d.startsAt) ctx.addIssue({ code: "custom", path: ["endsAt"], message: "End must be after the start" });
  });

const email = z.string().trim().toLowerCase().max(200).email("Enter a valid email address");
const whatsapp = z
  .string()
  .trim()
  .max(25)
  .optional()
  .default("")
  .transform((v) => v.replace(/[\s()+-]/g, ""))
  .refine((v) => v === "" || /^\d{10,15}$/.test(v), "Enter a valid WhatsApp number with country code, e.g. 91 98765 43210");
const instagram = z
  .string()
  .trim()
  .max(31)
  .optional()
  .default("")
  .transform((v) => v.replace(/^@/, ""))
  .refine((v) => v === "" || /^[A-Za-z0-9._]{1,30}$/.test(v), "Enter a valid Instagram username");
const consent = z.literal("on", { errorMap: () => ({ message: "Please tick the box to continue" }) });

export const entrySchema = z.object({
  slug: z.string().refine((s) => isSlug(s), "Invalid giveaway"),
  name: text(80, "Name"),
  email,
  whatsapp,
  instagram,
  consent,
});

export const subscribeSchema = z
  .object({
    name: optionalText(80),
    email: z.string().trim().toLowerCase().max(200).optional().default(""),
    whatsapp,
    consent,
  })
  .superRefine((d, ctx) => {
    if (!d.email && !d.whatsapp) ctx.addIssue({ code: "custom", path: ["email"], message: "Add your email or WhatsApp number" });
    if (d.email && !z.string().email().safeParse(d.email).success)
      ctx.addIssue({ code: "custom", path: ["email"], message: "Enter a valid email address" });
  });

// ---------- Contact ----------
export const contactSchema = z
  .object({
    name: text(80, "Name"),
    email: z.string().trim().toLowerCase().max(200).optional().default(""),
    whatsapp,
    topic: z.enum(CONTACT_TOPICS, { errorMap: () => ({ message: "Pick what this is about" }) }),
    bookTitle: optionalText(160),
    message: text(3000, "Message"),
  })
  .superRefine((d, ctx) => {
    if (!d.email && !d.whatsapp) ctx.addIssue({ code: "custom", path: ["email"], message: "Add your email or WhatsApp number" });
    if (d.email && !z.string().email().safeParse(d.email).success)
      ctx.addIssue({ code: "custom", path: ["email"], message: "Enter a valid email address" });
  });

export type FormState ={ error?: string; success?: string; fieldErrors?: Record<string, string> } | undefined;

export function toFormState(err: z.ZodError): FormState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return { error: "Please fix the highlighted fields.", fieldErrors };
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "item";

// Only allow slugs we generate ourselves when they come back from the browser.
export const isSlug = (s: unknown): s is string => typeof s === "string" && /^[a-z0-9-]{1,80}$/.test(s);
