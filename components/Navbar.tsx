import Image from "next/image";
import Link from "next/link";
import { getSpotlightGiveaway } from "@/lib/giveaways";
import GiveawayBarClient from "./giveaways/GiveawayBarClient";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Giveaways", href: "/giveaways" },
  { label: "Contact", href: "/contact" },
];

export default async function Navbar() {
  const spotlight = await getSpotlightGiveaway();
  const live = spotlight?.status === "live" ? spotlight : null;

  return (
    <>
      {live && <GiveawayBarClient slug={live.slug} title={live.title} endsAt={live.endsAt} />}
      <header className="nav">
        <Link href="/" className="nav-logo" aria-label="Kitaabish home">
          <Image src="/logo-1.png" alt="Kitaabish" width={34} height={57} priority />
        </Link>
        <nav className="nav-links">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className={l.label === "Giveaways" && live ? "nav-live" : undefined}>
              {l.label}
              {l.label === "Giveaways" && live && <span className="nav-dot" aria-label="(live)" />}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="btn btn-dark">
          Get a Quote
        </Link>
      </header>
    </>
  );
}
