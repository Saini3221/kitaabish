// Seed the portfolio collection. Safe to re-run: books are upserted by slug.
// Usage: npm run seed
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "kitaabish";
if (!uri || uri.includes("<db_username>")) {
  console.error("Set MONGODB_URI in .env.local (replace <db_username> with your Atlas user) before seeding.");
  process.exit(1);
}

// Sample data — replace with real Kitaabish projects.
const books = [
  {
    slug: "the-silent-river",
    title: "The Silent River",
    author: "A. Mehra",
    genre: "Fiction",
    year: 2025,
    pages: 312,
    formats: ["Paperback", "Hardcover", "eBook"],
    services: ["Book Editing", "Cover Design", "Book Formatting", "Book Publishing"],
    blurb: "A quiet village, a missing sister and a river that remembers everything. A literary mystery about grief and the stories families keep.",
    quote: "Kitaabish helped me find the shape of a story I'd carried for ten years.",
    cover: { c1: "#2f29a0", c2: "#141047", fg: "#ffffff", art: "river" },
    featured: true,
  },
  {
    slug: "ink-and-ember",
    title: "Ink & Ember",
    author: "R. Kaur",
    genre: "Poetry",
    year: 2025,
    pages: 128,
    formats: ["Paperback", "eBook"],
    services: ["Book Editing", "Cover Design", "Book Marketing"],
    blurb: "Sixty poems on love, loss and starting over, written across three cities and one long winter.",
    quote: "They treated every line break like it mattered — because it did.",
    cover: { c1: "#ff4747", c2: "#a80d18", fg: "#ffffff", art: "flame" },
    featured: true,
  },
  {
    slug: "paper-kingdoms",
    title: "Paper Kingdoms",
    author: "S. Iqbal",
    genre: "Fantasy",
    year: 2024,
    pages: 468,
    formats: ["Paperback", "Hardcover", "eBook", "Audiobook"],
    services: ["Ghostwriting", "Book Editing", "Cover Design", "Audiobook Production"],
    blurb: "When a young cartographer's maps start coming true, she must redraw a crumbling empire before it folds in on itself.",
    cover: { c1: "#f7c95c", c2: "#c98a14", fg: "#2a1a00", art: "castle" },
    featured: true,
  },
  {
    slug: "letters-home",
    title: "Letters Home",
    author: "J. Das",
    genre: "Memoir",
    year: 2024,
    pages: 236,
    formats: ["Paperback", "eBook"],
    services: ["Ghostwriting", "Book Formatting", "Book Publishing"],
    blurb: "Forty years of letters between a soldier and his mother, woven into a memoir about distance, duty and coming home.",
    quote: "My father's letters finally have the home they deserve.",
    cover: { c1: "#2c9bb6", c2: "#11495a", fg: "#ffffff", art: "letter" },
  },
  {
    slug: "the-founders-ledger",
    title: "The Founder's Ledger",
    author: "V. Malhotra",
    genre: "Business",
    year: 2025,
    pages: 254,
    formats: ["Hardcover", "eBook", "Audiobook"],
    services: ["Ghostwriting", "Book Editing", "Author Website", "Book Marketing"],
    blurb: "Hard-won lessons from building three companies — on hiring, cash flow and knowing when to walk away.",
    cover: { c1: "#3a3a3a", c2: "#111111", fg: "#f2b233", art: "castle" },
  },
  {
    slug: "monsoon-hearts",
    title: "Monsoon Hearts",
    author: "P. Nair",
    genre: "Romance",
    year: 2024,
    pages: 298,
    formats: ["Paperback", "eBook"],
    services: ["Book Editing", "Cover Design", "Book Marketing"],
    blurb: "Two rival chefs, one monsoon season and a food festival neither of them can afford to lose.",
    cover: { c1: "#e0567a", c2: "#8e1d45", fg: "#ffffff", art: "flame" },
  },
  {
    slug: "little-lantern",
    title: "Little Lantern",
    author: "N. Bose",
    genre: "Children's",
    year: 2025,
    pages: 40,
    formats: ["Hardcover"],
    services: ["Book Editing", "Cover Design", "Book Formatting"],
    blurb: "A tiny lantern who is scared of the dark learns that being small is exactly what makes it brave.",
    cover: { c1: "#7bc96f", c2: "#2f7d3a", fg: "#ffffff", art: "river" },
  },
  {
    slug: "salt-and-saffron",
    title: "Salt & Saffron",
    author: "K. Thakur",
    genre: "Memoir",
    year: 2023,
    pages: 204,
    formats: ["Paperback", "Hardcover", "eBook"],
    services: ["Ghostwriting", "Book Editing", "Book Publishing"],
    blurb: "A grandmother's recipes and the stories behind them — a family history told one meal at a time.",
    cover: { c1: "#f08c2e", c2: "#a3460c", fg: "#ffffff", art: "letter" },
  },
  {
    slug: "northbound",
    title: "Northbound",
    author: "A. Pillai",
    genre: "Fiction",
    year: 2023,
    pages: 344,
    formats: ["Paperback", "eBook", "Audiobook"],
    services: ["Book Editing", "Book Formatting", "Audiobook Production"],
    blurb: "A night train, six strangers and one secret that could change all of their lives before sunrise.",
    cover: { c1: "#4b5bd6", c2: "#1b2470", fg: "#ffffff", art: "river" },
  },
  {
    slug: "the-calm-ledger",
    title: "The Calm Habit",
    author: "M. Sethi",
    genre: "Self-help",
    year: 2025,
    pages: 188,
    formats: ["Paperback", "eBook", "Audiobook"],
    services: ["Ghostwriting", "Cover Design", "Book Marketing"],
    blurb: "Ten small daily practices that turn anxious mornings into calm, focused days — no apps required.",
    cover: { c1: "#9fd8cf", c2: "#3e8f86", fg: "#0f2f2b", art: "letter" },
  },
  {
    slug: "second-spring",
    title: "Second Spring",
    author: "M. Sharma",
    genre: "Romance",
    year: 2024,
    pages: 276,
    formats: ["Paperback", "eBook"],
    services: ["Ghostwriting", "Book Editing", "Book Publishing"],
    blurb: "Widowed at fifty, a schoolteacher signs up for a pottery class and discovers life has a second act.",
    cover: { c1: "#b693f5", c2: "#5b2fa8", fg: "#ffffff", art: "flame" },
  },
  {
    slug: "the-dragon-of-dal-lake",
    title: "The Dragon of Dal Lake",
    author: "Z. Mir",
    genre: "Children's",
    year: 2024,
    pages: 56,
    formats: ["Hardcover", "eBook"],
    services: ["Book Editing", "Cover Design", "Book Formatting", "Book Marketing"],
    blurb: "A shy boy befriends a dragon who lives beneath the houseboats — and together they save the lake.",
    cover: { c1: "#5ec2e8", c2: "#1d6f99", fg: "#ffffff", art: "castle" },
  },
].map((b, i) => ({ ...b, featured: b.featured ?? false, order: i + 1 }));

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db(dbName).collection("portfolio");
  await col.createIndex({ slug: 1 }, { unique: true });
  const res = await col.bulkWrite(
    books.map((b) => ({
      updateOne: { filter: { slug: b.slug }, update: { $set: { ...b, updatedAt: new Date() } }, upsert: true },
    })),
  );
  const total = await col.countDocuments();
  console.log(`Seeded "${dbName}.portfolio": ${res.upsertedCount} inserted, ${res.modifiedCount} updated, ${total} total.`);
} catch (err) {
  console.error("Seeding failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
