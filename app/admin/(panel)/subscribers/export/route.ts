import { getAdmin } from "@/lib/auth";
import { giveawayCollections } from "@/lib/giveaways";
import { csvResponse, toCsv } from "@/lib/csv";

// Download giveaway-alert subscribers as CSV (admins only).
export async function GET() {
  if (!(await getAdmin())) return new Response("Unauthorized", { status: 401 });
  const { subscribers } = await giveawayCollections();
  const list = await subscribers.find({}, { projection: { _id: 0 } }).sort({ createdAt: 1 }).toArray();
  const csv = toCsv(
    ["Name", "Email", "WhatsApp", "Subscribed at (UTC)"],
    list.map((s) => [s.name, s.email, s.whatsapp, s.createdAt]),
  );
  return csvResponse(csv, "giveaway-subscribers.csv");
}
