import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import PortfolioForm from "@/components/admin/PortfolioForm";

export default async function NewPortfolio() {
  await requireAdmin();
  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/portfolio" className="adm-crumb">
            ← Portfolio
          </Link>
          <h1>Add a portfolio book</h1>
        </div>
      </header>
      <PortfolioForm />
    </>
  );
}
