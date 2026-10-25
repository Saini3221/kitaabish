// Kitaabish contact details, used across the site.
export const WHATSAPP_NUMBER = "917988717968";
export const WHATSAPP_DISPLAY = "+91 79887 17968";
export const INSTAGRAM_URL = "https://www.instagram.com/itskitaabish/";
export const INSTAGRAM_HANDLE = "@itskitaabish";

export const whatsappLink = (text = "Hi Kitaabish! I'd like to talk about my book.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Options for the "What's this about?" field on /contact.
export const CONTACT_TOPICS = [
  "Book marketing & launch",
  "Author interview / feature",
  "Cover design or trailer",
  "Collaboration / event",
  "Something else",
] as const;
