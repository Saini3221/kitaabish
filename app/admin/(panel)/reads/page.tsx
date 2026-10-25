import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { RecommendedRead } from "@/lib/reads";
import { deleteRead } from "../../actions";
import { DeleteButton } from "@/components/admin/FormBits";
import Flash from "@/components/admin/Flash";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ReadsAdmin({ searchParams }: Props) {
  await requireAdmin();
  const reads = await (await getDb())
    .collection<RecommendedRead>("reads")
    .find({}, { projection: { _id: 0 } })
    .sort({ order: 1 })
    .toArray();

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Recommended reads</h1>
          <p>The &ldquo;Books we love to read&rdquo; shelf on the home page.</p>
        </div>
        <Link href="/admin/reads/new" className="adm-btn adm-btn-primary">
          + Add book
        </Link>
      </header>
      <Flash params={await searchParams} />
      {reads.length === 0 ? (
        <p className="adm-empty">No books yet. Add the first one.</p>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Genre</th>
              <th>Note</th>
              <th>Order</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {reads.map((r) => (
              <tr key={r.slug}>
                <td>
                  <div className="adm-cell-book">
                    <span className="adm-swatch" style={{ background: `linear-gradient(135deg, ${r.cover.c1}, ${r.cover.c2})` }} />
                    <span>
                      <strong>{r.title}</strong>
                      <small>{r.author}</small>
                    </span>
                  </div>
                </td>
                <td>{r.genre}</td>
                <td className="adm-cell-note">{r.note}</td>
                <td>{r.order}</td>
                <td>
                  <div className="adm-row-actions">
                    <Link href={`/admin/reads/${r.slug}`} className="adm-btn adm-btn-sm">
                      Edit
                    </Link>
                    <DeleteButton action={deleteRead.bind(null, r.slug)} label={r.title} />
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
