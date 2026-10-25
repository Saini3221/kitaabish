import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import ReadForm from "@/components/admin/ReadForm";

export default async function NewRead() {
  await requireAdmin();
  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/reads" className="adm-crumb">
            ← Recommended reads
          </Link>
          <h1>Add a book</h1>
        </div>
      </header>
      <ReadForm />
    </>
  );
}
