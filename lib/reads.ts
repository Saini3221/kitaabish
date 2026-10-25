import { getDb } from "./mongodb";
import type { CoverArt } from "./portfolio";

// Books the Kitaabish team has read and recommends (admin-curated, "reads" collection).
export type RecommendedRead = {
  slug: string;
  title: string;
  author: string;
  genre: string;
  note: string; // why we recommend it
  cover: { c1: string; c2: string; fg: string; art: CoverArt };
  order: number;
};

export async function getReads(): Promise<RecommendedRead[]> {
  try {
    const db = await getDb();
    return await db
      .collection<RecommendedRead>("reads")
      .find({}, { projection: { _id: 0 } })
      .sort({ order: 1 })
      .toArray();
  } catch (err) {
    console.error("[reads] failed to load from MongoDB:", err);
    return [];
  }
}
