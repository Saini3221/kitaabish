import type { MetadataRoute } from "next";
import { absoluteUrl, getSiteSeo } from "@/lib/seo";

// /robots.txt — follows the "Allow search engines" switch in Admin → SEO. Admin is never crawled.
export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteSeo();
  if (!site.allowIndexing) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/admin/"] },
    sitemap: absoluteUrl(site, "/sitemap.xml"),
    host: site.siteUrl,
  };
}
