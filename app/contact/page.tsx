import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundBoxes from "@/components/BackgroundBoxes";
import ContactForm from "@/components/contact/ContactForm";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/contact";
import { caveat } from "@/lib/fonts";
import { pageMetadata } from "@/lib/seo";
import "../services/services.css";
import "../giveaways/giveaways.css";
import "./contact.css";

export const revalidate = 60;
export async function generateMetadata() {
  return pageMetadata("contact");
}

const faqs = [
  {
    q: "Is the first conversation free?",
    a: "Yes. Tell us about your book and where you are with it — we'll suggest what makes sense, with no obligation.",
  },
  {
    q: "My book isn't published yet. Is it too early?",
    a: "Not at all. The best launches are planned before release day, so reaching out early gives us more room to help.",
  },
  {
    q: "Do you work with Hindi and regional-language books?",
    a: "Yes — we love Hindi literature and poetry, and we work with authors writing in English, Hindi and Punjabi.",
  },
  {
    q: "Can you guarantee sales?",
    a: "No, and nobody honestly can. We promise thoughtful work, clear deliverables and honest expectations.",
  },
];

export default function ContactPage() {
  return (
    <>
      <BackgroundBoxes />
      <Navbar />
      <main className={`ct-page ${caveat.variable}`}>
        <section className="ct-hero reveal">
          <span className="eyebrow">Contact</span>
          <h1>
            Let&apos;s talk about <em>your book.</em>
          </h1>
          <p>
            Planning a launch, looking for a cover reveal, or just not sure what to do next? Send us a note — a real
            person reads every message.
          </p>
        </section>

        <section className="ct-grid">
          <div className="ct-form-card">
            <h2>Send us a message</h2>
            <p className="ct-sub">We usually reply within a day or two.</p>
            <ContactForm />
          </div>

          <aside className="ct-side">
            <p className="ct-side-label">Prefer to chat?</p>
            <a className="ct-channel ct-wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="ct-channel-icon" />
              <span>
                <small>WhatsApp · fastest reply</small>
                <strong>{WHATSAPP_DISPLAY}</strong>
              </span>
              <span className="ct-arrow" aria-hidden>
                →
              </span>
            </a>
            <a className="ct-channel ct-ig" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              <InstagramIcon className="ct-channel-icon" />
              <span>
                <small>Instagram DMs</small>
                <strong>{INSTAGRAM_HANDLE}</strong>
              </span>
              <span className="ct-arrow" aria-hidden>
                →
              </span>
            </a>

            <div className="ct-note">
              <span className="ct-tape" aria-hidden />
              <p className="ct-note-title">Good to include</p>
              <ul>
                <li>Your book&apos;s title &amp; genre</li>
                <li>Release date (or where you are)</li>
                <li>What kind of help you need</li>
                <li>A rough budget, if you have one</li>
              </ul>
              <p className="ct-note-sign">— we&apos;ll take it from there ❦</p>
            </div>
          </aside>
        </section>

        <section className="ct-faq">
          <div className="sbook-heading">
            <span className="eyebrow">Before you write</span>
            <h2>
              A few <em>quick answers</em>
            </h2>
          </div>
          <div className="ct-faq-list">
            {faqs.map((f) => (
              <details key={f.q} className="ct-faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p className="ct-faq-more">
            Want to see what we do first? <Link href="/services">Explore our services</Link> or{" "}
            <Link href="/portfolio">browse the portfolio</Link>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
