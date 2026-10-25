"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

const stats = [
  { value: 500, suffix: "+", label: "Books published", color: "#2c2690" },
  { value: 1200, suffix: "+", label: "Happy authors", color: "#e0343c" },
  { value: 30, suffix: "+", label: "Genres covered", color: "#b8860b" },
  { value: 25, suffix: "", label: "Countries reached", color: "#1f7891" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  // null = not animated yet: render the real number so it's never stuck at 0.
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {(n ?? to).toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

// Stats hung from the top like silk bookmark ribbons.
export default function StatsRibbons() {
  return (
    <section className="ribbons" aria-label="Kitaabish in numbers">
      {stats.map((s, i) => (
        <div key={s.label} className="ribbon" style={{ ["--c" as string]: s.color, ["--i" as string]: i }}>
          <strong>
            <Counter to={s.value} suffix={s.suffix} />
          </strong>
          <span>{s.label}</span>
        </div>
      ))}
    </section>
  );
}
