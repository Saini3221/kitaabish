"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import JourneyBadge from "./JourneyBadge";
import { FrameTextIcon, HeartEyesIcon, PenIcon, WandIcon } from "./icons";

const services = [
  {
    title: "Ghostwriting",
    desc: "Your ideas, our words. Seasoned ghostwriters shape your story in your voice — from first outline to final chapter.",
    color: "#8fe08a",
    Icon: PenIcon,
  },
  {
    title: "Book Editing",
    desc: "Developmental, line and copy editing that tightens pacing, sharpens prose and makes every page earn its place.",
    color: "#c8c95a",
    Icon: WandIcon,
  },
  {
    title: "Book Formatting",
    desc: "Print-ready interiors and flawless eBook layouts that look professional on every shelf, screen and device.",
    color: "#5b5bd6",
    Icon: FrameTextIcon,
  },
  {
    title: "Book Marketing",
    desc: "Launch campaigns, author branding and reader outreach that put your book in front of the audience it deserves.",
    color: "#e0565f",
    Icon: HeartEyesIcon,
  },
];

function useIsDesktop() {
  // Off until mounted so the server render (and mobile) shows rows in place.
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return desktop;
}

function ServiceRow({
  service,
  index,
  progress,
  animate,
}: {
  service: (typeof services)[number];
  index: number;
  progress: MotionValue<number>;
  animate: boolean;
}) {
  // Each row starts a little later so the icons land one after another.
  const start = index * 0.1;
  const end = 0.55 + index * 0.1;
  const headX = useTransform(progress, [start, end], ["62vw", "0vw"]);
  const pillX = useTransform(progress, [start, end], [160 + index * 18, 0]);
  const pillOpacity = useTransform(progress, [start, start + 0.25], [0.25, 1]);
  const descOpacity = useTransform(progress, [end - 0.08, end], [0, 1]);
  const { Icon } = service;

  return (
    <motion.li
      className="svc-row"
      style={{ ["--c" as string]: service.color, ...(animate ? { x: pillX, opacity: pillOpacity } : {}) }}
      tabIndex={0}
    >
      <span className="svc-fill" aria-hidden />
      <span className="svc-disk" aria-hidden />
      <motion.div className="svc-head" style={animate ? { x: headX } : undefined}>
        <span className="svc-icon">
          <Icon />
        </span>
        <h3 className="svc-title">{service.title}</h3>
      </motion.div>
      <motion.p className="svc-desc" style={animate ? { opacity: descOpacity } : undefined}>
        {service.desc}
      </motion.p>
    </motion.li>
  );
}

export default function Services() {
  const listRef = useRef<HTMLUListElement>(null);
  const animate = useIsDesktop();
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start end", "center center"],
  });

  return (
    <section className="services-wrap" id="services">
      <div className="services">
        <svg className="services-notch" viewBox="0 0 460 72" preserveAspectRatio="none" aria-hidden>
          <path d="M0 0C95 0 120 72 230 72S365 0 460 0Z" />
        </svg>
        <JourneyBadge />

        <header className="services-header">
          <h2>
            Professional Book Writing <span>Services</span>
          </h2>
          <p>From ghostwriting to editing to publishing, we handle the entire spectrum of book creation encompassing all genres</p>
        </header>

        <ul className="svc-list" ref={listRef}>
          {services.map((s, i) => (
            <ServiceRow key={s.title} service={s} index={i} progress={scrollYProgress} animate={animate} />
          ))}
        </ul>

        <a href="/services" className="svc-more">
          View All Services
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </a>
      </div>
    </section>
  );
}
