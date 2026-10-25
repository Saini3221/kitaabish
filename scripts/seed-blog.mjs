// Seed the blog "posts" collection. Safe to re-run: posts are upserted by slug.
// Usage: npm run seed:blog
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "kitaabish";
if (!uri || uri.includes("<db_username>")) {
  console.error("Set MONGODB_URI in .env.local before seeding.");
  process.exit(1);
}

const img = (id) => `https://images.unsplash.com/photo-${id}`;
const team = { name: "Kitaabish Editorial Team", role: "Editors & publishing experts" };

const posts = [
  {
    slug: "how-to-start-writing-your-first-book",
    title: "How to Start Writing Your First Book (Even If You Have No Time)",
    excerpt:
      "The hardest page is the first one. Here's a simple, realistic system for going from idea to a finished first draft — in twenty minutes a day.",
    category: "Writing",
    tags: ["first draft", "habits", "beginners"],
    author: team,
    publishedAt: new Date("2026-10-20"),
    readingTime: 6,
    featured: true,
    cover: { url: img("1455390582262-044cdead277a"), alt: "Fountain pen writing on lined paper", credit: "Unsplash" },
    content: [
      { type: "p", text: "Almost everyone believes they have a book in them. Very few people ever write the first chapter. The difference is rarely talent — it's having a plan small enough to start today." },
      { type: "h2", text: "1. Shrink the goal" },
      { type: "p", text: "\"Write a book\" is a project, not a task. \"Write 300 words before breakfast\" is a task. At 300 words a day you'll have a 60,000-word draft in about seven months — without ever pulling an all-nighter." },
      { type: "h2", text: "2. Outline loosely, then let go" },
      { type: "p", text: "Sketch a beginning, a middle and an end on a single page. Note three or four turning points. That's enough to keep you moving without boxing you in." },
      { type: "quote", text: "You can't edit a blank page. Your only job in the first draft is to get the story out of your head." },
      { type: "h2", text: "3. Protect a writing slot" },
      { type: "ul", items: ["Pick the same 20–30 minutes every day", "Turn off notifications and close other tabs", "Stop mid-sentence so tomorrow's start is easy", "Track your streak — seeing it grow is motivating"] },
      { type: "tip", text: "Stuck? Write the scene you're most excited about first. Books don't have to be drafted in order." },
      { type: "p", text: "When the draft is done, put it away for two weeks before revising. Fresh eyes will spot what's working — and what needs an editor's help." },
    ],
  },
  {
    slug: "self-publishing-vs-traditional-publishing",
    title: "Self-Publishing vs Traditional Publishing: Which Is Right for You?",
    excerpt:
      "Control, speed, royalties and reach — we break down the real trade-offs so you can choose the path that fits your book and your goals.",
    category: "Publishing",
    tags: ["self-publishing", "royalties", "agents"],
    author: team,
    publishedAt: new Date("2026-10-12"),
    readingTime: 7,
    cover: { url: img("1481627834876-b7833e8f5570"), alt: "Long library aisle lined with bookshelves", credit: "Unsplash" },
    content: [
      { type: "p", text: "There has never been a better time to be an author — or a more confusing one. You can query agents for a traditional deal, or publish worldwide yourself in a matter of weeks. Neither is \"better\". They're different deals." },
      { type: "h2", text: "Traditional publishing" },
      { type: "ul", items: ["A publisher pays for editing, design, printing and distribution", "You usually receive an advance against lower royalties", "Bookstore placement is easier", "It can take 1–2 years from contract to shelf"] },
      { type: "h2", text: "Self-publishing" },
      { type: "ul", items: ["You keep full creative control and your rights", "Higher royalties on every sale", "You can publish in weeks, not years", "You're responsible for quality — editing, cover and marketing"] },
      { type: "quote", text: "Self-publishing doesn't mean doing everything yourself. It means you choose who to hire." },
      { type: "h2", text: "How to decide" },
      { type: "p", text: "If bookstore prestige and an advance matter most and you're patient, try traditional first. If you want speed, control and long-term royalties — or you have an audience already — self-publishing is often the smarter business move." },
      { type: "tip", text: "Many successful authors are hybrid: they self-publish some titles and sign traditional deals for others." },
    ],
  },
  {
    slug: "why-your-book-cover-matters",
    title: "Why Your Book Cover Matters More Than You Think",
    excerpt:
      "Readers do judge a book by its cover — in about two seconds. Here's what makes a cover sell, and the mistakes that quietly kill sales.",
    category: "Design",
    tags: ["cover design", "branding", "genre"],
    author: { name: "Kitaabish Design Studio", role: "Cover designers" },
    publishedAt: new Date("2026-10-03"),
    readingTime: 5,
    cover: { url: img("1474932430478-367dbb6832c1"), alt: "Antique books with decorated spines on a shelf", credit: "Unsplash" },
    content: [
      { type: "p", text: "Online, your cover is a thumbnail the size of a postage stamp, sitting next to hundreds of others. It has one job: make the right reader stop scrolling." },
      { type: "h2", text: "Signal the genre instantly" },
      { type: "p", text: "Thrillers look like thrillers. Romance looks like romance. Readers rely on these visual cues, and breaking them confuses the very people you're trying to reach." },
      { type: "h2", text: "Design for the thumbnail" },
      { type: "ul", items: ["Big, readable title — even at 150px wide", "One strong focal image, not five small ones", "High contrast between text and background", "Test it in black and white"] },
      { type: "quote", text: "A great cover doesn't describe the story. It promises a feeling." },
      { type: "h2", text: "Common mistakes" },
      { type: "p", text: "Too many fonts, stock photos everyone has seen, and titles that disappear into busy artwork are the usual culprits. A professional designer avoids all three — and knows the specs for print spines and eBook stores." },
    ],
  },
  {
    slug: "the-four-types-of-editing",
    title: "The 4 Types of Editing Every Manuscript Needs",
    excerpt:
      "Developmental, line, copy and proofreading — what each one does, when you need it, and why skipping a stage costs more later.",
    category: "Editing",
    tags: ["editing", "manuscript", "revision"],
    author: team,
    publishedAt: new Date("2026-09-24"),
    readingTime: 6,
    cover: { url: img("1457369804613-52c61a468e7d"), alt: "Wall covered in pages torn from books", credit: "Unsplash" },
    content: [
      { type: "p", text: "Editing is not one job. It's four, done in a specific order — from the big picture down to the last comma." },
      { type: "h2", text: "1. Developmental editing" },
      { type: "p", text: "The big picture: plot, structure, pacing, character arcs and whether the book delivers on its promise. This is where whole chapters move, merge or disappear." },
      { type: "h2", text: "2. Line editing" },
      { type: "p", text: "Sentence by sentence: rhythm, clarity, voice and word choice. Line editing makes good prose read beautifully." },
      { type: "h2", text: "3. Copy editing" },
      { type: "p", text: "Grammar, consistency and facts. Is the character's eye colour the same in chapter 2 and chapter 20? Does the timeline add up?" },
      { type: "h2", text: "4. Proofreading" },
      { type: "p", text: "The final polish on the formatted pages — typos, stray spaces and layout errors that slipped through." },
      { type: "tip", text: "Don't pay for proofreading before developmental edits. If chapters change, you'll pay to proofread them twice." },
    ],
  },
  {
    slug: "launch-week-marketing-checklist",
    title: "Launch Week: A Marketing Checklist for New Authors",
    excerpt:
      "A great book still needs a great launch. Use this week-by-week checklist to build momentum before, during and after release day.",
    category: "Marketing",
    tags: ["book launch", "marketing", "reviews"],
    author: { name: "Kitaabish Marketing", role: "Launch strategists" },
    publishedAt: new Date("2026-09-15"),
    readingTime: 5,
    cover: { url: img("1495446815901-a7297e633e8d"), alt: "Row of books standing on a bookstore shelf", credit: "Unsplash" },
    content: [
      { type: "p", text: "The first weeks after release matter most. Store algorithms notice early sales and reviews — and reward books that start strong." },
      { type: "h2", text: "Six weeks before" },
      { type: "ul", items: ["Send advance copies to early readers for reviews", "Set up your author website and newsletter", "Plan three pieces of content around your book's theme"] },
      { type: "h2", text: "Launch week" },
      { type: "ul", items: ["Email your list on day one — and again on day four", "Run a small, targeted ad campaign", "Share behind-the-scenes stories, not just buy links", "Thank every reviewer personally"] },
      { type: "quote", text: "Readers don't buy books from ads. They buy them from authors they feel they know." },
      { type: "h2", text: "After launch" },
      { type: "p", text: "Keep going. Pitch podcasts and blogs, run a price promotion at the three-month mark, and start talking about your next book — nothing sells your first book like your second." },
    ],
  },
];

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db(dbName).collection("posts");
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ publishedAt: -1 });
  const res = await col.bulkWrite(
    posts.map((p) => ({
      updateOne: { filter: { slug: p.slug }, update: { $set: { featured: false, ...p, updatedAt: new Date() } }, upsert: true },
    })),
  );
  const total = await col.countDocuments();
  console.log(`Seeded "${dbName}.posts": ${res.upsertedCount} inserted, ${res.modifiedCount} updated, ${total} total.`);
} catch (err) {
  console.error("Seeding failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
