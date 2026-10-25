"use client";

import { motion, useScroll, useSpring } from "motion/react";

// Thin bar under the navbar that fills as you read the article.
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return <motion.div className="read-progress" style={{ scaleX }} aria-hidden />;
}
