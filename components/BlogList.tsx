"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import PostCard from "./PostCard";
import type { Post } from "@/lib/blog-utils";

export default function BlogList({ posts, error }: { posts: Post[]; error?: string }) {
  const [cat, setCat] = useState("All");
  const cats = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);

  if (error || posts.length === 0) {
    return (
      <section className="lib-empty">
        <p>{error ?? "The first stories are being written — check back soon."}</p>
      </section>
    );
  }

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = (cat === "All" ? posts.filter((p) => p !== featured) : posts.filter((p) => p.category === cat));

  return (
    <section className="blog">
      {cat === "All" && (
        <motion.div
          className="blog-featured"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="blog-featured-tag">Featured story</span>
          <PostCard post={featured} featured />
        </motion.div>
      )}

      <LayoutGroup>
        <div className="lib-filters" role="tablist" aria-label="Filter by category">
          {cats.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={c === cat}
              className={`lib-filter${c === cat ? " is-active" : ""}`}
              onClick={() => setCat(c)}
            >
              {c === cat && <motion.span layoutId="blog-filter-pill" className="lib-filter-pill" />}
              <span>{c}</span>
            </button>
          ))}
        </div>

        <motion.ul className="blog-grid" layout>
          <AnimatePresence mode="popLayout">
            {rest.map((p, i) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <PostCard post={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
    </section>
  );
}
