import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/contact";
import { InstagramIcon, WhatsAppIcon } from "./icons";

// Home page contact block: WhatsApp first, Instagram second.
export default function ContactSection() {
  return (
    <section className="contact" id="contact">
      <div className="contact-card">
        <div className="contact-text">
          <span className="eyebrow">Let&apos;s talk</span>
          <h2>
            Tell us about <em>your book.</em>
          </h2>
          <p>
            Have an idea, a draft or a finished manuscript? Message us on WhatsApp for a free consultation — we
            usually reply within a few hours.
          </p>
        </div>
        <div className="contact-actions">
          <a className="contact-btn contact-wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="contact-btn-icon" />
            <span>
              <small>Chat on WhatsApp</small>
              <strong>{WHATSAPP_DISPLAY}</strong>
            </span>
            <span className="contact-arrow" aria-hidden>
              →
            </span>
          </a>
          <a className="contact-btn contact-ig" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            <InstagramIcon className="contact-btn-icon" />
            <span>
              <small>Follow us on Instagram</small>
              <strong>{INSTAGRAM_HANDLE}</strong>
            </span>
            <span className="contact-arrow" aria-hidden>
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
