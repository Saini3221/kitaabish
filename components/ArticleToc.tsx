"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

// Book-style contents (title …… numeral) that highlights the chapter you're reading.
export default function ArticleToc({ headings, readingTime }: { headings: Heading[]; readingTime: number }) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.3;
      let current = headings[0]?.id ?? null;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top < line) current = h.id;
      }
      setActive(current);
      const body = document.querySelector(".rd-page");
      if (body) {
        const r = body.getBoundingClientRect();
        const p = (window.innerHeight * 0.5 - r.top) / r.height;
        setProgress(Math.min(1, Math.max(0, p)));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [headings]);

  if (headings.length === 0) return null;
  const left = Math.max(0, Math.ceil(readingTime * (1 - progress)));

  return (
    <nav className="toc" aria-label="Contents">
      <span className="toc-title">Contents</span>
      <ol>
        {headings.map((h, i) => (
          <li key={h.id} className={h.id === active ? "is-active" : ""}>
            <a href={`#${h.id}`}>
              <span className="toc-text">{h.text}</span>
              <span className="toc-dots" aria-hidden />
              <span className="toc-num">{roman[i] ?? i + 1}</span>
            </a>
          </li>
        ))}
      </ol>
      <div className="toc-progress">
        <div className="toc-bar">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <span>{left > 0 ? `${left} min left` : "Finished — nice!"}</span>
      </div>
    </nav>
  );
}
