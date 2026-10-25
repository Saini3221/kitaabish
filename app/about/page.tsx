import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundBoxes from "@/components/BackgroundBoxes";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { INSTAGRAM_URL, whatsappLink } from "@/lib/contact";
import { caveat, literata } from "@/lib/fonts";
import { pageMetadata } from "@/lib/seo";
import "../services/services.css";
import "./about.css";

export const revalidate = 60;
export async function generateMetadata() {
  return pageMetadata("about");
}

// Unsplash photo by id, sized for its slot.
const photo = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

const authorServices = [
  "Book promotion & launch campaigns",
  "Author interviews",
  "Cover reveals & giveaways",
  "Book trailers & promo videos",
  "Cover design",
  "Social media management",
  "Author branding",
  "SEO",
];

const readerThings = [
  "Book recommendations",
  "Honest reviews",
  "Bookish memes & reels",
  "Literature news",
  "Author updates",
  "Hindi literature & poetry",
];

const gallery = [
  { id: "1540575467063-178a50c2df87", label: "Literary events", alt: "Audience at a literary event" },
  { id: "1524995997946-a1c2e315a42f", label: "Book fairs & trips", alt: "Curved shelves of a large library" },
  { id: "1511632765486-a01980e01a18", label: "Reader meetups", alt: "Friends standing together at sunset" },
  { id: "1476275466078-4007374efbbe", label: "Poetry & Hindi literature", alt: "Open book lying on grass" },
  { id: "1532012197267-da84d127e765", label: "Stories worth finding", alt: "A book floating between bookshelves" },
];

const values = [
  {
    icon: "❦",
    title: "Room for new voices",
    text: "We especially want to support debut authors, independent writers, new voices and women authors. Literature gets richer when more kinds of stories get heard.",
  },
  {
    icon: "✎",
    title: "Creative work deserves respect",
    text: "Behind every cover and every reel there's research, scripting, shooting, editing, design and sound — and a hundred small decisions most people never see.",
  },
  {
    icon: "✦",
    title: "Upfront about everything",
    text: "We're clear about pricing, deliverables, timelines and revisions from the start. Good working relationships need clear expectations and respect on both sides.",
  },
  {
    icon: "❧",
    title: "No fake promises",
    text: "We won't promise guaranteed sales or viral fame, because nobody honestly can. What we promise is thoughtful work and honest expectations.",
  },
];

