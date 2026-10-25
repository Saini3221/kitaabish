import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundBoxes from "@/components/BackgroundBoxes";
import ServicesIntro from "@/components/ServicesIntro";
import ServiceBook from "@/components/ServiceBook";
import Journey from "@/components/Journey";
import StatsRibbons from "@/components/StatsRibbons";
import Editions from "@/components/Editions";
import Reviews from "@/components/Reviews";
import Footnotes from "@/components/Footnotes";
import { pageMetadata } from "@/lib/seo";
import "./services.css";

// SEO is editable in Admin → SEO; refresh at most once a minute.
export const revalidate = 60;
export async function generateMetadata() {
  return pageMetadata("services");
}

export default function ServicesPage() {
  return (
    <>
      <BackgroundBoxes />
      <Navbar />
      <main>
        <ServicesIntro />
        <ServiceBook />
        <StatsRibbons />
        <Journey />
        <Editions />
        <Reviews />
        <Footnotes />
        <section className="send">
          <div className="send-card">
            <span className="eyebrow">The End?</span>
            <h2>
              Every story needs a <em>first chapter.</em>
            </h2>
            <p>Tell us about your book and get a free consultation with our publishing team.</p>
            <a href="/contact" className="btn btn-red">
              Start Your Book
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
