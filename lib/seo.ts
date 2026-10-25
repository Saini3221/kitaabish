import "server-only";
import { cache } from "react";
import type { Metadata } from "next";
import { getDb } from "./mongodb";

// ---------- Types & defaults ----------
export type SiteSeo = {
  siteName: string;
  siteUrl: string;
  titleTemplate: string;
  defaultTitle: string;
  defaultDescription: string;
  keywords: string[];
  ogImage: string;
  twitterHandle: string;
  googleVerification: string;
  bingVerification: string;
  allowIndexing: boolean;
};

export type PageSeo = { title: string; description: string; keywords: string[]; ogImage: string; noindex: boolean };

export const PAGE_KEYS = ["home", "about", "services", "portfolio", "blog", "contact"] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

export const PAGES: Record<PageKey, { label: string; path: string }> = {
  home: { label: "Home page", path: "/" },
  about: { label: "About", path: "/about" },
  services: { label: "Services", path: "/services" },
  portfolio: { label: "Portfolio", path: "/portfolio" },
  blog: { label: "Journal (blog list)", path: "/blog" },
  contact: { label: "Contact", path: "/contact" },
};

export const SITE_DEFAULTS: SiteSeo = {
  siteName: "Kitaabish",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  titleTemplate: "%s | Kitaabish",
  defaultTitle: "Kitaabish | Professional Book Writing Services",
  defaultDescription:
    "Ghostwriting, editing, formatting, cover design, publishing and marketing — Kitaabish handles the entire spectrum of book creation.",
  keywords: ["book writing services", "ghostwriting", "book editing", "self publishing", "book marketing"],
  ogImage: "",
  twitterHandle: "",
  googleVerification: "",
  bingVerification: "",
  allowIndexing: true,
};

export const PAGE_DEFAULTS: Record<PageKey, PageSeo> = {
  home: {
    title: "Kitaabish | Professional Book Writing Services",
    description: SITE_DEFAULTS.defaultDescription,
    keywords: [],
    ogImage: "",
    noindex: false,
  },
  about: {
    title: "About Us — Book Marketing Agency in India",
    description:
      "Kitaabish is a book marketing agency in India helping authors promote their books and readers discover stories beyond what's trending.",
    keywords: ["book marketing agency in India", "book marketing services in India", "book promotion", "Hindi literature"],
    ogImage: "",
    noindex: false,
  },
  services: {
    title: "Book Writing & Publishing Services",
    description:
      "Ghostwriting, editing, formatting, cover design, publishing, marketing, audiobooks and author websites — every chapter of your book, handled.",
    keywords: [],
    ogImage: "",
    noindex: false,
  },
  portfolio: {
    title: "Portfolio — Books We've Brought to Life",
    description: "Browse the library of books Kitaabish has written, edited, designed and published with our authors.",
    keywords: [],
    ogImage: "",
    noindex: false,
  },
  blog: {
    title: "The Kitaabish Journal",
    description: "Writing tips, publishing guides and honest advice from the people who make books for a living.",
    keywords: [],
    ogImage: "",
    noindex: false,
  },
  contact: {
    title: "Contact Us — Talk to a Book Marketing Agency",
    description:
      "Planning a book launch or need help promoting your book? Message Kitaabish on WhatsApp, Instagram or through our contact form.",
    keywords: ["contact book marketing agency", "book promotion India", "book launch help"],
    ogImage: "",
    noindex: false,
  },
};

type SeoDoc = { _id: string } & Partial<SiteSeo & PageSeo>;
const seoCol = async () => (await getDb()).collection<SeoDoc>("seo");

// Saved values override defaults; empty strings fall back to the default.
function merge<T extends object>(defaults: T, saved: Partial<T> | null): T {
  const out = { ...defaults };
  if (!saved) return out;
  for (const k of Object.keys(defaults) as (keyof T)[]) {
    const v = saved[k];
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v as T[keyof T];
  }
  return out;
}

export const getSiteSeo = cache(async (): Promise<SiteSeo> => {
  try {
    const doc = await (await seoCol()).findOne({ _id: "site" });
    const site = merge(SITE_DEFAULTS, doc as Partial<SiteSeo> | null);
    new URL(site.siteUrl); // guard against a broken saved URL
    return site;
  } catch {
    return SITE_DEFAULTS;
  }
});

/** Raw saved page values (for the admin form), without defaults filled in. */
export async function getSavedPageSeo(key: PageKey): Promise<Partial<PageSeo>> {
  try {
    const { _id, ...rest } = (await (await seoCol()).findOne({ _id: `page:${key}` })) ?? { _id: "" };
    void _id;
    return rest;
  } catch {
    return {};
  }
}

export const getPageSeo = cache(async (key: PageKey): Promise<PageSeo> => {
  return merge(PAGE_DEFAULTS[key], await getSavedPageSeo(key));
});

export const absoluteUrl = (site: SiteSeo, path: string) =>
  path.startsWith("http") ? path : `${site.siteUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

// ---------- Metadata builders ----------
export async function rootMetadata(): Promise<Metadata> {
  const site = await getSiteSeo();
  const images = site.ogImage ? [site.ogImage] : undefined;
  return {
    metadataBase: new URL(site.siteUrl),
    applicationName: site.siteName,
    title: { default: site.defaultTitle, template: site.titleTemplate },
    description: site.defaultDescription,
    keywords: site.keywords,
    icons: { icon: "/logo-1.png" },
    robots: site.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
    verification: {
      google: site.googleVerification || undefined,
      other: site.bingVerification ? { "msvalidate.01": site.bingVerification } : undefined,
    },
    openGraph: { siteName: site.siteName, type: "website", locale: "en_IN", images },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      site: site.twitterHandle || undefined,
      images,
    },
  };
}

export async function pageMetadata(key: PageKey): Promise<Metadata> {
  const [site, page] = await Promise.all([getSiteSeo(), getPageSeo(key)]);
  const { path } = PAGES[key];
  const og = page.ogImage || site.ogImage;
  const images = og ? [og] : undefined;
  return {
    // Home uses its title as-is; other pages go through the "%s | Kitaabish" template.
    title: key === "home" ? { absolute: page.title } : page.title,
    description: page.description,
    keywords: page.keywords.length ? page.keywords : site.keywords,
    alternates: { canonical: path },
    robots: page.noindex || !site.allowIndexing ? { index: false, follow: false } : undefined,
    openGraph: { title: page.title, description: page.description, url: path, siteName: site.siteName, type: "website", images },
    twitter: { card: images ? "summary_large_image" : "summary", title: page.title, description: page.description, images },
  };
}

/** Safe JSON-LD: escapes "<" so content can never close the script tag. */
export const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
