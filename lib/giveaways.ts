import { getDb } from "./mongodb";

// Giveaways, their entries, and "notify me" subscribers.

export type GiveawayStatus = "upcoming" | "live" | "ended";

export type Giveaway = {
  slug: string;
  title: string;
  prize: string;
  summary: string;
  description: string;
  rules: string[];
  image: { url: string; alt: string };
  startsAt: string; // ISO
  endsAt: string; // ISO
  published: boolean;
  winner?: { name: string; note?: string; announcedAt: string } | null;
};

type GiveawayDoc = Omit<Giveaway, "startsAt" | "endsAt" | "winner"> & {
  startsAt: Date;
  endsAt: Date;
  winner?: { name: string; note?: string; announcedAt: Date } | null;
};

export type GiveawayWithCount = Giveaway & { status: GiveawayStatus; entries: number };

// winnerEntry holds the winner's private contact details — never send it to public pages.
const PUBLIC = { projection: { _id: 0, winnerEntry: 0 } } as const;

/** Public display name: first name + last initial, e.g. "Priya S." */
export const publicName = (full: string) => {
  const [first, ...rest] = full.trim().split(/\s+/);
  const last = rest.pop();
  return last ? `${first} ${last[0].toUpperCase()}.` : first;
};

export const statusOf = (g: { startsAt: string | Date; endsAt: string | Date }, now = Date.now()): GiveawayStatus =>
  now < new Date(g.startsAt).getTime() ? "upcoming" : now < new Date(g.endsAt).getTime() ? "live" : "ended";

const toGiveaway = (d: GiveawayDoc): Giveaway => ({
  ...d,
  startsAt: new Date(d.startsAt).toISOString(),
  endsAt: new Date(d.endsAt).toISOString(),
  winner: d.winner ? { ...d.winner, announcedAt: new Date(d.winner.announcedAt).toISOString() } : null,
});

export async function giveawayCollections() {
  const db = await getDb();
  return {
    giveaways: db.collection<GiveawayDoc>("giveaways"),
    entries: db.collection<{
      giveawaySlug: string;
      name: string;
      email: string;
      whatsapp: string;
      instagram: string;
      ipHash: string;
      createdAt: Date;
    }>("giveaway_entries"),
    subscribers: db.collection<{ email: string; whatsapp: string; name: string; source: string; createdAt: Date }>(
      "giveaway_subscribers",
    ),
  };
}

async function withCounts(docs: GiveawayDoc[]): Promise<GiveawayWithCount[]> {
  if (docs.length === 0) return [];
  const { entries } = await giveawayCollections();
  const counts = await entries
    .aggregate<{ _id: string; n: number }>([
      { $match: { giveawaySlug: { $in: docs.map((d) => d.slug) } } },
      { $group: { _id: "$giveawaySlug", n: { $sum: 1 } } },
    ])
    .toArray();
  const map = new Map(counts.map((c) => [c._id, c.n]));
  return docs.map((d) => {
    const g = toGiveaway(d);
    return { ...g, status: statusOf(g), entries: map.get(d.slug) ?? 0 };
  });
}

/** Published giveaways, live first, then upcoming, then ended (newest first). */
export async function getPublicGiveaways(): Promise<GiveawayWithCount[]> {
  try {
    const { giveaways } = await giveawayCollections();
    const docs = await giveaways.find({ published: true }, PUBLIC).toArray();
    const order: Record<GiveawayStatus, number> = { live: 0, upcoming: 1, ended: 2 };
    return (await withCounts(docs)).sort(
      (a, b) =>
        order[a.status] - order[b.status] ||
        (a.status === "ended"
          ? +new Date(b.endsAt) - +new Date(a.endsAt)
          : +new Date(a.endsAt) - +new Date(b.endsAt)),
    );
  } catch (err) {
    console.error("[giveaways] failed to load:", err);
    return [];
  }
}

/** The giveaway to spotlight site-wide: the live one ending soonest, else the next upcoming. */
export async function getSpotlightGiveaway(): Promise<GiveawayWithCount | null> {
  const list = await getPublicGiveaways();
  return list.find((g) => g.status === "live") ?? list.find((g) => g.status === "upcoming") ?? null;
}

export async function getGiveaway(slug: string, includeDrafts = false): Promise<GiveawayWithCount | null> {
  try {
    const { giveaways } = await giveawayCollections();
    const doc = await giveaways.findOne(includeDrafts ? { slug } : { slug, published: true }, PUBLIC);
    return doc ? (await withCounts([doc]))[0] : null;
  } catch {
    return null;
  }
}

export async function getAllGiveawaysAdmin(): Promise<GiveawayWithCount[]> {
  const { giveaways } = await giveawayCollections();
  const docs = await giveaways.find({}, PUBLIC).sort({ startsAt: -1 }).toArray();
  return withCounts(docs);
}

export const formatIST = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }) + " IST";