export default function AboutPage() {
  return (
    <>
      <BackgroundBoxes />
      <Navbar />
      <main className={`about-page ${literata.variable} ${caveat.variable}`}>
        {/* ---------- Hero: words left, photo collage right ---------- */}
        <section className="ab-hero">
          <div className="ab-hero-text reveal">
            <span className="eyebrow">About Kitaabish</span>
            <h1>
              Bringing authors, books &amp; readers <em>closer.</em>
            </h1>
            <p>
              A book marketing agency in India for authors who want to be found — and a home for readers looking for
              stories beyond what&apos;s trending.
            </p>
            <div className="ab-hero-cta">
              <a href="#authors" className="btn btn-red">
                I&apos;m an author
              </a>
              <a href="#readers" className="btn btn-ghost">
                I&apos;m a reader
              </a>
            </div>
          </div>

          <div className="ab-collage" aria-hidden>
            <figure className="ab-col ab-col-1">
              <Image src={photo("1506880018603-83d5b814b5a6", 700)} alt="" fill sizes="(max-width: 900px) 60vw, 26vw" priority />
            </figure>
            <figure className="ab-col ab-col-2">
              <Image src={photo("1488190211105-8b0e65b80b4e", 600)} alt="" fill sizes="(max-width: 900px) 45vw, 20vw" priority />
            </figure>
            <figure className="ab-col ab-col-3">
              <Image src={photo("1513001900722-370f803f498d", 500)} alt="" fill sizes="(max-width: 900px) 40vw, 16vw" />
            </figure>
            <span className="ab-stamp">
              <svg viewBox="0 0 120 120">
                <defs>
                  <path id="ab-stamp-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
                </defs>
                <text>
                  <textPath href="#ab-stamp-circle" textLength="285">
                    every story · every voice · every reader ·
                  </textPath>
                </text>
              </svg>
              <span>❦</span>
            </span>
          </div>
        </section>

        {/* ---------- Chapter One: the page + a polaroid ---------- */}
        <section className="ab-story">
          <div className="ab-paper">
            <span className="ab-chapter">Chapter One</span>
            <p className="ab-lede">Every book has a story. Getting that story to the right people is a different job altogether.</p>
            <p>
              We&apos;ve seen it from both sides. An author finishes a book they&apos;re proud of — then gets stuck on how to
              launch it, how to promote it, or how to find the people who&apos;d love it. A reader wants something genuinely
              good to read, scrolls past the same ten trending titles, and gives up.
            </p>
            <p>Kitaabish is our way of making both of those journeys a little easier.</p>
            <p>
              We&apos;re a <strong>book marketing agency in India</strong>. We help authors promote their books, build their
              presence and reach readers through creative marketing and PR. We also make content for readers —
              recommendations, reviews, news and the odd meme — so people can find books and authors beyond whatever&apos;s
              trending this week.
            </p>
            <p className="ab-pull">
              For us, the world of books has never been only about selling or reading. It&apos;s about the people who
              write, the people who read, and everything that brings them together.
            </p>
          </div>
          <figure className="ab-polaroid">
            <span className="ab-tape" aria-hidden />
            <div className="ab-polaroid-img">
              <Image src={photo("1543002588-bfa74002ed7e", 600)} alt="An open book resting on a stack of books" fill sizes="(max-width: 900px) 70vw, 22vw" />
            </div>
            <figcaption>where every story begins…</figcaption>
          </figure>
        </section>

        {/* ---------- Two paths ---------- */}
        <section className="ab-paths">
          <article className="ab-path ab-path-authors" id="authors">
            <div className="ab-path-img">
              <Image src={photo("1488190211105-8b0e65b80b4e", 900)} alt="A writer working on notes at a desk" fill sizes="(max-width: 800px) 100vw, 45vw" />
              <span className="ab-path-tag">For authors</span>
            </div>
            <div className="ab-path-body">
              <h2>Life after the last page</h2>
              <p>Finishing a book is a big deal. Getting people to find it is a whole new challenge.</p>
              <p>
                Maybe it&apos;s your first book and you don&apos;t know where to start. Maybe you&apos;ve published before
                and want to reach more readers this time. You might need a launch campaign, a trailer, social media content
                or help with an event — or you might still be figuring out what readers want, where to hold your launch, or
                how to turn an idea into something real.
              </p>
              <p>That&apos;s the part we help with. Depending on what your book needs:</p>
              <ul className="ab-chips">
                {authorServices.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p>
                Sometimes, though, you don&apos;t need a campaign — you need someone to talk it through with. Plenty of our
                work starts with a simple conversation about where you are and what makes sense next.
              </p>
              <Link href="/services" className="btn ab-btn-light">
                Explore our services →
              </Link>
            </div>
          </article>

          <article className="ab-path ab-path-readers" id="readers">
            <div className="ab-path-img">
              <Image src={photo("1506880018603-83d5b814b5a6", 900)} alt="Someone reading a book in warm light" fill sizes="(max-width: 800px) 100vw, 45vw" />
              <span className="ab-path-tag">For readers</span>
            </div>
            <div className="ab-path-body">
              <h2>More than what&apos;s trending</h2>
              <p>
                There are so many books on social media that picking your next read can feel harder than it should. A
                trending title catches your eye — but what if you&apos;re after an underrated novel, a poetry collection
                that stays with you, or a good Hindi book you&apos;d actually enjoy?
              </p>
              <p>We think finding books should be more personal than following a trend. So we share:</p>
              <ul className="ab-chips">
                {readerThings.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p>
                We also want to take reading off the page — with giveaways, book fairs, literary trips and reader meetups.
                And since many readers are writers too (or want to be one day), we&apos;d love to help you find your own
                voice along the way.
              </p>
              <div className="ab-path-links">
                <Link href="/blog" className="btn btn-dark">
                  Read the journal
                </Link>
                <Link href="/giveaways" className="btn btn-ghost">
                  See giveaways
                </Link>
              </div>
            </div>
          </article>
        </section>

        {/* ---------- How we work ---------- */}
        <section className="ab-how">
          <div className="ab-how-img">
            <Image src={photo("1522202176988-66273c2fd55f", 900)} alt="People talking around a table with laptops" fill sizes="(max-width: 900px) 100vw, 45vw" />
          </div>
          <div className="ab-how-text">
            <span className="eyebrow">How we work</span>
            <blockquote>
              First we get to know your book and what you want from it. Then we build a plan that fits both —{" "}
              <em>not a template.</em>
            </blockquote>
            <ol className="ab-steps">
              <li>
                <strong>Listen</strong> — your book, your readers, your goals.
              </li>
              <li>
                <strong>Plan</strong> — clear deliverables, timelines and pricing.
              </li>
              <li>
                <strong>Create</strong> — thoughtful work, made with care.
              </li>
            </ol>
          </div>
        </section>

        {/* ---------- Beyond the page: photo gallery ---------- */}
        <section className="ab-gallery">
          <div className="sbook-heading">
            <span className="eyebrow">Beyond the page</span>
            <h2>
              Reading, <em>off the page</em>
            </h2>
            <p>Giveaways, book fairs, literary trips and reader meetups — new ways to experience the world of books.</p>
          </div>
          <div className="ab-gallery-grid">
            {gallery.map((g, i) => (
              <figure key={g.id} className={`ab-g ab-g-${i}`}>
                <Image src={photo(g.id, i === 0 ? 1000 : 600)} alt={g.alt} fill sizes="(max-width: 800px) 50vw, 33vw" />
                <figcaption>{g.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ---------- Values ---------- */}
        <section className="ab-values">
          <div className="sbook-heading">
            <span className="eyebrow">More than marketing</span>
            <h2>
              A love for <em>literature</em>
            </h2>
            <p>
              Kitaabish sits between the two sides of the literary world — the people who create stories and the people
              who find them. Here&apos;s what we believe in.
            </p>
          </div>
          <ul className="ab-value-grid">
            {values.map((v, i) => (
              <li key={v.title} className="ab-value" style={{ ["--i" as string]: i }}>
                <span className="ab-value-icon" aria-hidden>
                  {v.icon}
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Closing, over a bookshelf photo ---------- */}
        <section className="ab-close">
          <div className="ab-close-card">
            <Image src={photo("1521587760476-6c12a4b040da", 1600)} alt="" fill sizes="100vw" className="ab-close-bg" />
            <div className="ab-close-inner">
              <span className="eyebrow">Let&apos;s talk</span>
              <h2>
                Let&apos;s find the right readers for <em>your story.</em>
              </h2>
              <p>
                Looking for book marketing services in India, planning a launch, exploring a literary event — or just
                unsure what to do next? Come talk to us. And if you&apos;re a reader looking for your next favourite book,
                we hope you find something here that feels like it was meant for you.
              </p>
              <div className="ab-close-actions">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn ab-wa">
                  <WhatsAppIcon className="ab-btn-icon" /> Chat on WhatsApp
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn ab-ig">
                  <InstagramIcon className="ab-btn-icon" /> Follow on Instagram
                </a>
              </div>
              <p className="ab-belief">
                Stories deserve to be found. Authors deserve real support. Readers deserve good recommendations. Creative
                work deserves respect.
              </p>
              <p className="ab-sign">
                <strong>Kitaabish</strong> — for every story, every voice, every reader.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
