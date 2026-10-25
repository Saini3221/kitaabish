"use client";

import { useEffect, useState } from "react";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/** Ticking countdown. Renders placeholders on the server so hydration always matches. */
export default function Countdown({
  to,
  compact = false,
  endedText = "Ended",
}: {
  to: string;
  compact?: boolean;
  endedText?: string;
}) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const left = now === null ? null : new Date(to).getTime() - now;
  if (left !== null && left <= 0) return <span className="cd-ended">{endedText}</span>;
  const p = left === null ? null : parts(left);
  const pad = (n: number | undefined) => (n === undefined ? "--" : String(n).padStart(2, "0"));

  if (compact) {
    return (
      <span className="cd-compact" suppressHydrationWarning>
        {p ? `${p.d}d ${pad(p.h)}h ${pad(p.m)}m` : "—"}
      </span>
    );
  }
  return (
    <div className="cd" role="timer" aria-live="off">
      {(
        [
          ["Days", p?.d],
          ["Hours", p?.h],
          ["Mins", p?.m],
          ["Secs", p?.s],
        ] as const
      ).map(([label, v]) => (
        <span key={label} className="cd-cell">
          <strong>{pad(v)}</strong>
          <small>{label}</small>
        </span>
      ))}
    </div>
  );
}
