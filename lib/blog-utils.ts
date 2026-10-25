// Client-safe blog types and helpers (no database imports).

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "tip"; text: string }
  | { type: "ul"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: { name: string; role: string };
  publishedAt: string; // ISO string, so it can be passed to client components
  readingTime: number;
  cover: { url: string; alt: string; credit: string };
  featured?: boolean;
  content: Block[];
  seo?: PostSeo;
};

export type PostSeo = {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Section headings (for the table of contents), with ids matching the rendered <h2>s.
export const headingsOf = (blocks: Block[]) =>
  blocks.flatMap((b) => (b.type === "h2" ? [{ id: slugify(b.text), text: b.text.replace(/^\d+\.\s*/, "") }] : []));

export const unsplash =(url: string, w: number) => `${url}?w=${w}&q=75&auto=format&fit=crop`;
