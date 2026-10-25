import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import GiveawayForm from "@/components/admin/GiveawayForm";

export default async function NewGiveaway() {
  await requireAdmin();
  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/giveaways" className="adm-crumb">
            ← Giveaways
          </Link>
          <h1>New giveaway</h1>
        </div>
      </header>
      <GiveawayForm />
    </>
  );
}
