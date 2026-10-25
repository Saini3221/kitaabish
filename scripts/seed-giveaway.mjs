// Seed ONE sample giveaway so you can see the design. Edit or delete it in Admin → Giveaways.
// Safe to re-run (upserts by slug).  Usage: npm run seed:giveaway
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "kitaabish";
if (!uri || uri.includes("<db_username>")) {
  console.error("Set MONGODB_URI in .env.local before seeding.");
  process.exit(1);
}

const now = Date.now();
const giveaway = {
  slug: "win-a-custom-book-cover",
  title: "Win a Custom Book Cover Design",
  prize: "A professionally designed custom cover for your book",
  summary: "Writing a book? Win a one-of-a-kind cover designed by the Kitaabish studio — front, spine and back.",
  description:
    "Every great book deserves a cover that makes readers stop scrolling. To celebrate our community of writers, we're giving one author a complete custom cover design.\n\nThe winner will work one-on-one with our designers on concepts, revisions and final print-ready files.",
  rules: [
    "Follow @itskitaabish on Instagram",
    "Enter with your name and a valid email address",
    "One entry per person",
    "The winner is picked at random after the giveaway closes and announced on this page and on Instagram",
  ],
  image: {
    url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
    alt: "Open book next to a cup of coffee and glasses",
  },
  startsAt: new Date(now - 60 * 60 * 1000),
  endsAt: new Date(now + 14 * 24 * 60 * 60 * 1000),
  published: true,
  winner: null,
};

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db(dbName).collection("giveaways");
  await col.createIndex({ slug: 1 }, { unique: true });
  const res = await col.updateOne(
    { slug: giveaway.slug },
    { $set: { ...giveaway, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true },
  );
  console.log(res.upsertedCount ? "Sample giveaway created (live for 14 days)." : "Sample giveaway updated.");
} catch (err) {
  console.error("Seeding failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
