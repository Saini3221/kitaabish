import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import ReadingProgress from "@/components/ReadingProgress";
import ArticleToc from "@/components/ArticleToc";
import ShareBar from "@/components/ShareBar";
import BackToTop from "@/components/BackToTop";
import { formatDate, getPost, headingsOf, unsplash, type Block } from "@/lib/blog";
import { caveat, literata } from "@/lib/fonts";
import { absoluteUrl, getSiteSeo, jsonLd } from "@/lib/seo";
import "../../services/services.css";
import "../blog.css";
import "./article.css";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ post }, site] = await Promise.all([getPost((await params).slug), getSiteSeo()]);
  if (!post) return { title: "Post not found", robots: { index: false } };
  // Per-post SEO from the admin overrides the defaults (title, excerpt, cover photo).
  const seo = post.seo ?? {};
  const title = seo.title || post.title;
  const description = seo.description || post.excerpt;
  const image = seo.ogImage || unsplash(post.cover.url, 1200);
  return {
    title,
    description,
    keywords: seo.keywords?.length ? seo.keywords : post.tags,
    authors: [{ name: post.author.name }],
    alternates: { canonical: seo.canonical || `/blog/${post.slug}` },
    robots: seo.noindex || !site.allowIndexing ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      siteName: site.siteName,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

function Content({ blocks }: { blocks: Block[] }) {
  const ids = headingsOf(blocks).map((h) => h.id);
  let chapter = 0;
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2": {
            const n = chapter++;
            return (
              <h2 key={i} id={ids[n]} className="rd-h2">
                <span className="rd-chap">Chapter {roman[n] ?? n + 1}</span>
                <span className="rd-h-text">{b.text.replace(/^\d+\.\s*/, "")}</span>
              </h2>
            );
          }
          case "quote":
            return (
              <blockquote key={i} className="rd-quote">
                <p>{b.text}</p>
              </blockquote>
            );
          case "tip":
            return (
              <aside key={i} className="rd-note">
                <span className="rd-tape" aria-hidden />
                <strong>Kitaabish tip</strong>
                <p>{b.text}</p>
              </aside>
            );
          case "ul":
            return (
              <ul key={i} className="rd-list">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          default:
            return <p key={i}>{b.text}</p>;
        }
      })}
    </>
  );
}

export default async function PostPage({ params }: Props) {
  const [{ post, related, prev, next }, site] = await Promise.all([getPost((await params).slug), getSiteSeo()]);
  if (!post) notFound();
  const headings = headingsOf(post.content);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    image: [post.seo?.ogImage || unsplash(post.cover.url, 1200)],
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: post.author.name },
    publisher: { "@type": "Organization", name: site.siteName, logo: { "@type": "ImageObject", url: absoluteUrl(site, "/logo-1.png") } },
    mainEntityOfPage: absoluteUrl(site, `/blog/${post.slug}`),
    keywords: post.tags.join(", "),
  };
  const initials = post.author.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleLd)} />
      <ReadingProgress />
      <Navbar />
      <main className={`rd ${literata.variable} ${caveat.variable}`}>
        {/* Editorial opener: words on the left, photo in an arch on the right */}
        <header className="rd-hero">
          <div className="rd-hero-text">
            <Link href="/blog" className="rd-back">
              ← The Journal
            </Link>
            <p className="rd-kicker">
              <span>{post.category}</span> · {formatDate(post.publishedAt)} · {post.readingTime} min read
            </p>
            <h1>{post.title}</h1>
            <p className="rd-lede">{post.excerpt}</p>
            <div className="rd-byline">
              <span className="rd-avatar" aria-hidden>
                {initials}
              </span>
              <span>
                <strong>{post.author.name}</strong>
                <small>{post.author.role}</small>
              </span>
            </div>
          </div>
          <figure className="rd-hero-fig">
            <div className="rd-arch">
              <Image src={unsplash(post.cover.url, 1400)} alt={post.cover.alt} fill priority sizes="(max-width: 900px) 100vw, 45vw" />
            </div>
            <span className="rd-ornament" aria-hidden>
              ✦
            </span>
            <figcaption>Photo: {post.cover.credit}</figcaption>
          </figure>
        </header>

        <div className="rd-layout">
          <aside className="rd-side">
            <ArticleToc headings={headings} readingTime={post.readingTime} />
          </aside>

          {/* The article itself, set like a printed book page */}
          <article className="rd-page">
            <div className="rd-running-head" aria-hidden>
              <span />
              Kitaabish Journal · {post.category}
              <span />
            </div>

            <div className="rd-text">
              <Content blocks={post.content} />
            </div>

            <div className="rd-fin" aria-hidden>
              <span>❦</span>
              <em>Fin.</em>
            </div>

            <ul className="rd-tags">
              {post.tags.map((t) => (
                <li key={t}>#{t}</li>
              ))}
            </ul>
            <ShareBar title={post.title} variant="row" />
          </article>

          <aside className="rd-rail">
            <ShareBar title={post.title} />
          </aside>
        </div>

        <div className="rd-after">
          <div className="rd-author">
            <span className="rd-avatar rd-avatar-lg" aria-hidden>
              {initials}
            </span>
            <div>
              <span className="rd-author-kicker">Written by</span>
              <strong>{post.author.name}</strong>
              <span>{post.author.role}</span>
            </div>
            <Link href="/blog" className="rd-author-more">
              More stories →
            </Link>
          </div>

          {(prev || next) && (
            <nav className="rd-pager" aria-label="More stories">
              {prev ? (
                <Link href={`/blog/${prev.slug}`} className="rd-pager-link">
                  <span>← Previous story</span>
                  <strong>{prev.title}</strong>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={`/blog/${next.slug}`} className="rd-pager-link rd-pager-next">
                  <span>Next story →</span>
                  <strong>{next.title}</strong>
                </Link>
              )}
            </nav>
          )}
        </div>

        {related.length > 0 && (
          <section className="rd-related">
            <h2>
              Keep <em>reading</em>
            </h2>
            <div className="blog-grid">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}

        <section className="send">
          <div className="send-card">
            <span className="eyebrow">Ready to write?</span>
            <h2>
              Let&apos;s turn your idea into a <em>book.</em>
            </h2>
            <p>Get a free consultation with our publishing team.</p>
            <a href="/contact" className="btn btn-red">
              Start Your Book
            </a>
          </div>
        </section>
      </main>
      <BackToTop />
      <Footer />
    </>
  );
}
