import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundBoxes from "@/components/BackgroundBoxes";
import ServicesIntro from "@/components/ServicesIntro";
import GiveawayTicket from "@/components/giveaways/GiveawayTicket";
import SubscribeForm from "@/components/giveaways/SubscribeForm";
import { getPublicGiveaways } from "@/lib/giveaways";
import "../services/services.css";
import "./giveaways.css";

export const metadata: Metadata = {
  title: "Giveaways",
  description: "Win free books, cover designs, editing sessions and more from Kitaabish. See live giveaways, upcoming ones and past winners.",
  alternates: { canonical: "/giveaways" },
};

// Entry counts and statuses refresh every 30 seconds.
export const revalidate = 30;

export default async function GiveawaysPage() {
  const all = await getPublicGiveaways();
  const live = all.filter((g) => g.status === "live");
  const upcoming = all.filter((g) => g.status === "upcoming");
  const past = all.filter((g) => g.status === "ended");

  return (
    <>
      <BackgroundBoxes />
      <Navbar />
      <main className="gw-page">
        <ServicesIntro
          title="Kitaabish Giveaways"
          sub="Free books, cover designs, editing sessions and more — for readers and writers in our community. Enter, share, and keep an eye on this page for every update."
        />

        {all.length === 0 && (
          <p className="gw-empty">No giveaways right now — subscribe below and you&apos;ll be the first to know about the next one.</p>
        )}

        {live.length > 0 && (
          <section className="gw-section">
            <h2 className="gw-h">
              <span className="gw-pulse" aria-hidden /> Live now
            </h2>
            <div className="gw-list">
              {live.map((g) => (
                <GiveawayTicket key={g.slug} g={g} big />
              ))}
            </div>
          </section>
        )}

        {upcoming.length > 0 && (
          <section className="gw-section">
            <h2 className="gw-h">Coming soon</h2>
            <div className="gw-grid">
              {upcoming.map((g) => (
                <GiveawayTicket key={g.slug} g={g} />
              ))}
            </div>
          </section>
        )}

        <div className="gw-section">
          <SubscribeForm />
        </div>

        {past.length > 0 && (
          <section className="gw-section">
            <h2 className="gw-h">Past giveaways &amp; winners</h2>
            <div className="gw-grid">
              {past.map((g) => (
                <GiveawayTicket key={g.slug} g={g} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
