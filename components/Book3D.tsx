"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { Art } from "@/lib/artworks";

export type BookTone = "navy" | "red" | "gold" | "teal";

export type Book = {
  side: "left" | "right";
  title: string;
  author: string;
  label: string;
  tone: BookTone;
  depth: number;
  sticker?: string;
};

// Hero books keep their tone names; each maps to an artwork from the shared library.
const toneArt: Record<BookTone, string> = { navy: "river", red: "flame", gold: "castle", teal: "letter" };

export default function Book3D({
  book,
  index,
  mx,
  my,
}: {
  book: Book;
  index: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  // Left books turn their page edge to the centre, right books their spine.
  const base = book.side === "left" ? -28 : 28;
  const x = useTransform(mx, (v) => v * book.depth);
  const y = useTransform(my, (v) => v * book.depth);
  const rotateY = useTransform(mx, (v) => base + v * 22);
  const rotateX = useTransform(my, (v) => -v * 14);

  return (
    <div
      className={`cover-wrap cover-${index} cover-from-${book.side}`}
      style={{ animationDelay: `${0.3 + index * 0.12}s` }}
      aria-hidden
    >
      <motion.div className={`book book-${book.tone}`} style={{ x, y, rotateY, rotateX }}>
        <div className="book-face book-front">
          <span className="book-label">{book.label}</span>
          <span className="book-title">{book.title}</span>
          <Art id={toneArt[book.tone]} />
          <span className="book-author">{book.author}</span>
          {book.sticker && <span className="book-sticker">{book.sticker}</span>}
        </div>
        <div className="book-face book-pages" />
        <div className="book-face book-spine">
          <span>{book.title}</span>
        </div>
        <div className="book-face book-back" />
      </motion.div>
      <div className="book-shadow" />
    </div>
  );
}
