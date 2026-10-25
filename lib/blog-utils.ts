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

// Anchor id for a heading. Keeps letters in any script (Hindi too), not only a–z.
const anchorId = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "") || "section";

// Section headings (for the table of contents), in order, with ids matching the rendered <h2>s.
// Repeated headings get -2, -3… so every id is unique.
export const headingsOf = (blocks: Block[]) => {
  const seen = new Map<string, number>();
  return blocks.flatMap((b) => {
    if (b.type !== "h2") return [];
    const base = anchorId(b.text);
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return [{ id: n > 1 ? `${base}-${n}` : base, text: b.text.replace(/^\d+\.\s*/, "") }];
  });
};

export const unsplash =(url: string, w: number) => `${url}?w=${w}&q=75&auto=format&fit=crop`;
