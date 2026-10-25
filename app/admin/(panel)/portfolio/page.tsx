import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { PortfolioBook } from "@/lib/portfolio";
import { deletePortfolio } from "../../actions";
import { DeleteButton } from "@/components/admin/FormBits";
import Flash from "@/components/admin/Flash";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function PortfolioAdmin({ searchParams }: Props) {
  await requireAdmin();
  const books = await (await getDb())
    .collection<PortfolioBook>("portfolio")
    .find({}, { projection: { _id: 0 } })
    .sort({ order: 1 })
    .toArray();

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Portfolio</h1>
          <p>Books shown in the library at /portfolio.</p>
        </div>
        <Link href="/admin/portfolio/new" className="adm-btn adm-btn-primary">
          + Add book
        </Link>
      </header>
      <Flash params={await searchParams} />
      {books.length === 0 ? (
        <p className="adm-empty">No books yet. Add the first one.</p>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Genre</th>
              <th>Year</th>
              <th>Featured</th>
              <th>Order</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.slug}>
                <td>
                  <div className="adm-cell-book">
                    <span className="adm-swatch" style={{ background: `linear-gradient(135deg, ${b.cover.c1}, ${b.cover.c2})` }} />
                    <span>
                      <strong>{b.title}</strong>
                      <small>{b.author}</small>
                    </span>
                  </div>
                </td>
                <td>{b.genre}</td>
                <td>{b.year}</td>
                <td>{b.featured ? <span className="adm-badge">Featured</span> : "—"}</td>
                <td>{b.order}</td>
                <td>
                  <div className="adm-row-actions">
                    <Link href={`/admin/portfolio/${b.slug}`} className="adm-btn adm-btn-sm">
                      Edit
                    </Link>
                    <DeleteButton action={deletePortfolio.bind(null, b.slug)} label={b.title} />
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
