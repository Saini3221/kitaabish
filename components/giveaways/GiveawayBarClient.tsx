"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Countdown from "./Countdown";

// Site-wide strip for the live giveaway. Dismissal is remembered per giveaway in this browser.
export default function GiveawayBarClient({ slug, title, endsAt }: { slug: string; title: string; endsAt: string }) {
  const key = `kb-bar-dismissed:${slug}`;
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem(key)) setHidden(true);
    } catch {}
  }, [key]);
  if (hidden) return null;

  return (
    <div className="gbar" role="region" aria-label="Live giveaway">
      <Link href={`/giveaways/${slug}`} className="gbar-link">
        <span className="gbar-badge">🎁 Giveaway live</span>
        <span className="gbar-title">{title}</span>
        <span className="gbar-time">
          ends in <Countdown to={endsAt} compact endedText="now" />
        </span>
        <span className="gbar-cta">Enter now →</span>
      </Link>
      <button
        type="button"
        className="gbar-close"
        aria-label="Hide giveaway bar"
        onClick={() => {
          setHidden(true);
          try {
            localStorage.setItem(key, "1");
          } catch {}
        }}
      >
        ×
      </button>
    </div>
  );
}
