import { getDb } from "./mongodb";

/** Any artwork id from lib/artworks.tsx (validated on save). */
export type CoverArt = string;

export type PortfolioBook = {
  slug: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  pages: number;
  formats: string[];
  services: string[];
  blurb: string;
  quote?: string;
  cover: { c1: string; c2: string; fg: string; art: CoverArt };
  featured?: boolean;
  order: number;
};

export type PortfolioResult = { books: PortfolioBook[]; error?: string };

export async function getPortfolio(): Promise<PortfolioResult> {
  try {
    const db = await getDb();
    const docs = await db
      .collection<PortfolioBook>("portfolio")
      .find({}, { projection: { _id: 0 } })
      .sort({ order: 1 })
      .toArray();
    return { books: docs };
  } catch (err) {
    console.error("[portfolio] failed to load from MongoDB:", err);
    return { books: [], error: "We couldn't load the library right now. Please try again shortly." };
  }
}
