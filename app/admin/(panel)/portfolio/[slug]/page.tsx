import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { isSlug } from "@/lib/validation";
import type { PortfolioBook } from "@/lib/portfolio";
import PortfolioForm from "@/components/admin/PortfolioForm";

export default async function EditPortfolio({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const book = await (await getDb())
    .collection<PortfolioBook>("portfolio")
    .findOne({ slug }, { projection: { _id: 0 } });
  if (!book) notFound();

  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/portfolio" className="adm-crumb">
            ← Portfolio
          </Link>
          <h1>Edit “{book.title}”</h1>
        </div>
      </header>
      <PortfolioForm book={book} />
    </>
  );
}
