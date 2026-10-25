"use client";

import { useEffect, useState } from "react";
import { useMotionValue, useSpring } from "motion/react";
import Book3D, { type Book } from "./Book3D";

const covers: Book[] = [
  { side: "left", title: "The Silent River", author: "A. Mehra", label: "A Novel", tone: "navy", depth: 26 },
  { side: "left", title: "Ink & Ember", author: "R. Kaur", label: "Poetry", tone: "red", depth: 14, sticker: "Best\nseller" },
  { side: "right", title: "Paper Kingdoms", author: "S. Iqbal", label: "Fantasy", tone: "gold", depth: 22 },
  { side: "right", title: "Letters Home", author: "J. Das", label: "Memoir", tone: "teal", depth: 12 },
];

const words = ["Masterpiece", "Bestseller", "Legacy"];
const authors = [
  { i: "AM", c: "#2c2690" },
  { i: "RK", c: "#e0343c" },
  { i: "SI", c: "#d9921a" },
  { i: "JD", c: "#1f7891" },
];

// Entrance runs in CSS (.reveal) so content is never stuck hidden waiting for JS.
const delay = (s: number) => ({ animationDelay: `${s}s` });

export default function Hero() {
  const [word, setWord] = useState(0);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const id = setInterval(() => setWord((w) => (w + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, []);

  // Pointer events cover both mouse hover and finger drags on touch screens.
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section className="hero" id="home" onPointerMove={onMove}>
      <div className="hero-glow" aria-hidden />

      <div className="hero-inner">
        <span className="hero-pill reveal">
          <span className="hero-pill-dot" /> Writing · Editing · Publishing · Marketing
        </span>

        <h1 className="hero-title reveal" style={delay(0.1)}>
          Turn Your Story Into a{" "}
          <span className="hero-word">
            {/* All words share one grid cell; CSS transitions swap them, so the width never jumps */}
            <span className="hero-word-stack">
              {words.map((w, i) => (
                <em
                  key={w}
                  className={i === word ? "is-active" : i === (word + words.length - 1) % words.length ? "is-prev" : ""}
                  aria-hidden={i !== word}
                >
                  {w}
                </em>
              ))}
            </span>
            <svg className="hero-underline" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden>
              <path d="M4 14C60 5 140 3 296 9" pathLength={1} />
            </svg>
          </span>
        </h1>

        <p className="hero-sub reveal" style={delay(0.2)}>
          Explore our full range of writing, editorial, design, and marketing solutions, guaranteeing your book
          sparkles and connects with a broad audience.
        </p>

        <div className="hero-ctas reveal" style={delay(0.3)}>
          <a href="/contact" className="btn btn-red">
            Start Your Book
            <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a href="#services" className="btn btn-ghost">
            Explore Services
          </a>
        </div>

        <div className="hero-trust reveal" style={delay(0.4)}>
          <div className="avatars">
            {authors.map((a) => (
              <span key={a.i} style={{ background: a.c }}>
                {a.i}
              </span>
            ))}
          </div>
          <div className="trust-text">
            <span className="stars">★★★★★</span>
            <span>
              Loved by <strong>1,200+ authors</strong> worldwide
            </span>
          </div>
        </div>
      </div>

      {/* Desktop: books float around the text. Mobile: they fan out below it. */}
      <div className="book-stage">
        {covers.map((c, i) => (
          <Book3D key={c.title} book={c} index={i} mx={mx} my={my} />
        ))}

        <div className="chip chip-left reveal" style={delay(1.1)} aria-hidden>
          <span className="chip-icon chip-green">✓</span>
          <span>
            <strong>Manuscript edited</strong>
            <small>Chapter 12 of 12</small>
          </span>
        </div>
        <div className="chip chip-right reveal" style={delay(1.25)} aria-hidden>
          <span className="chip-icon chip-gold">#1</span>
          <span>
            <strong>New Release</strong>
            <small>Literary Fiction</small>
          </span>
        </div>
      </div>

      <div className="hero-outline" aria-hidden>
        MASTERPIECE
      </div>
    </section>
  );
}
