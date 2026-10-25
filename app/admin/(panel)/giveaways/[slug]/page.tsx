import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { formatIST, getGiveaway, giveawayCollections } from "@/lib/giveaways";
import { isSlug } from "@/lib/validation";
import { pickWinner } from "../../../actions";
import PickWinnerButton from "@/components/admin/PickWinnerButton";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
type WinnerEntry = { name: string; email: string; whatsapp: string; instagram: string; pickedAt: Date; poolSize: number };

export default async function GiveawayEntries({ params, searchParams }: Props) {
  await requireAdmin();
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const g = await getGiveaway(slug, true);
  if (!g) notFound();
  const sp = await searchParams;

  const { giveaways, entries } = await giveawayCollections();
  const [list, winnerDoc] = await Promise.all([
    entries.find({ giveawaySlug: slug }, { projection: { _id: 0, ipHash: 0 } }).sort({ createdAt: -1 }).limit(1000).toArray(),
    giveaways.findOne({ slug }, { projection: { _id: 0, winnerEntry: 1 } }) as Promise<{ winnerEntry?: WinnerEntry } | null>,
  ]);
  const winner = winnerDoc?.winnerEntry;

  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/giveaways" className="adm-crumb">
            ← Giveaways
          </Link>
          <h1>{g.title}</h1>
          <p>
            {g.entries} entries · {formatIST(g.startsAt)} → {formatIST(g.endsAt)}
          </p>
        </div>
        <div className="adm-head-links">
          <a href={`/giveaways/${slug}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-sm">
            View page ↗
          </a>
          <Link href={`/admin/giveaways/${slug}/edit`} className="adm-btn adm-btn-sm">
            Edit
          </Link>
          <a href={`/admin/giveaways/${slug}/export`} className="adm-btn adm-btn-sm">
            ⬇ Download CSV
          </a>
        </div>
      </header>

      {sp.picked && <p className="adm-alert adm-alert-ok">🎉 Winner picked and announced on the website.</p>}
      {sp.error === "notended" && <p className="adm-alert adm-alert-error">You can pick a winner after the giveaway ends.</p>}
      {sp.error === "noentries" && <p className="adm-alert adm-alert-error">There are no entries to pick from.</p>}

      <div className="adm-winner-box">
        {winner ? (
          <div>
            <span className="adm-label">🏆 Winner (private details)</span>
            <p className="adm-winner-name">{winner.name}</p>
            <p className="adm-muted">
              {winner.email}
              {winner.whatsapp && ` · WhatsApp ${winner.whatsapp}`}
              {winner.instagram && ` · @${winner.instagram}`}
            </p>
            <p className="adm-muted">
              Picked at random from {winner.poolSize} entries on {formatIST(new Date(winner.pickedAt).toISOString())}. Shown
              publicly as “{g.winner?.name}”.
            </p>
          </div>
        ) : (
          <div>
            <span className="adm-label">Winner</span>
            <p className="adm-muted">
              {g.status === "ended"
                ? "The giveaway has ended. Pick a winner at random from all entries."
                : "You can pick a winner once the giveaway ends."}
            </p>
          </div>
        )}
        {g.status === "ended" && g.entries > 0 && (
          <PickWinnerButton action={pickWinner.bind(null, slug)} again={!!winner} />
        )}
      </div>

      {list.length === 0 ? (
        <p className="adm-empty">No entries yet.</p>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>WhatsApp</th>
              <th>Instagram</th>
              <th>Entered</th>
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.email}>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.whatsapp || "—"}</td>
                <td>{e.instagram ? `@${e.instagram}` : "—"}</td>
                <td className="adm-muted">{formatIST(new Date(e.createdAt).toISOString())}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
