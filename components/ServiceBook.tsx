"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { chapters, type Chapter } from "./chapters";

type Flip = { from: number; to: number; dir: 1 | -1 };
type Drag = { x: number; w: number; dir: 0 | 1 | -1; flip: Flip | null };

const ease = [0.645, 0.045, 0.355, 1] as const;

function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return mobile;
}

// Synthesised paper rustle: a short burst of filtered noise, no audio file needed.
function useRustle() {
  const ctx = useRef<AudioContext | null>(null);
  return useCallback(() => {
    try {
      ctx.current ??= new AudioContext();
      const ac = ctx.current;
      const dur = 0.5;
      const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / data.length;
        // Crackly noise with a fast attack and a long papery tail.
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.2) * (0.6 + 0.4 * Math.random());
      }
      const src = ac.createBufferSource();
      src.buffer = buf;
      const band = ac.createBiquadFilter();
      band.type = "bandpass";
      band.Q.value = 0.8;
      band.frequency.setValueAtTime(1800, ac.currentTime);
      band.frequency.exponentialRampToValueAtTime(5200, ac.currentTime + dur);
      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.0001, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.35, ac.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
      src.connect(band).connect(gain).connect(ac.destination);
      src.start();
    } catch {
      // Audio is a nicety; ignore browsers that block it.
    }
  }, []);
}

const tone = (ch: Chapter) => ({ ["--tone" as string]: ch.color });

function LeftPage({ ch, n }: { ch: Chapter; n: number }) {
  return (
    <div className="pg pg-left" style={tone(ch)}>
      <span className="pg-kicker">Chapter {ch.roman}</span>
      <div className="pg-art">
        <span className="pg-ring" />
        <span className="pg-ring pg-ring-2" />
        <ch.Icon className="pg-icon" />
      </div>
      <h3 className="pg-heading">{ch.title}</h3>
      <p className="pg-quote">“{ch.tagline}”</p>
      <span className="pg-num">{n * 2 + 1}</span>
    </div>
  );
}

