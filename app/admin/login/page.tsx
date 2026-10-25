import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getAdmin } from "@/lib/auth";
import "../admin.css";

export const metadata: Metadata = { title: "Admin sign in | Kitaabish", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="adm-login">
      <div className="adm-login-card">
        <Image src="/logo-1.png" alt="Kitaabish" width={48} height={81} priority />
        <h1>Admin sign in</h1>
        <p>Manage recommended reads, portfolio and journal posts.</p>
        <LoginForm />
      </div>
    </main>
  );
}
