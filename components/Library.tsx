"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Art, artAccent } from "@/lib/artworks";
import type { CoverArt, PortfolioBook } from "@/lib/portfolio";


type CoverBook = Pick<PortfolioBook, "title" | "author" | "genre" | "cover">;

export function Cover({ book, big = false }: { book: CoverBook; big?: boolean }) {
  const vars = {
    ["--c1" as string]: book.cover.c1,
    ["--c2" as string]: book.cover.c2,
    ["--fg" as string]: book.cover.fg,
    ["--art-accent" as string]: artAccent(book.cover.c1),
  };
  return (
    <div className={`book pbook${big ? " pbook-big" : ""}`} style={vars}>
      <div className="book-face book-front">
        <span className="book-label">{book.genre}</span>
        <span className="book-title">{book.title}</span>
        <Art id={book.cover.art} />
        <span className="book-author">{book.author}</span>
      </div>
      <div className="book-face book-pages" />
      <div className="book-face book-spine">
        <span>{book.title}</span>
      </div>
      <div className="book-face book-back" />
    </div>
  );
}

function Details({ book, onClose }: { book: PortfolioBook; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      className="lib-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={book.title}
    >
      <motion.div
        className="lib-card"
        style={{ ["--c" as string]: book.cover.c1 }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="lib-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <motion.div className="lib-card-cover" layoutId={`cover-${book.slug}`}>
          <Cover book={book} big />
        </motion.div>
        <div className="lib-card-body">
          <span className="eyebrow">{book.genre}</span>
          <h2>{book.title}</h2>
          <p className="lib-by">
            by <strong>{book.author}</strong> · {book.year} · {book.pages} pages
          </p>
          <p className="lib-blurb">{book.blurb}</p>
          {book.quote && <blockquote className="lib-quote">“{book.quote}”</blockquote>}
          <h4 className="pg-sub">What we did</h4>
          <ul className="lib-chips">
            {book.services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <h4 className="pg-sub">Available as</h4>
          <ul className="lib-chips lib-chips-plain">
            {book.formats.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <a href="/contact" className="btn btn-red lib-cta">
            Start a book like this
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Library({ books, error }: { books: PortfolioBook[]; error?: string }) {
  const [genre, setGenre] = useState("All");
  const [open, setOpen] = useState<string | null>(null);

  const genres = useMemo(() => ["All", ...Array.from(new Set(books.map((b) => b.genre)))], [books]);
  const shown = genre === "All" ? books : books.filter((b) => b.genre === genre);
  const selected = books.find((b) => b.slug === open) ?? null;

  if (error || books.length === 0) {
    return (
      <section className="lib-empty">
        <p>{error ?? "Our library is being stocked — check back soon."}</p>
      </section>
    );
  }

  return (
    <section className="library">
      <p className="lib-count">
        {books.length} books · {genres.length - 1} genres
      </p>

      <LayoutGroup>
        <div className="lib-filters" role="tablist" aria-label="Filter by genre">
          {genres.map((g) => (
            <button
              key={g}
              role="tab"
              aria-selected={g === genre}
              className={`lib-filter${g === genre ? " is-active" : ""}`}
              onClick={() => setGenre(g)}
            >
              {g === genre && <motion.span layoutId="lib-filter-pill" className="lib-filter-pill" />}
              <span>{g}</span>
            </button>
          ))}
        </div>

        <motion.ul className="lib-grid" layout>
          <AnimatePresence mode="popLayout">
            {shown.map((b, i) => (
              <motion.li
                key={b.slug}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="lib-item"
              >
                <button className="lib-book" onClick={() => setOpen(b.slug)} aria-label={`${b.title} by ${b.author}`}>
                  <motion.div className="pbook-wrap" layoutId={`cover-${b.slug}`}>
                    {open !== b.slug && <Cover book={b} />}
                  </motion.div>
                  <span className="lib-shadow" aria-hidden />
                  <span className="lib-meta">
                    <strong>{b.title}</strong>
                    <span>
                      {b.author} · {b.genre}
                    </span>
                  </span>
                  {b.featured && <span className="lib-badge">Featured</span>}
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <AnimatePresence>{selected && <Details book={selected} onClose={() => setOpen(null)} />}</AnimatePresence>
      </LayoutGroup>
    </section>
  );
}
