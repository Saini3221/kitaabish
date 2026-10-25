import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { isSlug } from "@/lib/validation";
import type { RecommendedRead } from "@/lib/reads";
import ReadForm from "@/components/admin/ReadForm";

export default async function EditRead({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const read = await (await getDb())
    .collection<RecommendedRead>("reads")
    .findOne({ slug }, { projection: { _id: 0 } });
  if (!read) notFound();

  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/reads" className="adm-crumb">
            ← Recommended reads
          </Link>
          <h1>Edit “{read.title}”</h1>
        </div>
      </header>
      <ReadForm read={read} />
    </>
  );
}
