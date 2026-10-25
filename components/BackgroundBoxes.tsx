"use client";

import { useEffect, useRef, useState } from "react";

const CELL = 56;
const LIFE = 3200; // ms a lit square stays on screen
const colors = ["var(--red)", "var(--navy)", "#f2b233"];

type Square = { id: number; x: number; y: number; color: string };

// Fixed graph-paper grid behind the whole site. Random cells softly light up,
// and on desktop the cell under the cursor glows.
export default function BackgroundBoxes() {
  const [squares, setSquares] = useState<Square[]>([]);
  const [trail, setTrail] = useState<Square[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    // Random positions are only generated after mount, so SSR and client markup match.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const spawn = () => {
      const cols = Math.ceil(window.innerWidth / CELL);
      const rows = Math.ceil(window.innerHeight / CELL);
      const sq: Square = {
        id: nextId.current++,
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setSquares((s) => [...s.slice(-14), sq]);
      setTimeout(() => setSquares((s) => s.filter((q) => q.id !== sq.id)), LIFE);
    };

    const id = setInterval(spawn, 450);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const x = Math.floor(e.clientX / CELL);
      const y = Math.floor(e.clientY / CELL);
      // Leave a short fading trail of the cells the cursor passed through.
      setTrail((t) => {
        const last = t[t.length - 1];
        if (last && last.x === x && last.y === y) return t;
        return [...t.slice(-7), { id: nextId.current++, x, y, color: "" }];
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      clearInterval(id);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="bg-boxes" aria-hidden>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="bg-grid" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
            <path d={`M${CELL} 0H0V${CELL}`} fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grid)" />
        {squares.map((s) => (
          <rect
            key={s.id}
            className="bg-box"
            x={s.x * CELL + 1}
            y={s.y * CELL + 1}
            width={CELL - 1}
            height={CELL - 1}
            fill={s.color}
          />
        ))}
        {trail.map((s) => (
          <rect
            key={s.id}
            className="bg-box-hover"
            x={s.x * CELL + 1}
            y={s.y * CELL + 1}
            width={CELL - 1}
            height={CELL - 1}
          />
        ))}
      </svg>
    </div>
  );
}
