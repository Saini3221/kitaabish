import { whatsappLink } from "@/lib/contact";
import { WhatsAppIcon } from "./icons";

// Floating "chat on WhatsApp" button shown on every page.
export default function WhatsAppFab() {
  return (
    <a className="wa-fab" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat with Kitaabish on WhatsApp">
      <span className="wa-fab-pulse" aria-hidden />
      <WhatsAppIcon className="wa-fab-icon" />
      <span className="wa-fab-tip">Chat with us</span>
    </a>
  );
}