function RightPage({ ch, n }: { ch: Chapter; n: number }) {
  return (
    <div className="pg pg-right" style={tone(ch)}>
      <p className="pg-desc">
        <span className="pg-dropcap">{ch.desc[0]}</span>
        {ch.desc.slice(1)}
      </p>
      <h4 className="pg-sub">What&apos;s included</h4>
      <ul className="pg-list">
        {ch.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <div className="pg-meta">
        <div>
          <small>Timeline</small>
          <strong>{ch.timeline}</strong>
        </div>
        <div>
          <small>Ideal for</small>
          <strong>{ch.ideal}</strong>
        </div>
      </div>
      <a href="/contact" className="btn pg-cta">
        Start this chapter <span aria-hidden>→</span>
      </a>
      <span className="pg-num">{n * 2 + 2}</span>
    </div>
  );
}

function SinglePage({ ch, n }: { ch: Chapter; n: number }) {
  return (
    <div className="pg pg-single" style={tone(ch)}>
      <div className="pg-single-head">
        <div className="pg-art pg-art-sm">
          <ch.Icon className="pg-icon" />
        </div>
        <div>
          <span className="pg-kicker">Chapter {ch.roman}</span>
          <h3 className="pg-heading">{ch.title}</h3>
        </div>
      </div>
      <p className="pg-quote">“{ch.tagline}”</p>
      <p className="pg-desc">
        <span className="pg-dropcap">{ch.desc[0]}</span>
        {ch.desc.slice(1)}
      </p>
      <ul className="pg-list">
        {ch.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <div className="pg-meta">
        <div>
          <small>Timeline</small>
          <strong>{ch.timeline}</strong>
        </div>
        <div>
          <small>Ideal for</small>
          <strong>{ch.ideal}</strong>
        </div>
      </div>
      <a href="/contact" className="btn pg-cta">
        Start this chapter <span aria-hidden>→</span>
      </a>
      <span className="pg-num">{n + 1}</span>
    </div>
  );
}

// Stacked page edges: more sheets on the side you've already read.
function stack(count: number, side: 1 | -1) {
  const layers = Math.max(1, Math.round(count));
  return Array.from({ length: layers }, (_, i) => {
    const d = i + 1;
    return `${side * d * 1.6}px ${d * 0.9}px 0 ${i % 2 ? "#fbf7ee" : "#ddd3bd"}`;
  }).join(", ");
}

export default function ServiceBook() {
  const [current, setCurrent] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [sound, setSound] = useState(true);
  const mobile = useMobile();
  const rustle = useRustle();
  const busy = useRef(false);
  const drag = useRef<Drag | null>(null);

  // Rotation of the turning sheet; shading and shadows are derived from it.
  const angle = useMotionValue(0);
  const turned = useTransform(angle, (a) => Math.abs(a));
  const frontShade = useTransform(turned, [0, 90], [0, 0.5]);
  const backShade = useTransform(turned, [90, 180], [0.5, 0]);
  const castShade = useTransform(turned, [0, 90, 180], [0, 0.35, 0]);
  const sheen = useTransform(turned, [0, 45, 90, 135, 180], [0, 0.5, 0, 0.35, 0]);

  const startAngle = (dir: 1 | -1) => (mobile && dir === -1 ? -180 : 0);
  const endAngle = (dir: 1 | -1) => (mobile ? (dir === 1 ? -180 : 0) : dir === 1 ? -180 : 180);

  const settle = (f: Flip, commit: boolean) => {
    busy.current = true;
    const target = commit ? endAngle(f.dir) : startAngle(f.dir);
    const remaining = Math.abs(target - angle.get()) / 180;
    animate(angle, target, {
      duration: 0.25 + remaining * 0.8,
      ease,
      onComplete: () => {
        busy.current = false;
        if (commit) setCurrent(f.to);
        setFlip(null);
      },
    });
  };

  const begin = (to: number): Flip | null => {
    if (flip || busy.current || to === current || to < 0 || to >= chapters.length) return null;
    const f: Flip = { from: current, to, dir: to > current ? 1 : -1 };
    angle.set(startAngle(f.dir));
    setFlip(f);
    if (sound) rustle();
    return f;
  };

  const go = (to: number) => {
    const f = begin(to);
    if (f) settle(f, true);
  };

  const goRef = useRef(go);
  goRef.current = go;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goRef.current(current + 1);
      if (e.key === "ArrowLeft") goRef.current(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  // Drag a page: it follows the pointer, and turns if released past ~30%.
  const pointer = {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      if (flip || busy.current || (e.target as HTMLElement).closest("a, button")) return;
      const r = e.currentTarget.getBoundingClientRect();
      const dir = mobile ? 0 : e.clientX - r.left > r.width / 2 ? 1 : -1;
      drag.current = { x: e.clientX, w: r.width, dir, flip: null };
    },
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.x;
      if (!d.flip) {
        if (Math.abs(dx) < 8) return;
        const dir: 1 | -1 = d.dir || (dx < 0 ? 1 : -1);
        if ((dir === 1 && dx > 0) || (dir === -1 && dx < 0)) return;
        d.flip = begin(current + dir);
        if (!d.flip) {
          drag.current = null;
          return;
        }
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      const p = Math.min(1, Math.max(0, (d.flip.dir === 1 ? -dx : dx) / d.w));
      // Mobile back-turns come in from -180°; everything else turns away from 0°.
      angle.set(mobile && d.flip.dir === -1 ? -180 + 180 * p : d.flip.dir * -180 * p);
    },
    onPointerUp: () => {
      const d = drag.current;
      drag.current = null;
      if (!d?.flip) return;
      const p = Math.abs(angle.get() - startAngle(d.flip.dir)) / 180;
      settle(d.flip, p > 0.3);
    },
  };

  const active = flip ? flip.to : current;

  // Keep the active bookmark visible when the tab row scrolls (mobile).
  const tocRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = tocRef.current;
    const tab = nav?.children[active] as HTMLElement | undefined;
    if (!nav || !tab) return;
    nav.scrollTo({ left: tab.offsetLeft - nav.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const read = current / (chapters.length - 1);
  const leftStack = { boxShadow: stack(1 + read * 7, -1) };
  const rightStack = { boxShadow: stack(1 + (1 - read) * 7, 1) };

  // Front cover swings open over the spine the first time the book scrolls into view.
  const frontCover = (
    <motion.div
      className={`sbook-frontcover${mobile ? " is-single" : ""}`}
      initial={{ rotateY: 0, opacity: 1 }}
      whileInView={{ rotateY: -180, opacity: [1, 1, 0] }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        rotateY: { duration: 1.6, delay: 0.3, ease },
        opacity: { duration: 1.9, delay: 0.3, times: [0, 0.82, 1] },
      }}
      aria-hidden
    >
      <div className="sbook-frontcover-front leather">
        <span className="sbook-emboss" />
        <Image src="/logo-1.png" alt="" width={72} height={121} />
        <strong>The Book of Services</strong>
        <small>Kitaabish</small>
      </div>
      <div className="sbook-frontcover-back leather" />
    </motion.div>
  );

  const shade = (s: typeof frontShade, side: "l" | "r") => (
    <motion.div className={`sbook-shade sbook-shade-${side}`} style={{ opacity: s }} />
  );

  let book: React.ReactNode;
  if (mobile) {
    const under = flip ? (flip.dir === 1 ? flip.to : flip.from) : current;
    const top = flip ? (flip.dir === 1 ? flip.from : flip.to) : 0;
    book = (
      <div className="sbook sbook-single" {...pointer} onPointerCancel={pointer.onPointerUp}>
        <div className="sbook-page sbook-paper" style={rightStack}>
          <SinglePage ch={chapters[under]} n={under} />
          <span className="sbook-corner" aria-hidden />
        </div>
        {flip && <motion.div className="sbook-cast sbook-cast-single" style={{ opacity: castShade }} />}
        {flip && (
          <motion.div className="sbook-flipper is-single" style={{ rotateY: angle }}>
            <div className="sbook-face sbook-paper">
              <SinglePage ch={chapters[top]} n={top} />
              {shade(frontShade, "r")}
              <motion.div className="sbook-sheen" style={{ opacity: sheen }} />
            </div>
            <div className="sbook-face sbook-back sbook-paper sbook-blank">{shade(backShade, "l")}</div>
          </motion.div>
        )}
        {frontCover}
      </div>
    );
  } else {
    const leftIdx = flip ? (flip.dir === 1 ? flip.from : flip.to) : current;
    const rightIdx = flip ? (flip.dir === 1 ? flip.to : flip.from) : current;
    book = (
      <div className="sbook" {...pointer} onPointerCancel={pointer.onPointerUp}>
        <div className="sbook-page sbook-left sbook-paper" style={leftStack}>
          <LeftPage ch={chapters[leftIdx]} n={leftIdx} />
        </div>
        <div className="sbook-page sbook-right sbook-paper" style={rightStack}>
          <RightPage ch={chapters[rightIdx]} n={rightIdx} />
          {current < chapters.length - 1 && <span className="sbook-corner" aria-hidden />}
        </div>
        <div className="sbook-spine" aria-hidden />
        {flip && <motion.div className="sbook-cast" style={{ opacity: castShade }} />}
        {flip && (
          <motion.div className={`sbook-flipper ${flip.dir === 1 ? "is-fwd" : "is-back"}`} style={{ rotateY: angle }}>
            <div className="sbook-face sbook-paper">
              {flip.dir === 1 ? (
                <RightPage ch={chapters[flip.from]} n={flip.from} />
              ) : (
                <LeftPage ch={chapters[flip.from]} n={flip.from} />
              )}
              {shade(frontShade, flip.dir === 1 ? "r" : "l")}
              <motion.div className="sbook-sheen" style={{ opacity: sheen }} />
            </div>
            <div className="sbook-face sbook-back sbook-paper">
              {flip.dir === 1 ? (
                <LeftPage ch={chapters[flip.to]} n={flip.to} />
              ) : (
                <RightPage ch={chapters[flip.to]} n={flip.to} />
              )}
              {shade(backShade, flip.dir === 1 ? "l" : "r")}
            </div>
          </motion.div>
        )}
        {frontCover}
      </div>
    );
  }

  return (
    <section className="sbook-section" id="chapters">
      <p className="sbook-hint">Drag a page, tap a bookmark or use the arrows to turn the page.</p>

      <nav className="sbook-toc" aria-label="Service chapters" ref={tocRef}>
        {chapters.map((ch, i) => (
          <button
            key={ch.title}
            className={`sbook-tab${i === active ? " is-active" : ""}`}
            style={tone(ch)}
            onClick={() => go(i)}
            aria-current={i === active}
          >
            <span className="sbook-tab-roman">{ch.roman}</span>
            <span className="sbook-tab-title">{ch.title}</span>
          </button>
        ))}
      </nav>

      <div className="sbook-stage">
        <div className="sbook-cover leather">{book}</div>
        <div className="sbook-shadow" aria-hidden />
      </div>

      <div className="sbook-controls">
        <button className="sbook-btn" onClick={() => go(active - 1)} disabled={!!flip || current === 0} aria-label="Previous chapter">
          ←
        </button>
        <div className="sbook-progress">
          <span>
            Chapter <strong>{chapters[active].roman}</strong> of {chapters.length}
          </span>
          <div className="sbook-bar">
            <motion.div
              className="sbook-bar-fill"
              animate={{ width: `${((active + 1) / chapters.length) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
        <button
          className="sbook-btn"
          onClick={() => go(active + 1)}
          disabled={!!flip || current === chapters.length - 1}
          aria-label="Next chapter"
        >
          →
        </button>
      </div>
      <button className="sbook-sound" onClick={() => setSound((s) => !s)} aria-pressed={sound}>
        {sound ? "🔊 Page sound on" : "🔈 Page sound off"}
      </button>
    </section>
  );
}
