import Link from "next/link";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";

export default async function Dashboard() {
  const admin = await requireAdmin();
  const db = await getDb();
  const [reads, portfolio, posts, giveaways, subscribers, unread] = await Promise.all([
    db.collection("reads").countDocuments(),
    db.collection("portfolio").countDocuments(),
    db.collection("posts").countDocuments(),
    db.collection("giveaways").countDocuments(),
    db.collection("giveaway_subscribers").countDocuments(),
    db.collection("contact_messages").countDocuments({ read: false }),
  ]);

  const cards = [
    { label: "Recommended reads", count: reads, href: "/admin/reads", add: "/admin/reads/new", where: "Home page bookshelf" },
    { label: "Portfolio books", count: portfolio, href: "/admin/portfolio", add: "/admin/portfolio/new", where: "/portfolio" },
    { label: "Journal posts", count: posts, href: "/admin/posts", add: "/admin/posts/new", where: "/blog" },
    { label: "Giveaways", count: giveaways, href: "/admin/giveaways", add: "/admin/giveaways/new", where: "/giveaways + site-wide bar" },
    { label: "Giveaway subscribers", count: subscribers, href: "/admin/subscribers", add: "", where: "People waiting for the next giveaway" },
    { label: "Unread messages", count: unread, href: "/admin/messages", add: "", where: "/contact form" },
  ];

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Welcome back</h1>
          <p>Signed in as {admin.email}. Changes go live on the website as soon as you save.</p>
        </div>
      </header>
      <div className="adm-stats">
        {cards.map((c) => (
          <div key={c.label} className="adm-stat">
            <span className="adm-stat-count">{c.count}</span>
            <span className="adm-stat-label">{c.label}</span>
            <span className="adm-stat-where">Shown on: {c.where}</span>
            <div className="adm-stat-actions">
              <Link href={c.href} className="adm-btn adm-btn-sm">
                Manage
              </Link>
              {c.add && (
                <Link href={c.add} className="adm-btn adm-btn-sm adm-btn-primary">
                  + Add new
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
