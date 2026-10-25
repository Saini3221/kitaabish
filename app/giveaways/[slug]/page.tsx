import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Countdown from "@/components/giveaways/Countdown";
import EntryForm from "@/components/giveaways/EntryForm";
import SubscribeForm from "@/components/giveaways/SubscribeForm";
import { formatIST, getGiveaway } from "@/lib/giveaways";
import { isSlug } from "@/lib/validation";
import { INSTAGRAM_URL } from "@/lib/contact";
import "../../services/services.css";
import "../giveaways.css";

export const revalidate = 30;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = isSlug(slug) ? await getGiveaway(slug) : null;
  if (!g) return { title: "Giveaway not found", robots: { index: false } };
  const image = `${g.image.url}?w=1200&q=75&auto=format&fit=crop`;
  return {
    title: `Giveaway: ${g.title}`,
    description: `${g.summary} Prize: ${g.prize}.`,
    alternates: { canonical: `/giveaways/${g.slug}` },
    openGraph: { title: `🎁 ${g.title}`, description: g.summary, images: [image], url: `/giveaways/${g.slug}` },
    twitter: { card: "summary_large_image", title: `🎁 ${g.title}`, description: g.summary, images: [image] },
  };
}

export default async function GiveawayPage({ params }: Props) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const g = await getGiveaway(slug);
  if (!g) notFound();

  return (
    <>
      <Navbar />
      <main className="gw-detail">
        <Link href="/giveaways" className="gw-back">
          ← All giveaways
        </Link>

        <div className="gw-hero">
          <div className="gw-hero-img">
            <Image src={`${g.image.url}?w=1200&q=75&auto=format&fit=crop`} alt={g.image.alt} fill priority sizes="(max-width: 900px) 100vw, 50vw" />
            <span className={`ticket-status ticket-status-${g.status}`}>
              {g.status === "live" && <span className="ticket-dot" aria-hidden />}
              {g.status === "live" ? "Live now" : g.status === "upcoming" ? "Coming soon" : "Ended"}
            </span>
          </div>

          <div className="gw-hero-text">
            <span className="ticket-kicker">🎁 Kitaabish Giveaway</span>
            <h1>{g.title}</h1>
            <p className="ticket-prize">
              <span>Prize</span>
              {g.prize}
            </p>
            <p className="gw-summary">{g.summary}</p>

            <div className="gw-timebox">
              {g.status === "live" && (
                <>
                  <span className="ticket-label">Ends in</span>
                  <Countdown to={g.endsAt} />
                  <small>Closes {formatIST(g.endsAt)}</small>
                </>
              )}
              {g.status === "upcoming" && (
                <>
                  <span className="ticket-label">Opens in</span>
                  <Countdown to={g.startsAt} endedText="Opening now — refresh the page!" />
                  <small>Opens {formatIST(g.startsAt)}</small>
                </>
              )}
              {g.status === "ended" && (
                <div className="gw-winner">
                  {g.winner ? (
                    <>
                      <span className="gw-trophy" aria-hidden>
                        🏆
                      </span>
                      <div>
                        <span className="ticket-label">Winner</span>
                        <strong>{g.winner.name}</strong>
                        {g.winner.note && <p>{g.winner.note}</p>}
                        <small>Announced {formatIST(g.winner.announcedAt)}</small>
                      </div>
                    </>
                  ) : (
                    <p>This giveaway has ended. The winner will be announced here and on Instagram soon.</p>
                  )}
                </div>
              )}
            </div>
            <p className="gw-entries">
              {g.entries === 0
                ? "Be the first to enter!"
                : g.entries === 1
                  ? "1 person has entered"
                  : `${g.entries.toLocaleString("en-IN")} people have entered`}
            </p>
          </div>
        </div>

        <div className="gw-body">
          <section className="gw-about">
            <h2>About this giveaway</h2>
            {g.description.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            {g.rules.length > 0 && (
              <>
                <h3>How to win</h3>
                <ol className="gw-rules">
                  {g.rules.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ol>
              </>
            )}
            <p className="gw-follow">
              Follow{" "}
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                @itskitaabish
              </a>{" "}
              on Instagram for winner announcements and new giveaways.
            </p>
          </section>

          <aside className="gw-enter" id="enter">
            {g.status === "live" ? (
              <>
                <h2>Enter the giveaway</h2>
                <p className="gw-enter-note">One entry per email. It takes 20 seconds.</p>
                <EntryForm slug={g.slug} title={g.title} />
              </>
            ) : (
              <div className="gw-closed">
                <h2>{g.status === "upcoming" ? "Entries open soon" : "Entries are closed"}</h2>
                <p>
                  {g.status === "upcoming"
                    ? "Come back when the countdown ends — or get notified below."
                    : "Don't miss the next one — subscribe for giveaway alerts."}
                </p>
              </div>
            )}
          </aside>
        </div>

        <div className="gw-section">
          <SubscribeForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
