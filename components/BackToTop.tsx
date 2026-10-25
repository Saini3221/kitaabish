"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

// Floating "back to top" button whose ring fills with page progress.
export default function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 700));

  return (
    <motion.button
      className="to-top"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 20, pointerEvents: show ? "auto" : "none" }}
      transition={{ duration: 0.3 }}
    >
      <svg viewBox="0 0 48 48" className="to-top-ring" aria-hidden>
        <circle cx="24" cy="24" r="21" />
        <motion.circle cx="24" cy="24" r="21" style={{ pathLength: scrollYProgress }} />
      </svg>
      <svg viewBox="0 0 24 24" className="to-top-arrow" aria-hidden>
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </motion.button>
  );
}
