import { getAdmin } from "@/lib/auth";
import { giveawayCollections } from "@/lib/giveaways";
import { isSlug } from "@/lib/validation";
import { csvResponse, toCsv } from "@/lib/csv";

// Download all entries of one giveaway as CSV (admins only).
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await getAdmin())) return new Response("Unauthorized", { status: 401 });
  const { slug } = await params;
  if (!isSlug(slug)) return new Response("Not found", { status: 404 });

  const { entries } = await giveawayCollections();
  const list = await entries.find({ giveawaySlug: slug }, { projection: { _id: 0, ipHash: 0 } }).sort({ createdAt: 1 }).toArray();
  const csv = toCsv(
    ["Name", "Email", "WhatsApp", "Instagram", "Entered at (UTC)"],
    list.map((e) => [e.name, e.email, e.whatsapp, e.instagram ? `@${e.instagram}` : "", e.createdAt]),
  );
  return csvResponse(csv, `giveaway-${slug}-entries.csv`);
}
