import { requireAdmin } from "@/lib/auth";
import { PAGE_DEFAULTS, PAGE_KEYS, PAGES, getSavedPageSeo, getSiteSeo } from "@/lib/seo";
import SiteSeoForm from "@/components/admin/SiteSeoForm";
import PageSeoForm from "@/components/admin/PageSeoForm";

export default async function SeoAdmin() {
  await requireAdmin();
  const site = await getSiteSeo();
  const pages = await Promise.all(PAGE_KEYS.map(async (k) => ({ key: k, saved: await getSavedPageSeo(k) })));
  const siteInfo = { siteName: site.siteName, siteUrl: site.siteUrl, titleTemplate: site.titleTemplate };

  // Quick health checks shown at the top.
  const warnings: string[] = [];
  if (/localhost|127\.0\.0\.1/.test(site.siteUrl)) warnings.push("Site URL is still localhost — set your real domain before going live.");
  if (!site.allowIndexing) warnings.push("Search engines are blocked. Turn indexing on when the site is ready.");
  if (!site.ogImage) warnings.push("No default social share image — links shared on WhatsApp/Instagram won't show a picture.");
  if (!site.googleVerification) warnings.push("Google Search Console isn't verified yet.");

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>SEO</h1>
          <p>Meta titles, descriptions and share images for Google and social media.</p>
        </div>
        <div className="adm-head-links">
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-sm">
            sitemap.xml ↗
          </a>
          <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-sm">
            robots.txt ↗
          </a>
        </div>
      </header>

      {warnings.length > 0 && (
        <ul className="adm-warnings">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      <nav className="adm-tabs" aria-label="SEO sections">
        <a href="#site">Site settings</a>
        {PAGE_KEYS.map((k) => (
          <a key={k} href={`#page-${k}`}>
            {PAGES[k].label}
          </a>
        ))}
        <span className="adm-tabs-note">Blog posts: edit SEO inside each post.</span>
      </nav>

      <section id="site" className="adm-section">
        <h2>Site settings</h2>
        <SiteSeoForm site={site} />
      </section>

      {pages.map(({ key, saved }) => (
        <section key={key} id={`page-${key}`} className="adm-section">
          <h2>
            {PAGES[key].label} <code>{PAGES[key].path}</code>
          </h2>
          <PageSeoForm
            pageKey={key}
            path={PAGES[key].path}
            saved={saved}
            defaults={PAGE_DEFAULTS[key]}
            site={siteInfo}
            siteImage={site.ogImage}
          />
        </section>
      ))}
    </>
  );
}
