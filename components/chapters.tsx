import {
  BrushIcon,
  FrameTextIcon,
  GlobeIcon,
  HeadphonesIcon,
  HeartEyesIcon,
  PenIcon,
  StackIcon,
  WandIcon,
} from "./icons";

export type Chapter = {
  roman: string;
  title: string;
  tagline: string;
  desc: string;
  features: string[];
  timeline: string;
  ideal: string;
  color: string;
  Icon: (p: { className?: string }) => React.JSX.Element;
};

export const chapters: Chapter[] = [
  {
    roman: "I",
    title: "Ghostwriting",
    tagline: "Your ideas, our words — in your voice.",
    desc: "Seasoned ghostwriters interview you, study your voice and shape your story from first outline to final chapter, while you keep full credit and rights.",
    features: ["Discovery calls & interviews", "Detailed chapter outline", "Chapter-by-chapter drafts", "Unlimited revisions"],
    timeline: "8 – 16 weeks",
    ideal: "Memoirs, business & fiction",
    color: "#2f9e44",
    Icon: PenIcon,
  },
  {
    roman: "II",
    title: "Book Editing",
    tagline: "Every page earns its place.",
    desc: "Developmental, line and copy editing that tightens pacing, sharpens prose and catches every slip — so readers stay lost in your story, not your typos.",
    features: ["Developmental feedback", "Line & copy editing", "Proofreading pass", "Editorial letter"],
    timeline: "2 – 6 weeks",
    ideal: "Finished manuscripts",
    color: "#b8860b",
    Icon: WandIcon,
  },
  {
    roman: "III",
    title: "Book Formatting",
    tagline: "Beautiful on every shelf and screen.",
    desc: "Print-ready interiors and flawless eBook layouts with professional typography, chapter styling and front matter that make your book feel published.",
    features: ["Print interior (PDF)", "ePub & Kindle files", "Custom chapter headers", "Front & back matter"],
    timeline: "1 – 2 weeks",
    ideal: "Self-publishing authors",
    color: "#5b5bd6",
    Icon: FrameTextIcon,
  },
  {
    roman: "IV",
    title: "Cover Design",
    tagline: "Judged by its cover — and winning.",
    desc: "Genre-savvy designers craft covers that stop the scroll, from concept sketches to full print wraps with spine and back-cover copy.",
    features: ["3 initial concepts", "Front, spine & back", "eBook & 3D mockups", "Source files included"],
    timeline: "1 – 3 weeks",
    ideal: "Every genre",
    color: "#d6336c",
    Icon: BrushIcon,
  },
  {
    roman: "V",
    title: "Book Publishing",
    tagline: "From manuscript to marketplace.",
    desc: "We handle ISBNs, distribution and store listings, so your book goes live across major online stores and print-on-demand networks without the headaches.",
    features: ["ISBN & copyright help", "Global store listings", "Print-on-demand setup", "Royalty guidance"],
    timeline: "2 – 4 weeks",
    ideal: "First-time authors",
    color: "#1f7891",
    Icon: StackIcon,
  },
  {
    roman: "VI",
    title: "Book Marketing",
    tagline: "The right readers, at the right time.",
    desc: "Launch campaigns, author branding and reader outreach that put your book in front of the audience it deserves — and keep it there.",
    features: ["Launch strategy", "Ads & social campaigns", "Reviews & ARC outreach", "Monthly reporting"],
    timeline: "Ongoing",
    ideal: "Launches & relaunches",
    color: "#e0565f",
    Icon: HeartEyesIcon,
  },
  {
    roman: "VII",
    title: "Audiobook Production",
    tagline: "Let your story be heard.",
    desc: "Professional narrators, studio recording and mastering to retail specs, turning your book into an audiobook listeners can't pause.",
    features: ["Narrator casting", "Studio recording", "Editing & mastering", "Retail-ready files"],
    timeline: "4 – 8 weeks",
    ideal: "Published books",
    color: "#7048e8",
    Icon: HeadphonesIcon,
  },
  {
    roman: "VIII",
    title: "Author Website",
    tagline: "A home for you and your readers.",
    desc: "A fast, beautiful author website with your books, bio, events and a mailing-list signup — so readers always know where to find you next.",
    features: ["Custom design", "Book & bio pages", "Newsletter signup", "SEO basics"],
    timeline: "2 – 3 weeks",
    ideal: "Growing authors",
    color: "#2c2690",
    Icon: GlobeIcon,
  },
];
