import type { MetadataRoute } from "next";
import { getDb } from "@/lib/mongodb";
import { getPublicGiveaways } from "@/lib/giveaways";
import { PAGE_KEYS, PAGES, absoluteUrl, getPageSeo, getSiteSeo } from "@/lib/seo";

// /sitemap.xml — built from the database; pages and posts marked "noindex" are left out.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSiteSeo();
  if (!site.allowIndexing) return [];

  const pages = await Promise.all(PAGE_KEYS.map(async (k) => ({ k, seo: await getPageSeo(k) })));
  const entries: MetadataRoute.Sitemap = pages
    .filter((p) => !p.seo.noindex)
    .map((p) => ({
      url: absoluteUrl(site, PAGES[p.k].path),
      changeFrequency: p.k === "blog" ? "weekly" : "monthly",
      priority: p.k === "home" ? 1 : 0.8,
    }));

  try {
    const posts = await (await getDb())
      .collection<{ slug: string; publishedAt: Date; updatedAt?: Date; seo?: { noindex?: boolean } }>("posts")
      .find({ "seo.noindex": { $ne: true } }, { projection: { _id: 0, slug: 1, publishedAt: 1, updatedAt: 1 } })
      .toArray();
    for (const p of posts) {
      entries.push({
        url: absoluteUrl(site, `/blog/${p.slug}`),
        lastModified: p.updatedAt ?? p.publishedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // Database unavailable: still return the static pages.
  }

  entries.push({ url: absoluteUrl(site, "/giveaways"), changeFrequency: "daily", priority: 0.7 });
  for (const g of await getPublicGiveaways()) {
    entries.push({ url: absoluteUrl(site, `/giveaways/${g.slug}`), changeFrequency: "daily", priority: 0.5 });
  }
  return entries;
}
