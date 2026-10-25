import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatIST, getAllGiveawaysAdmin } from "@/lib/giveaways";
import { deleteGiveaway } from "../../actions";
import { DeleteButton } from "@/components/admin/FormBits";
import Flash from "@/components/admin/Flash";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const statusLabel = { live: "Live", upcoming: "Upcoming", ended: "Ended" } as const;

export default async function GiveawaysAdmin({ searchParams }: Props) {
  await requireAdmin();
  const list = await getAllGiveawaysAdmin();

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Giveaways</h1>
          <p>Live giveaways show a bar on every page, a spotlight on the home page and a page at /giveaways.</p>
        </div>
        <div className="adm-head-links">
          <Link href="/admin/subscribers" className="adm-btn">
            Subscribers
          </Link>
          <Link href="/admin/giveaways/new" className="adm-btn adm-btn-primary">
            + New giveaway
          </Link>
        </div>
      </header>
      <Flash params={await searchParams} />
      {list.length === 0 ? (
        <p className="adm-empty">No giveaways yet. Create your first one.</p>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th>Giveaway</th>
              <th>Status</th>
              <th>Dates (IST)</th>
              <th>Entries</th>
              <th>Winner</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((g) => (
              <tr key={g.slug}>
                <td>
                  <strong>{g.title}</strong>
                  <br />
                  <small className="adm-muted">{g.prize}</small>
                </td>
                <td>
                  {!g.published ? (
                    <span className="adm-pill adm-pill-draft">Draft</span>
                  ) : (
                    <span className={`adm-pill adm-pill-${g.status}`}>{statusLabel[g.status]}</span>
                  )}
                </td>
                <td className="adm-cell-dates">
                  {formatIST(g.startsAt)}
                  <br />→ {formatIST(g.endsAt)}
                </td>
                <td>
                  <strong>{g.entries}</strong>
                </td>
                <td>{g.winner?.name ?? "—"}</td>
                <td>
                  <div className="adm-row-actions">
                    <Link href={`/admin/giveaways/${g.slug}`} className="adm-btn adm-btn-sm adm-btn-primary">
                      Entries
                    </Link>
                    <Link href={`/admin/giveaways/${g.slug}/edit`} className="adm-btn adm-btn-sm">
                      Edit
                    </Link>
                    <DeleteButton action={deleteGiveaway.bind(null, g.slug)} label={`${g.title}" and all its entries`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
