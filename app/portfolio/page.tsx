import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundBoxes from "@/components/BackgroundBoxes";
import ServicesIntro from "@/components/ServicesIntro";
import Library from "@/components/Library";
import { getPortfolio } from "@/lib/portfolio";
import { pageMetadata } from "@/lib/seo";
import "../services/services.css";
import "./portfolio.css";

export async function generateMetadata() {
  return pageMetadata("portfolio");
}

// Re-read the portfolio from MongoDB at most once a minute.
export const revalidate = 60;

export default async function PortfolioPage() {
  const { books, error } = await getPortfolio();

  return (
    <>
      <BackgroundBoxes />
      <Navbar />
      <main>
        <ServicesIntro
          title="Our Library"
          sub="Every book on these shelves started as an idea. Browse the stories we've helped bring to life — pick one up to see how we did it."
        />
        <Library books={books} error={error} />
        <section className="send">
          <div className="send-card">
            <span className="eyebrow">Your turn</span>
            <h2>
              Your book belongs <em>on this shelf.</em>
            </h2>
            <p>Tell us about your story and get a free consultation with our publishing team.</p>
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
