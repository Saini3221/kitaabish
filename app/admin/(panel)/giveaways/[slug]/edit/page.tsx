import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getGiveaway } from "@/lib/giveaways";
import { isSlug } from "@/lib/validation";
import GiveawayForm from "@/components/admin/GiveawayForm";

export default async function EditGiveaway({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const g = await getGiveaway(slug, true);
  if (!g) notFound();
  return (
    <>
      <header className="adm-head">
        <div>
          <Link href={`/admin/giveaways/${slug}`} className="adm-crumb">
            ← {g.title}
          </Link>
          <h1>Edit giveaway</h1>
        </div>
      </header>
      <GiveawayForm giveaway={g} />
    </>
  );
}
