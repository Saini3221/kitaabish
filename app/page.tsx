import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import StatsRibbons from "@/components/StatsRibbons";
import AboutKitaabish from "@/components/AboutKitaabish";
import HomeShelf from "@/components/HomeShelf";
import Journey from "@/components/Journey";
import Reviews from "@/components/Reviews";
import PostCard from "@/components/PostCard";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BackgroundBoxes from "@/components/BackgroundBoxes";
import { getReads } from "@/lib/reads";
import { getPosts } from "@/lib/blog";
import { absoluteUrl, getSiteSeo, jsonLd, pageMetadata } from "@/lib/seo";
import { INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/lib/contact";
import { getSpotlightGiveaway } from "@/lib/giveaways";
import GiveawayTicket from "@/components/giveaways/GiveawayTicket";
import "./giveaways/giveaways.css";

export async function generateMetadata() {
  return pageMetadata("home");
}
import "./services/services.css";
import "./portfolio/portfolio.css";
import "./blog/blog.css";

// Recommended reads and latest posts come from MongoDB; refresh at most once a minute.
export const revalidate = 60;

export default async function Home() {
  const [reads, { posts }, site, spotlight] = await Promise.all([
    getReads(),
    getPosts(),
    getSiteSeo(),
    getSpotlightGiveaway(),
  ]);
  const latest = posts.slice(0, 3);

  // Structured data so search engines know who Kitaabish is and how to reach you.
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.siteName,
    url: site.siteUrl,
    logo: absoluteUrl(site, "/logo-1.png"),
    description: site.defaultDescription,
    sameAs: [INSTAGRAM_URL],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${WHATSAPP_NUMBER}`,
      contactType: "customer service",
      availableLanguage: ["English", "Hindi", "Punjabi"],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organization)} />
      <BackgroundBoxes />
      <Navbar />
      <main>
        <Hero />
        {spotlight && (
          <section className="home-giveaway" id="giveaway">
            <div className="sbook-heading">
              <span className="eyebrow">🎁 {spotlight.status === "live" ? "Giveaway live now" : "Giveaway coming soon"}</span>
              <h2>
                {spotlight.status === "live" ? (
                  <>
                    Win something <em>special</em>
                  </>
                ) : (
                  <>
                    Something special is <em>coming</em>
                  </>
                )}
              </h2>
            </div>
            <GiveawayTicket g={spotlight} big />
            <p className="home-giveaway-more">
              <a href="/giveaways">See all giveaways &amp; past winners →</a>
            </p>
          </section>
        )}
        <Services />
        <div className="home-stats">
          <StatsRibbons />
        </div>
        <AboutKitaabish />
        <HomeShelf books={reads} />
        <Journey />
        <Reviews />
        {latest.length > 0 && (
          <section className="home-journal">
            <div className="sbook-heading">
              <span className="eyebrow">From the journal</span>
              <h2>
                Advice for <em>every chapter</em>
              </h2>
              <p>Practical guides on writing, editing and publishing your book.</p>
            </div>
            <div className="blog-grid">
              {latest.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
            <div className="home-more">
              <Link href="/blog" className="btn btn-ghost">
                Read the journal →
              </Link>
            </div>
          </section>
        )}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
