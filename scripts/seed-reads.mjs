// Seed the "reads" collection: the best books the Kitaabish team has read and recommends.
// Edit this list (or the collection in MongoDB Atlas) to change the home page shelf.
// Safe to re-run: books are upserted by slug.  Usage: npm run seed:reads
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "kitaabish";
if (!uri || uri.includes("<db_username>")) {
  console.error("Set MONGODB_URI in .env.local before seeding.");
  process.exit(1);
}

// cover.art is one of: "river" | "flame" | "castle" | "letter"
const reads = [
  {
    slug: "on-writing",
    title: "On Writing",
    author: "Stephen King",
    genre: "Writing craft",
    note: "The most honest book about the writing life we've ever read.",
    cover: { c1: "#3a3a3a", c2: "#111111", fg: "#f2b233", art: "letter" },
  },
  {
    slug: "bird-by-bird",
    title: "Bird by Bird",
    author: "Anne Lamott",
    genre: "Writing craft",
    note: "Permission to write messy first drafts — and actually finish them.",
    cover: { c1: "#7bc96f", c2: "#2f7d3a", fg: "#ffffff", art: "river" },
  },
  {
    slug: "the-alchemist",
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    note: "A reminder that every story begins with a dream worth following.",
    cover: { c1: "#f7c95c", c2: "#c98a14", fg: "#2a1a00", art: "castle" },
  },
  {
    slug: "wings-of-fire",
    title: "Wings of Fire",
    author: "A. P. J. Abdul Kalam",
    genre: "Memoir",
    note: "Proof that an honest life story can inspire millions of readers.",
    cover: { c1: "#ff4747", c2: "#a80d18", fg: "#ffffff", art: "flame" },
  },
].map((r, i) => ({ ...r, order: i + 1 }));

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db(dbName).collection("reads");
  await col.createIndex({ slug: 1 }, { unique: true });
  const res = await col.bulkWrite(
    reads.map((r) => ({
      updateOne: { filter: { slug: r.slug }, update: { $set: { ...r, updatedAt: new Date() } }, upsert: true },
    })),
  );
  const total = await col.countDocuments();
  console.log(`Seeded "${dbName}.reads": ${res.upsertedCount} inserted, ${res.modifiedCount} updated, ${total} total.`);
} catch (err) {
  console.error("Seeding failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
