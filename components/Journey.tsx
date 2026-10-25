"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Each book gets its own binding style so the shelf doesn't look cloned.
type Binding = "bands" | "label" | "foil";

const steps: { title: string; color: string; text: string; binding: Binding; width: number; height: number }[] = [
  {
    title: "Discovery",
    binding: "bands",
    width: 68,
    height: 86,
    color: "#2c2690",
    text: "A free consultation to understand your idea, audience and goals — then a clear plan, timeline and quote.",
  },
  {
    title: "Writing",
    binding: "label",
    width: 74,
    height: 96,
    color: "#2f7d3a",
    text: "Your manuscript takes shape chapter by chapter, with reviews at every milestone so it always sounds like you.",
  },
  {
    title: "Editing",
    binding: "foil",
    width: 62,
    height: 82,
    color: "#a8740c",
    text: "Developmental, line and copy edits polish the story until every sentence earns its place on the page.",
  },
  {
    title: "Design",
    binding: "bands",
    width: 70,
    height: 90,
    color: "#b3264f",
    text: "A scroll-stopping cover and a professionally formatted interior for print and every eBook store.",
  },
  {
    title: "Publishing",
    binding: "label",
    width: 66,
    height: 100,
    color: "#1f6f86",
    text: "ISBNs, listings and distribution handled — your book goes live in stores around the world.",
  },
  {
    title: "Launch",
    binding: "foil",
    width: 72,
    height: 88,
    color: "#c62a32",
    text: "Marketing campaigns, reviews and reader outreach turn your launch into lasting momentum.",
  },
];

// Process shown as book spines on a shelf; picking one pulls it out and reveals the step.
export default function Journey() {
  const [active, setActive] = useState(0);

  return (
    <section className="journey">
      <div className="sbook-heading">
        <span className="eyebrow">How it works</span>
        <h2>
          From manuscript <em>to bookshelf</em>
        </h2>
        <p>Six steps, one dedicated team. Pick a spine to read each step.</p>
      </div>

      <div className="shelf">
        <div className="shelf-books">
          <span className="bookend" aria-hidden />
          {steps.map((s, i) => (
            <motion.button
              key={s.title}
              className={`spine spine-${s.binding}${i === active ? " is-active" : ""}`}
              style={{
                ["--c" as string]: s.color,
                ["--w" as string]: `${s.width}px`,
                ["--h" as string]: `${s.height}%`,
              }}
              initial={{ y: -260, opacity: 0, rotate: -8 }}
              whileInView={{ y: 0, opacity: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: "spring", stiffness: 180, damping: 16, delay: i * 0.12 }}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              aria-pressed={i === active}
            >
              <span className="spine-top" aria-hidden />
              <span className="spine-ridge spine-ridge-top" aria-hidden />
              <span className="spine-num">{["I", "II", "III", "IV", "V", "VI"][i]}</span>
              <span className="spine-title">{s.title}</span>
              <span className="spine-emblem" aria-hidden>
                ✦
              </span>
              <span className="spine-ridge spine-ridge-bottom" aria-hidden />
            </motion.button>
          ))}
          {/* Decorative extras: a leaning book and a small flat stack */}
          <motion.span
            className="lean-book"
            aria-hidden
            initial={{ rotate: 0, opacity: 0 }}
            whileInView={{ rotate: -14, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: "spring", stiffness: 90, damping: 12, delay: 0.9 }}
          />
          <motion.span
            className="flat-stack"
            aria-hidden
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span />
            <span />
          </motion.span>
        </div>
        <div className="shelf-board" />
      </div>

      <div className="journey-card-wrap">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="journey-card"
            style={{ ["--c" as string]: steps[active].color }}
            initial={{ opacity: 0, y: 16, rotateX: -12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <span className="journey-step">Step 0{active + 1}</span>
            <h3>{steps[active].title}</h3>
            <p>{steps[active].text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
