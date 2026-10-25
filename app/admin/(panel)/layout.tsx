import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "../actions";
import "../admin.css";
import "../../portfolio/portfolio.css";

export const metadata: Metadata = { title: "Admin | Kitaabish", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "◧" },
  { href: "/admin/reads", label: "Recommended reads", icon: "❦" },
  { href: "/admin/portfolio", label: "Portfolio", icon: "▤" },
  { href: "/admin/posts", label: "Journal posts", icon: "✎" },
  { href: "/admin/giveaways", label: "Giveaways", icon: "🎁" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "🔔" },
  { href: "/admin/messages", label: "Messages", icon: "✉" },
  { href: "/admin/seo", label: "SEO", icon: "⌕" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="adm">
      <aside className="adm-side">
        <Link href="/admin" className="adm-brand">
          <Image src="/logo-1.png" alt="" width={30} height={50} />
          <span>
            Kitaabish
            <small>Admin</small>
          </span>
        </Link>
        <nav>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="adm-nav-link">
              <span aria-hidden>{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="adm-side-foot">
          <a href="/" target="_blank" rel="noopener noreferrer" className="adm-nav-link">
            <span aria-hidden>↗</span>
            View website
          </a>
          <p className="adm-user">{admin.email}</p>
          <form action={logoutAction}>
            <button type="submit" className="adm-btn adm-btn-sm adm-btn-block">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
