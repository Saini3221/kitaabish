"use client";

import { useMemo, useState } from "react";
import { Cover } from "../Library";
import { Field } from "./FormBits";
import { ART_CATEGORIES, ARTWORKS, Art, artAccent } from "@/lib/artworks";
import type { CoverArt } from "@/lib/portfolio";
import type { FormState } from "@/lib/validation";

type CoverValue = { c1: string; c2: string; fg: string; art: CoverArt };

const presets: { name: string; v: Omit<CoverValue, "art"> }[] = [
  { name: "Navy", v: { c1: "#2f29a0", c2: "#141047", fg: "#ffffff" } },
  { name: "Red", v: { c1: "#ff4747", c2: "#a80d18", fg: "#ffffff" } },
  { name: "Gold", v: { c1: "#f7c95c", c2: "#c98a14", fg: "#2a1a00" } },
  { name: "Teal", v: { c1: "#2c9bb6", c2: "#11495a", fg: "#ffffff" } },
  { name: "Green", v: { c1: "#7bc96f", c2: "#2f7d3a", fg: "#ffffff" } },
  { name: "Black", v: { c1: "#3a3a3a", c2: "#111111", fg: "#f2b233" } },
  { name: "Rose", v: { c1: "#e0567a", c2: "#8e1d45", fg: "#ffffff" } },
  { name: "Violet", v: { c1: "#b693f5", c2: "#5b2fa8", fg: "#ffffff" } },
];

/** Cover colour + artwork inputs with a live 3D preview and a visual artwork picker. */
export default function CoverFields({
  initial,
  title,
  author,
  genre,
  state,
}: {
  initial: CoverValue;
  title: string;
  author: string;
  genre: string;
  state: FormState;
}) {
  const [c, setC] = useState<CoverValue>(initial);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const setColor = (k: "c1" | "c2" | "fg") => (e: React.ChangeEvent<HTMLInputElement>) =>
    setC((prev) => ({ ...prev, [k]: e.target.value }));

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return ARTWORKS.filter(
      (a) => (cat === "All" || a.category === cat) && (!term || `${a.label} ${a.category}`.toLowerCase().includes(term)),
    );
  }, [cat, q]);
  const current = ARTWORKS.find((a) => a.id === c.art);
  const tileStyle = {
    background: `linear-gradient(160deg, ${c.c1}, ${c.c2})`,
    color: c.fg,
    ["--c1" as string]: c.c1,
    ["--art-accent" as string]: artAccent(c.c1),
  };

  return (
    <fieldset className="adm-cover">
      <legend>Cover</legend>
      <div className="adm-cover-grid">
        <div className="adm-cover-preview">
          <Cover book={{ title: title || "Book title", author: author || "Author", genre: genre || "Genre", cover: c }} />
        </div>
        <div className="adm-cover-fields">
          <div className="adm-presets" role="group" aria-label="Colour presets">
            {presets.map((p) => (
              <button
                key={p.name}
                type="button"
                className="adm-preset"
                title={p.name}
                style={{ background: `linear-gradient(135deg, ${p.v.c1}, ${p.v.c2})` }}
                onClick={() => setC((prev) => ({ ...prev, ...p.v }))}
              />
            ))}
          </div>
          <div className="adm-row-3">
            <Field label="Main colour" name="c1" state={state}>
              <input type="color" name="c1" value={c.c1} onChange={setColor("c1")} />
            </Field>
            <Field label="Shadow colour" name="c2" state={state}>
              <input type="color" name="c2" value={c.c2} onChange={setColor("c2")} />
            </Field>
            <Field label="Text colour" name="fg" state={state}>
              <input type="color" name="fg" value={c.fg} onChange={setColor("fg")} />
            </Field>
          </div>
        </div>
      </div>

      {/* Artwork picker */}
      <div className={`adm-art${state?.fieldErrors?.art ? " has-error" : ""}`}>
        <input type="hidden" name="art" value={c.art} />
        <div className="adm-art-head">
          <span className="adm-label">
            Artwork <small>({ARTWORKS.length} designs) — selected: {current?.label ?? c.art}</small>
          </span>
          <input
            type="search"
            className="adm-art-search"
            placeholder="Search artwork…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search artwork"
          />
        </div>
        <div className="adm-art-cats" role="tablist">
          {["All", ...ART_CATEGORIES].map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={cat === k}
              className={`adm-art-cat${cat === k ? " is-active" : ""}`}
              onClick={() => setCat(k)}
            >
              {k}
            </button>
          ))}
        </div>
        <div className="adm-art-grid" role="radiogroup" aria-label="Artwork">
          {shown.map((a) => (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={c.art === a.id}
              title={a.label}
              className={`adm-art-tile${c.art === a.id ? " is-selected" : ""}`}
              onClick={() => setC((prev) => ({ ...prev, art: a.id }))}
            >
              <span className="adm-art-thumb" style={tileStyle}>
                <Art id={a.id} className="adm-art-svg" />
              </span>
              <span className="adm-art-name">{a.label}</span>
            </button>
          ))}
          {shown.length === 0 && <p className="adm-muted">No artwork matches “{q}”.</p>}
        </div>
        {state?.fieldErrors?.art && <span className="adm-field-error">{state.fieldErrors.art}</span>}
      </div>
    </fieldset>
  );
}
