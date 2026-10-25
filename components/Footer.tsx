import Image from "next/image";
import Link from "next/link";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/contact";
import { InstagramIcon, WhatsAppIcon } from "./icons";

const explore = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Journal", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Giveaways", href: "/giveaways" },
  { label: "Contact", href: "/contact" },
];
const services = ["Ghostwriting", "Book Editing", "Cover Design", "Book Publishing", "Book Marketing"];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Image src="/logo-1.png" alt="Kitaabish" width={48} height={81} />
          <p>Turning manuscripts into masterpieces — from the first word to the bookshelf.</p>
          <div className="footer-social">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <WhatsAppIcon />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            {explore.map((l) => (
              <li key={l.label}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            {services.map((s) => (
              <li key={s}>
                <Link href="/services">{s}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <ul>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp · {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                Instagram · {INSTAGRAM_HANDLE}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <small>© {new Date().getFullYear()} Kitaabish. All rights reserved.</small>
        <small>Made with ❦ for storytellers.</small>
      </div>
    </footer>
  );
}
