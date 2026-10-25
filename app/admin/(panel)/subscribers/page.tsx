import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatIST, giveawayCollections } from "@/lib/giveaways";

export default async function Subscribers() {
  await requireAdmin();
  const { subscribers } = await giveawayCollections();
  const list = await subscribers.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(2000).toArray();

  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/giveaways" className="adm-crumb">
            ← Giveaways
          </Link>
          <h1>Giveaway subscribers</h1>
          <p>{list.length} people asked to be told about new giveaways. Message them when one goes live.</p>
        </div>
        <a href="/admin/subscribers/export" className="adm-btn adm-btn-primary">
          ⬇ Download CSV
        </a>
      </header>
      {list.length === 0 ? (
        <p className="adm-empty">No subscribers yet.</p>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>WhatsApp</th>
              <th>Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s, i) => (
              <tr key={`${s.email}-${s.whatsapp}-${i}`}>
                <td>{s.name || "—"}</td>
                <td>{s.email || "—"}</td>
                <td>{s.whatsapp || "—"}</td>
                <td className="adm-muted">{formatIST(new Date(s.createdAt).toISOString())}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
