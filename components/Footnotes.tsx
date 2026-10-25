"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const faqs = [
  {
    q: "Do I keep the rights and royalties to my book?",
    a: "Always. You own 100% of your rights and royalties — even with ghostwriting, your name goes on the cover.",
  },
  {
    q: "How long does it take to publish a book?",
    a: "It depends on where you start. Editing and publishing a finished manuscript takes a few weeks; ghostwriting from scratch usually takes 3–4 months.",
  },
  {
    q: "Can I choose only the services I need?",
    a: "Yes. Every chapter of our services can be booked on its own, or combined into a package tailored to your book.",
  },
  {
    q: "Which genres do you work with?",
    a: "Fiction, memoir, business, self-help, poetry, children's books and more — our team covers 30+ genres.",
  },
  {
    q: "Will I be involved during the process?",
    a: "As much as you like. You review every milestone, and nothing moves forward without your approval.",
  },
];

const marks = ["¹", "²", "³", "⁴", "⁵"];

// FAQ styled as the footnotes at the bottom of a page.
export default function Footnotes() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="footnotes">
      <div className="sbook-heading">
        <span className="eyebrow">Footnotes</span>
        <h2>
          Questions, <em>answered</em>
        </h2>
      </div>
      <ol className="fn-list">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <li key={f.q} className={isOpen ? "is-open" : ""}>
              <button className="fn-q" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                <sup>{marks[i]}</sup>
                <span>{f.q}</span>
                <span className="fn-toggle" aria-hidden>
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="fn-a"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
