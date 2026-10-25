// Cover artwork library (82 designs). Each draws in a 120×90 box.
// New designs use currentColor (the cover's text colour) plus a gold accent, so they suit any cover colour.

const F = "currentColor";
const A = "var(--art-accent, #f6c453)";

// 4-point sparkle and 5-point star helpers
const spark = (x: number, y: number, r: number) =>
  `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`;
const star5 = (cx: number, cy: number, R: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = ((-90 + i * 36) * Math.PI) / 180;
    const d = i % 2 ? r : R;
    return `${i ? "L" : "M"}${(cx + d * Math.cos(a)).toFixed(1)} ${(cy + d * Math.sin(a)).toFixed(1)}`;
  }).join("") + "Z";
const dots = (pts: number[][]) =>
  pts.map(([x, y], i) => <circle key={`d${i}`} cx={x} cy={y} r="1.4" fill="#fff" opacity=".8" />);

type Art = { id: string; label: string; category: string; draw: () => React.ReactNode };

export const ARTWORKS: Art[] = [
  // ---------- Classics (the original four) ----------
  {
    id: "river",
    label: "Moon & river",
    category: "Classic",
    draw: () => (
      <>
        <circle cx="84" cy="24" r="13" fill="#f6e7b4" />
        <circle cx="90" cy="20" r="11" fill="var(--c1)" />
        {dots([[18, 14], [40, 8], [58, 26], [104, 46], [28, 34]])}
        <path d="M0 62c20-8 40 8 60 0s40-8 60 0v28H0Z" fill="#fff" opacity=".12" />
        <path d="M0 72c20-8 40 8 60 0s40-8 60 0v18H0Z" fill="#fff" opacity=".18" />
        <path d="M0 82c20-6 40 6 60 0s40-6 60 0v8H0Z" fill="#fff" opacity=".25" />
      </>
    ),
  },
  {
    id: "flame",
    label: "Flame & quill",
    category: "Classic",
    draw: () => (
      <>
        <path d="M60 10c10 16 26 24 26 46a26 26 0 0 1-52 0c0-12 8-18 12-26 2 8 6 12 10 12-4-14 0-24 4-32Z" fill="#ffd27a" opacity=".9" />
        <path d="M60 40c6 8 12 12 12 22a12 12 0 0 1-24 0c0-6 4-10 6-14 1 4 3 6 6 6-2-6-1-10 0-14Z" fill="#fff4d6" />
        <path d="M98 6 70 70" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".9" />
        <path d="M98 6c-10 4-22 18-26 40l8-6c4-14 12-26 18-34Z" fill="#fff" opacity=".85" />
      </>
    ),
  },
  {
    id: "castle",
    label: "Castle",
    category: "Classic",
    draw: () => (
      <>
        <path d="M22 86V44h10v-8h8v8h8V30l12-14 12 14v14h8v-8h8v8h10v42Z" fill={F} opacity=".85" />
        <path d="M54 86V66a6 6 0 0 1 12 0v20Z" fill={A} />
        <path d="M60 16V4l10 4-10 4" fill={F} opacity=".85" />
        <rect x="34" y="54" width="6" height="8" rx="3" fill={A} />
        <rect x="80" y="54" width="6" height="8" rx="3" fill={A} />
      </>
    ),
  },
  {
    id: "letter",
    label: "Letter & plane",
    category: "Classic",
    draw: () => (
      <>
        <path d="M14 18c20 10 36 4 52 14s32 6 44-2" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 4" opacity=".7" />
        <path d="m96 22 18-10-8 20-4-6Z" fill="#fff" />
        <rect x="26" y="40" width="68" height="44" rx="4" fill="#fdf6e8" />
        <path d="m26 42 34 24 34-24" fill="none" stroke="#155a6e" strokeWidth="2" />
        <circle cx="80" cy="74" r="6" fill="#e0565f" />
      </>
    ),
  },

  // ---------- Nature ----------
  {
    id: "mountains",
    label: "Sunrise mountains",
    category: "Nature",
    draw: () => (
      <>
        <circle cx="84" cy="28" r="12" fill={A} />
        <path d="M0 90 38 40l22 26 16-18 44 42Z" fill={F} opacity=".85" />
        <path d="m38 40 8 10-8-3-7 4Z" fill="#fff" opacity=".6" />
      </>
    ),
  },
  {
    id: "forest",
    label: "Pine forest",
    category: "Nature",
    draw: () => (
      <>
        <circle cx="96" cy="16" r="7" fill={A} />
        {[18, 40, 62, 84, 104].map((x, i) => {
          const h = 40 + (i % 2) * 14;
          return <path key={x} d={`M${x} ${88 - h}l14 ${h}H${x - 14}Z`} fill={F} opacity={0.55 + 0.15 * (i % 3)} />;
        })}
      </>
    ),
  },
  {
    id: "ocean",
    label: "Ocean waves",
    category: "Nature",
    draw: () => (
      <>
        <circle cx="60" cy="40" r="16" fill={A} />
        <path d="M0 52c15-8 25 8 40 0s25-8 40 0 25 8 40 0v38H0Z" fill={F} opacity=".35" />
        <path d="M0 64c15-8 25 8 40 0s25-8 40 0 25 8 40 0v26H0Z" fill={F} opacity=".55" />
        <path d="M0 76c15-8 25 8 40 0s25-8 40 0 25 8 40 0v14H0Z" fill={F} opacity=".8" />
      </>
    ),
  },
  {
    id: "dunes",
    label: "Desert dunes",
    category: "Nature",
    draw: () => (
      <>
        <circle cx="32" cy="26" r="11" fill={A} />
        <path d="M0 70c30-24 60-24 80-6s30 8 40 4v22H0Z" fill={F} opacity=".45" />
        <path d="M0 80c40-16 70-10 120-2v12H0Z" fill={F} opacity=".8" />
      </>
    ),
  },
  {
    id: "lotus",
    label: "Lotus",
    category: "Nature",
    draw: () => (
      <>
        <path d="M60 30c10 12 10 30 0 44-10-14-10-32 0-44Z" fill={A} />
        <path d="M60 74c-4-16-18-28-34-28 2 16 14 28 34 28Z" fill={F} opacity=".8" />
        <path d="M60 74c4-16 18-28 34-28-2 16-14 28-34 28Z" fill={F} opacity=".8" />
        <path d="M26 82h68" stroke={F} strokeWidth="3" strokeLinecap="round" opacity=".6" />
      </>
    ),
  },
  {
    id: "leaf",
    label: "Leaf",
    category: "Nature",
    draw: () => (
      <>
        <path d="M30 80C30 40 60 14 98 12c0 40-26 68-68 68Z" fill={F} opacity=".85" />
        <path d="M30 80 84 26" stroke={A} strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "tree",
    label: "Tree of life",
    category: "Nature",
    draw: () => (
      <>
        <circle cx="60" cy="36" r="26" fill={F} opacity=".8" />
        <circle cx="42" cy="44" r="16" fill={F} opacity=".6" />
        <circle cx="78" cy="44" r="16" fill={F} opacity=".6" />
        <rect x="56" y="50" width="8" height="34" rx="2" fill={A} />
        <path d="M36 86h48" stroke={A} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "sunflower",
    label: "Sunflower",
    category: "Nature",
    draw: () => (
      <>
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={i} cx="60" cy="25" rx="5" ry="11" fill={A} transform={`rotate(${i * 30} 60 40)`} />
        ))}
        <circle cx="60" cy="40" r="11" fill={F} />
        <path d="M60 52v36" stroke={F} strokeWidth="3" />
      </>
    ),
  },
  {
    id: "snowpeaks",
    label: "Snowy peaks",
    category: "Nature",
    draw: () => (
      <>
        {dots([[14, 14], [46, 10], [100, 22], [90, 8], [20, 40]])}
        <path d="M0 88 30 36l18 22 22-40 50 70Z" fill={F} opacity=".8" />
        <path d="m70 18 9 13-5-2-4 4-4-4-6 3Z" fill="#fff" />
        <path d="m30 36 7 10-4-1-3 3-4-3-4 2Z" fill="#fff" />
      </>
    ),
  },
  {
    id: "rain",
    label: "Rain cloud",
    category: "Nature",
    draw: () => (
      <>
        <path d="M34 50a14 14 0 0 1 4-27 20 20 0 0 1 38-4 15 15 0 0 1 10 31Z" fill={F} opacity=".85" />
        {[40, 54, 68, 82].map((x, i) => (
          <path key={x} d={`M${x} ${58 + (i % 2) * 4}l-4 12`} stroke={A} strokeWidth="3" strokeLinecap="round" />
        ))}
      </>
    ),
  },
  {
    id: "rainbow",
    label: "Rainbow",
    category: "Nature",
    draw: () => (
      <>
        {[36, 28, 20].map((r, i) => (
          <path key={r} d={`M${60 - r} 74a${r} ${r} 0 0 1 ${2 * r} 0`} fill="none" stroke={i === 1 ? A : F} strokeWidth="7" opacity={1 - i * 0.2} />
        ))}
        <circle cx="24" cy="74" r="9" fill="#fff" opacity=".85" />
        <circle cx="96" cy="74" r="9" fill="#fff" opacity=".85" />
      </>
    ),
  },
  {
    id: "cactus",
    label: "Cactus",
    category: "Nature",
    draw: () => (
      <>
        <circle cx="88" cy="20" r="8" fill={A} />
        <path d="M54 86V30a6 6 0 0 1 12 0v56Z" fill={F} opacity=".85" />
        <path d="M54 60H42a6 6 0 0 1-6-6V44a4 4 0 0 1 8 0v8h10" fill={F} opacity=".7" />
        <path d="M66 52h10V40a4 4 0 0 1 8 0v14a6 6 0 0 1-6 6H66" fill={F} opacity=".7" />
        <path d="M30 86h60" stroke={A} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },

  // ---------- Romance ----------
  {
    id: "heart",
    label: "Heart",
    category: "Romance",
    draw: () => (
      <>
        <path d="M60 80S24 58 24 36a16 16 0 0 1 36-8 16 16 0 0 1 36 8c0 22-36 44-36 44Z" fill={F} opacity=".9" />
        <path d="M42 30a8 8 0 0 0-8 8" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".6" />
      </>
    ),
  },
  {
    id: "twohearts",
    label: "Two hearts",
    category: "Romance",
    draw: () => (
      <>
        <path d="M46 74S20 58 20 40a12 12 0 0 1 26-6 12 12 0 0 1 26 6c0 18-26 34-26 34Z" fill={F} opacity=".8" />
        <path d="M76 66S54 52 54 37a10 10 0 0 1 22-5 10 10 0 0 1 22 5c0 15-22 29-22 29Z" fill={A} />
      </>
    ),
  },
  {
    id: "rose",
    label: "Rose",
    category: "Romance",
    draw: () => (
      <>
        <path d="M60 52v34" stroke={A} strokeWidth="3" />
        <path d="M60 70c-10-2-16-10-16-16 8 0 14 6 16 16Z" fill={A} />
        <path d="M60 64c8-2 14-8 14-14-7 0-12 5-14 14Z" fill={A} />
        <circle cx="60" cy="34" r="18" fill={F} opacity=".9" />
        <path d="M60 22c-8 0-10 10-2 12s12-6 6-10M50 32c0 10 10 14 18 8" stroke="#fff" strokeWidth="2" fill="none" opacity=".55" />
      </>
    ),
  },
  {
    id: "loveletter",
    label: "Love letter",
    category: "Romance",
    draw: () => (
      <>
        <rect x="24" y="28" width="72" height="48" rx="4" fill={F} opacity=".85" />
        <path d="m24 30 36 26 36-26" stroke="#fff" strokeWidth="2" fill="none" opacity=".7" />
        <path d="M60 64s-10-6-10-12a5 5 0 0 1 10-2 5 5 0 0 1 10 2c0 6-10 12-10 12Z" fill={A} />
      </>
    ),
  },
  {
    id: "ring",
    label: "Ring",
    category: "Romance",
    draw: () => (
      <>
        <circle cx="60" cy="56" r="22" fill="none" stroke={A} strokeWidth="6" />
        <path d="m50 30 10-14 10 14-10 8Z" fill={F} />
        <path d="m50 30 10 8 10-8" stroke="#fff" strokeWidth="1.5" fill="none" opacity=".6" />
      </>
    ),
  },
  {
    id: "heartballoon",
    label: "Heart balloon",
    category: "Romance",
    draw: () => (
      <>
        <path d="M60 58S34 42 34 26a13 13 0 0 1 26-5 13 13 0 0 1 26 5c0 16-26 32-26 32Z" fill={F} />
        <path d="M60 58c-4 10 4 16 0 28" stroke={A} strokeWidth="2" fill="none" />
      </>
    ),
  },

  // ---------- Mystery & thriller ----------
  {
    id: "keyhole",
    label: "Keyhole",
    category: "Mystery",
    draw: () => (
      <>
        <circle cx="60" cy="45" r="40" fill="none" stroke={A} strokeWidth="2" opacity=".6" />
        <circle cx="60" cy="36" r="14" fill={F} />
        <path d="M52 44h16l6 34H46Z" fill={F} />
      </>
    ),
  },
  {
    id: "magnifier",
    label: "Magnifying glass",
    category: "Mystery",
    draw: () => (
      <>
        <circle cx="52" cy="40" r="16" fill={A} opacity=".35" />
        <circle cx="52" cy="40" r="22" fill="none" stroke={F} strokeWidth="6" />
        <path d="m68 56 22 22" stroke={F} strokeWidth="8" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "eye",
    label: "Watching eye",
    category: "Mystery",
    draw: () => (
      <>
        <path d="M14 45c24-30 68-30 92 0-24 30-68 30-92 0Z" fill={F} opacity=".85" />
        <circle cx="60" cy="45" r="16" fill={A} />
        <circle cx="60" cy="45" r="7" fill="#111" />
        <circle cx="64" cy="41" r="2.5" fill="#fff" />
      </>
    ),
  },
  {
    id: "dagger",
    label: "Dagger",
    category: "Mystery",
    draw: () => (
      <>
        <path d="M60 6 66 52H54Z" fill={F} opacity=".9" />
        <path d="M60 10v40" stroke="#fff" strokeWidth="1.2" opacity=".5" />
        <rect x="42" y="52" width="36" height="6" rx="3" fill={A} />
        <rect x="56" y="58" width="8" height="20" rx="2" fill={F} />
        <circle cx="60" cy="82" r="5" fill={A} />
      </>
    ),
  },
  {
    id: "footprints",
    label: "Footprints",
    category: "Mystery",
    draw: () => (
      <>
        {[
          [40, 76, -10],
          [60, 60, 10],
          [44, 42, -10],
          [64, 26, 10],
        ].map(([x, y, r], i) => (
          <g key={y} transform={`rotate(${r} ${x} ${y})`} fill={i % 2 ? A : F} opacity=".9">
            <ellipse cx={x} cy={y} rx="5" ry="8" />
            <circle cx={x} cy={y - 11} r="2.4" />
          </g>
        ))}
      </>
    ),
  },
  {
    id: "lock",
    label: "Padlock",
    category: "Mystery",
    draw: () => (
      <>
        <path d="M44 42V30a16 16 0 0 1 32 0v12" fill="none" stroke={F} strokeWidth="6" />
        <rect x="36" y="42" width="48" height="38" rx="6" fill={F} />
        <circle cx="60" cy="58" r="5" fill={A} />
        <rect x="58" y="60" width="4" height="10" fill={A} />
      </>
    ),
  },
  {
    id: "fingerprint",
    label: "Fingerprint",
    category: "Mystery",
    draw: () => (
      <>
        {[6, 12, 18, 24, 30].map((r) => (
          <path
            key={r}
            d={`M${60 - r} 70a${r} ${r + 8} 0 0 1 ${2 * r} 0`}
            fill="none"
            stroke={r === 18 ? A : F}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={r > 20 ? "18 6" : undefined}
          />
        ))}
      </>
    ),
  },
  {
    id: "web",
    label: "Spider web",
    category: "Mystery",
    draw: () => (
      <>
        {[0, 45, 90, 135].map((a) => (
          <path key={a} d="M60 10v70" stroke={F} strokeWidth="1.5" transform={`rotate(${a} 60 45)`} opacity=".8" />
        ))}
        {[12, 22, 32].map((r) => (
          <circle key={r} cx="60" cy="45" r={r} fill="none" stroke={F} strokeWidth="1.5" opacity=".7" />
        ))}
        <path d="M92 6v20" stroke={F} strokeWidth="1.2" />
        <circle cx="92" cy="28" r="4" fill={A} />
      </>
    ),
  },

  // ---------- Fantasy ----------
  {
    id: "crown",
    label: "Crown",
    category: "Fantasy",
    draw: () => (
      <>
        <path d="M26 66 22 30l20 16 18-24 18 24 20-16-4 36Z" fill={A} />
        <rect x="26" y="66" width="68" height="10" rx="2" fill={F} />
        {[42, 60, 78].map((x) => (
          <circle key={x} cx={x} cy="56" r="3.5" fill={F} />
        ))}
      </>
    ),
  },
  {
    id: "sword",
    label: "Sword",
    category: "Fantasy",
    draw: () => (
      <>
        <path d="M60 4 65 58H55Z" fill={F} />
        <rect x="40" y="58" width="40" height="5" rx="2.5" fill={A} />
        <rect x="57" y="63" width="6" height="18" fill={A} opacity=".8" />
        <circle cx="60" cy="84" r="4" fill={F} />
      </>
    ),
  },
  {
    id: "crystalball",
    label: "Crystal ball",
    category: "Fantasy",
    draw: () => (
      <>
        <circle cx="60" cy="40" r="26" fill={F} opacity=".55" />
        <path d="M48 30a14 14 0 0 1 10-8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7" />
        <path d={spark(62, 44, 9)} fill={A} />
        <path d="M44 64h32l6 6H38Z" fill={A} />
        <rect x="36" y="70" width="48" height="8" rx="3" fill={F} />
      </>
    ),
  },
  {
    id: "potion",
    label: "Potion",
    category: "Fantasy",
    draw: () => (
      <>
        <path d="M52 14h16v18l18 30a10 10 0 0 1-9 14H43a10 10 0 0 1-9-14l18-30Z" fill={F} opacity=".85" />
        <path d="M40 58h40l5 9a8 8 0 0 1-7 11H42a8 8 0 0 1-7-11Z" fill={A} />
        <rect x="50" y="8" width="20" height="7" rx="2" fill={A} />
        <circle cx="54" cy="68" r="3" fill="#fff" opacity=".7" />
        <circle cx="66" cy="63" r="2" fill="#fff" opacity=".7" />
      </>
    ),
  },
  {
    id: "wand",
    label: "Magic wand",
    category: "Fantasy",
    draw: () => (
      <>
        <path d="m30 80 48-48" stroke={F} strokeWidth="6" strokeLinecap="round" />
        <path d="m78 32 6-6" stroke={A} strokeWidth="6" strokeLinecap="round" />
        <path d={spark(94, 16, 11)} fill={A} />
        <path d={spark(70, 12, 5)} fill={A} />
        <path d={spark(102, 42, 6)} fill={A} />
      </>
    ),
  },
  {
    id: "tower",
    label: "Wizard tower",
    category: "Fantasy",
    draw: () => (
      <>
        <rect x="46" y="30" width="28" height="56" fill={F} opacity=".85" />
        <path d="M42 30 60 6l18 24Z" fill={A} />
        <rect x="55" y="42" width="10" height="14" rx="5" fill={A} />
        <path d="M54 86V74a6 6 0 0 1 12 0v12Z" fill={A} opacity=".8" />
        <path d={spark(24, 20, 6)} fill={A} />
        <path d={spark(96, 30, 4)} fill={A} />
      </>
    ),
  },
  {
    id: "shield",
    label: "Shield",
    category: "Fantasy",
    draw: () => (
      <>
        <path d="M60 8 92 18v24c0 22-14 36-32 44-18-8-32-22-32-44V18Z" fill={F} opacity=".85" />
        <path d="M60 22v52M38 42h44" stroke={A} strokeWidth="5" />
      </>
    ),
  },

  // ---------- Sci-fi ----------
  {
    id: "rocket",
    label: "Rocket",
    category: "Sci-fi",
    draw: () => (
      <>
        {dots([[20, 20], [100, 14], [92, 70], [16, 64]])}
        <path d="M50 62h20l-10 22Z" fill={A} opacity=".8" />
        <path d="M46 48 34 64l12-2ZM74 48l12 16-12-2Z" fill={A} />
        <path d="M60 6c14 12 18 32 14 54H46C42 38 46 18 60 6Z" fill={F} />
        <circle cx="60" cy="32" r="7" fill={A} />
      </>
    ),
  },
  {
    id: "planet",
    label: "Ringed planet",
    category: "Sci-fi",
    draw: () => (
      <>
        {dots([[14, 16], [104, 12], [100, 76], [22, 74]])}
        <circle cx="60" cy="45" r="22" fill={F} opacity=".85" />
        <ellipse cx="60" cy="45" rx="44" ry="10" fill="none" stroke={A} strokeWidth="4" transform="rotate(-18 60 45)" />
      </>
    ),
  },
  {
    id: "galaxy",
    label: "Galaxy",
    category: "Sci-fi",
    draw: () => (
      <>
        {dots([[14, 12], [106, 18], [100, 80], [18, 78], [90, 40]])}
        <path
          d="M60 45c0-6 8-6 8 0s-10 12-16 6-2-20 12-20 22 14 18 26-22 22-34 14-16-30 0-40"
          fill="none"
          stroke={F}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="60" cy="45" r="4" fill={A} />
      </>
    ),
  },
  {
    id: "robot",
    label: "Robot",
    category: "Sci-fi",
    draw: () => (
      <>
        <path d="M60 26V14" stroke={F} strokeWidth="3" />
        <circle cx="60" cy="12" r="4" fill={A} />
        <rect x="36" y="26" width="48" height="38" rx="8" fill={F} />
        <circle cx="50" cy="44" r="6" fill={A} />
        <circle cx="70" cy="44" r="6" fill={A} />
        <rect x="50" y="54" width="20" height="4" rx="2" fill={A} />
        <rect x="44" y="68" width="32" height="16" rx="4" fill={F} opacity=".7" />
      </>
    ),
  },
  {
    id: "atom",
    label: "Atom",
    category: "Sci-fi",
    draw: () => (
      <>
        {[0, 60, 120].map((a) => (
          <ellipse key={a} cx="60" cy="45" rx="36" ry="12" fill="none" stroke={F} strokeWidth="3" transform={`rotate(${a} 60 45)`} />
        ))}
        <circle cx="60" cy="45" r="6" fill={A} />
      </>
    ),
  },
  {
    id: "ufo",
    label: "UFO",
    category: "Sci-fi",
    draw: () => (
      <>
        <path d="M48 50 36 86h48L72 50Z" fill={A} opacity=".3" />
        <path d="M40 38a20 18 0 0 1 40 0Z" fill={A} opacity=".9" />
        <ellipse cx="60" cy="42" rx="40" ry="10" fill={F} />
        {[34, 50, 70, 86].map((x) => (
          <circle key={x} cx={x} cy="43" r="2.5" fill={A} />
        ))}
      </>
    ),
  },

  // ---------- Kids ----------
  {
    id: "balloons",
    label: "Balloons",
    category: "Kids",
    draw: () => (
      <>
        <path d="M46 49c-4 12 8 20 14 36M74 44c2 14-8 26-14 41" stroke={F} strokeWidth="1.5" fill="none" />
        <ellipse cx="46" cy="32" rx="14" ry="17" fill={F} />
        <ellipse cx="74" cy="28" rx="13" ry="16" fill={A} />
      </>
    ),
  },
  {
    id: "kite",
    label: "Kite",
    category: "Kids",
    draw: () => (
      <>
        <path d="M60 8 86 34 60 66 34 34Z" fill={F} />
        <path d="M60 8v58M34 34h52" stroke={A} strokeWidth="2" />
        <path d="M60 66c-6 5 6 8 0 12s6 6 0 10" stroke={A} strokeWidth="2" fill="none" />
      </>
    ),
  },
  {
    id: "paperboat",
    label: "Paper boat",
    category: "Kids",
    draw: () => (
      <>
        <path d="M44 58 60 20l16 38Z" fill={A} />
        <path d="M20 58h80L86 76H34Z" fill={F} />
        <path d="M0 84c15-6 25 6 40 0s25-6 40 0 25 6 40 0" stroke={F} strokeWidth="3" fill="none" opacity=".6" />
      </>
    ),
  },
  {
    id: "happystar",
    label: "Happy star",
    category: "Kids",
    draw: () => (
      <>
        <path d={star5(60, 46, 36, 15)} fill={A} />
        <circle cx="53" cy="44" r="3" fill={F} />
        <circle cx="67" cy="44" r="3" fill={F} />
        <path d="M53 53q7 6 14 0" stroke={F} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "teddy",
    label: "Teddy bear",
    category: "Kids",
    draw: () => (
      <>
        <circle cx="38" cy="24" r="10" fill={F} />
        <circle cx="82" cy="24" r="10" fill={F} />
        <circle cx="60" cy="48" r="28" fill={F} />
        <ellipse cx="60" cy="60" rx="12" ry="9" fill={A} />
        <circle cx="50" cy="42" r="3" fill="#111" />
        <circle cx="70" cy="42" r="3" fill="#111" />
        <circle cx="60" cy="56" r="3" fill="#111" />
      </>
    ),
  },
  {
    id: "umbrella",
    label: "Umbrella",
    category: "Kids",
    draw: () => (
      <>
        <path d="M20 44a40 34 0 0 1 80 0c-7-5-13-5-20 0-7-5-13-5-20 0-7-5-13-5-20 0-7-5-13-5-20 0Z" fill={F} />
        <path d="M60 44v30a6 6 0 0 1-12 0" stroke={A} strokeWidth="3" fill="none" strokeLinecap="round" />
        {[
          [16, 60],
          [100, 66],
          [28, 80],
          [92, 84],
        ].map(([x, y]) => (
          <path key={x} d={`M${x} ${y}l-2 6`} stroke={A} strokeWidth="2.5" strokeLinecap="round" />
        ))}
      </>
    ),
  },

  // ---------- Business & self-help ----------
  {
    id: "growth",
    label: "Growth chart",
    category: "Business",
    draw: () => (
      <>
        {[
          [26, 62],
          [44, 50],
          [62, 38],
          [80, 24],
        ].map(([x, y]) => (
          <rect key={x} x={x} y={y} width="12" height={84 - y} rx="2" fill={F} opacity=".8" />
        ))}
        <path d="m22 52 22-14 18 8 32-32" stroke={A} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M84 12h12v12" stroke={A} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "bulb",
    label: "Light bulb",
    category: "Business",
    draw: () => (
      <>
        {[
          [18, 32, 28, 34],
          [102, 32, 92, 34],
          [30, 8, 38, 16],
          [90, 8, 82, 16],
        ].map(([a, b, c, d]) => (
          <path key={a} d={`M${a} ${b}L${c} ${d}`} stroke={F} strokeWidth="3" strokeLinecap="round" />
        ))}
        <path d="M60 8a24 24 0 0 0-14 44c4 3 6 7 6 12h16c0-5 2-9 6-12A24 24 0 0 0 60 8Z" fill={A} />
        <rect x="50" y="66" width="20" height="6" rx="2" fill={F} />
        <rect x="52" y="74" width="16" height="6" rx="2" fill={F} />
      </>
    ),
  },
  {
    id: "target",
    label: "Target",
    category: "Business",
    draw: () => (
      <>
        {[32, 22, 12].map((r, i) => (
          <circle key={r} cx="56" cy="48" r={r} fill={i % 2 ? A : F} opacity={i % 2 ? 1 : 0.85} />
        ))}
        <circle cx="56" cy="48" r="4" fill="#fff" />
        <path d="m56 48 38-34" stroke={F} strokeWidth="3" />
        <path d="M86 10h10v10" stroke={F} strokeWidth="3" fill="none" />
      </>
    ),
  },
  {
    id: "summit",
    label: "Summit flag",
    category: "Business",
    draw: () => (
      <>
        <path d="M0 88 44 30l20 22 14-16 42 52Z" fill={F} opacity=".8" />
        <path d="M44 30V6" stroke={A} strokeWidth="2.5" />
        <path d="M44 6h20l-6 6 6 6H44Z" fill={A} />
      </>
    ),
  },
  {
    id: "compass",
    label: "Compass",
    category: "Business",
    draw: () => (
      <>
        <circle cx="60" cy="45" r="32" fill="none" stroke={F} strokeWidth="4" />
        <path d="m60 17 8 28H52Z" fill={A} />
        <path d="m60 73-8-28h16Z" fill={F} />
        <circle cx="60" cy="45" r="4" fill="#fff" />
      </>
    ),
  },
  {
    id: "hourglass",
    label: "Hourglass",
    category: "Business",
    draw: () => (
      <>
        <path d="M42 14h36c0 16-14 22-14 31s14 15 14 31H42c0-16 14-22 14-31S42 30 42 14Z" fill={F} opacity=".5" />
        <path d="M50 70h20l-10-12ZM52 24h16c-2 6-6 9-8 12-2-3-6-6-8-12Z" fill={A} />
        <rect x="36" y="8" width="48" height="6" rx="3" fill={A} />
        <rect x="36" y="76" width="48" height="6" rx="3" fill={A} />
      </>
    ),
  },
  {
    id: "key",
    label: "Golden key",
    category: "Business",
    draw: () => (
      <>
        <circle cx="38" cy="45" r="16" fill="none" stroke={A} strokeWidth="6" />
        <path d="M54 45h46M88 45v12M98 45v8" stroke={A} strokeWidth="6" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "chess",
    label: "Chess king",
    category: "Business",
    draw: () => (
      <>
        <path d="M60 8v14M53 15h14" stroke={A} strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="30" r="9" fill={F} />
        <path d="M50 38h20l4 30H46Z" fill={F} />
        <rect x="38" y="68" width="44" height="12" rx="3" fill={F} />
      </>
    ),
  },
  {
    id: "ladder",
    label: "Ladder to the stars",
    category: "Business",
    draw: () => (
      <>
        {[22, 38, 54, 70].map((y) => (
          <path key={y} d={`M${45 + (86 - y) / 10} ${y}H${75 - (86 - y) / 10}`} stroke={A} strokeWidth="4" />
        ))}
        <path d="M44 86 52 6M76 86 68 6" stroke={F} strokeWidth="5" strokeLinecap="round" />
        <path d={spark(94, 14, 8)} fill={A} />
      </>
    ),
  },

  // ---------- Poetry & spiritual ----------
  {
    id: "feather",
    label: "Feather",
    category: "Poetry",
    draw: () => (
      <>
        <path d="M90 8C56 14 34 40 30 80c18-6 34-18 44-36-8 2-14 2-20 0 10-4 18-10 24-18-6 0-10-1-14-3 10-4 18-9 26-15Z" fill={F} opacity=".9" />
        <path d="M30 80 72 26" stroke={A} strokeWidth="2" />
      </>
    ),
  },
  {
    id: "candle",
    label: "Candle",
    category: "Poetry",
    draw: () => (
      <>
        <circle cx="60" cy="24" r="22" fill={A} opacity=".15" />
        <rect x="48" y="36" width="24" height="46" rx="3" fill={F} />
        <path d="M60 10c6 8 8 14 8 18a8 8 0 0 1-16 0c0-4 2-10 8-18Z" fill={A} />
        <path d="M60 28v8" stroke="#111" strokeWidth="2" />
        <rect x="40" y="80" width="40" height="5" rx="2" fill={A} />
      </>
    ),
  },
  {
    id: "crescent",
    label: "Crescent moon",
    category: "Poetry",
    draw: () => (
      <>
        <path d="M70 14a30 30 0 1 0 22 52 26 26 0 1 1-22-52Z" fill={A} />
        <path d={spark(28, 20, 6)} fill={F} />
        <path d={spark(98, 22, 4)} fill={F} />
        <path d={spark(20, 66, 4)} fill={F} />
      </>
    ),
  },
  {
    id: "diya",
    label: "Diya",
    category: "Poetry",
    draw: () => (
      <>
        <path d="M60 22c8 10 10 18 10 24a10 10 0 0 1-20 0c0-6 2-14 10-24Z" fill={A} />
        <path d="M60 34c3 5 4 8 4 11a4 4 0 0 1-8 0c0-3 1-6 4-11Z" fill="#fff" opacity=".7" />
        <path d="M24 60h72c-4 14-18 22-36 22S28 74 24 60Z" fill={F} />
      </>
    ),
  },
  {
    id: "mandala",
    label: "Mandala",
    category: "Poetry",
    draw: () => (
      <>
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} cx="60" cy="25" rx="7" ry="16" fill={F} opacity=".7" transform={`rotate(${i * 45} 60 45)`} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={`b${i}`} cx="60" cy="32" rx="4" ry="9" fill={A} transform={`rotate(${i * 45 + 22.5} 60 45)`} />
        ))}
        <circle cx="60" cy="45" r="7" fill={A} />
      </>
    ),
  },
  {
    id: "infinity",
    label: "Infinity",
    category: "Poetry",
    draw: () => (
      <>
        <path d="M30 45c0-14 22-14 30 0s30 14 30 0-22-14-30 0-30 14-30 0Z" fill="none" stroke={A} strokeWidth="7" strokeLinecap="round" />
        <path d={spark(60, 16, 6)} fill={F} />
        <path d={spark(60, 76, 4)} fill={F} />
      </>
    ),
  },

  // ---------- Travel ----------
  {
    id: "airplane",
    label: "Airplane",
    category: "Travel",
    draw: () => (
      <>
        <path d="M8 74c20-6 40-6 60 4" stroke={A} strokeWidth="2.5" strokeDasharray="4 5" fill="none" />
        <path d="M100 18 20 50l20 6-4 16 10-10 18 18 6-8-8-20 28-24c4-4 4-8 0-10Z" fill={F} />
      </>
    ),
  },
  {
    id: "globe",
    label: "Globe",
    category: "Travel",
    draw: () => (
      <>
        <circle cx="60" cy="45" r="32" fill={F} opacity=".85" />
        <path d="M28 45h64M60 13c-12 10-12 54 0 64M60 13c12 10 12 54 0 64M34 28h52M34 62h52" stroke={A} strokeWidth="2" fill="none" />
      </>
    ),
  },
  {
    id: "anchor",
    label: "Anchor",
    category: "Travel",
    draw: () => (
      <>
        <circle cx="60" cy="16" r="7" fill="none" stroke={F} strokeWidth="4" />
        <path d="M60 23v58M44 36h32" stroke={F} strokeWidth="5" strokeLinecap="round" />
        <path d="M28 58c4 16 18 24 32 24s28-8 32-24" stroke={F} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="m22 64 6-10 8 6M98 64l-6-10-8 6" stroke={A} strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "lighthouse",
    label: "Lighthouse",
    category: "Travel",
    draw: () => (
      <>
        <path d="M70 20 118 6v28Z" fill={A} opacity=".35" />
        <path d="M50 28h20l6 58H44Z" fill={F} />
        <path d="M47 50h26M46 66h28" stroke={A} strokeWidth="5" />
        <rect x="50" y="16" width="20" height="12" rx="2" fill={A} />
        <path d="m50 16 10-8 10 8Z" fill={F} />
      </>
    ),
  },
  {
    id: "airballoon",
    label: "Hot-air balloon",
    category: "Travel",
    draw: () => (
      <>
        <path d="M60 6a28 28 0 0 0-28 28c0 16 16 26 22 34h12c6-8 22-18 22-34A28 28 0 0 0 60 6Z" fill={F} />
        <path d="M60 6c-10 10-10 52-4 62M60 6c10 10 10 52 4 62" stroke={A} strokeWidth="2.5" fill="none" />
        <path d="m54 68 1 6M66 68l-1 6" stroke={F} strokeWidth="1.5" />
        <rect x="53" y="74" width="14" height="10" rx="2" fill={A} />
      </>
    ),
  },
  {
    id: "mappin",
    label: "Map pin",
    category: "Travel",
    draw: () => (
      <>
        <path d="M24 80c20-8 52-8 72 0" stroke={F} strokeWidth="2" strokeDasharray="3 4" fill="none" opacity=".6" />
        <path d="M60 80S36 52 36 34a24 24 0 0 1 48 0c0 18-24 46-24 46Z" fill={F} />
        <circle cx="60" cy="34" r="9" fill={A} />
      </>
    ),
  },

  // ---------- Life & memoir ----------
  {
    id: "tea",
    label: "Cup of chai",
    category: "Life",
    draw: () => (
      <>
        <path d="M44 30c-4-6 4-8 0-16M56 30c-4-6 4-8 0-16M68 30c-4-6 4-8 0-16" stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M80 46h6a8 8 0 0 1 0 16h-6" stroke={F} strokeWidth="5" fill="none" />
        <path d="M30 40h50v18a20 20 0 0 1-20 20H50a20 20 0 0 1-20-20Z" fill={F} />
        <path d="M22 82h76" stroke={A} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "house",
    label: "Home",
    category: "Life",
    draw: () => (
      <>
        <rect x="74" y="16" width="8" height="18" fill={F} />
        <path d="M60 12 20 44h10v40h60V44h10Z" fill={F} />
        <rect x="52" y="58" width="16" height="26" rx="2" fill={A} />
        <rect x="36" y="50" width="12" height="12" fill={A} opacity=".8" />
        <rect x="72" y="50" width="12" height="12" fill={A} opacity=".8" />
      </>
    ),
  },
  {
    id: "camera",
    label: "Camera",
    category: "Life",
    draw: () => (
      <>
        <path d="m44 28 6-10h20l6 10Z" fill={F} />
        <rect x="24" y="28" width="72" height="48" rx="8" fill={F} />
        <circle cx="60" cy="52" r="16" fill={A} />
        <circle cx="60" cy="52" r="8" fill={F} />
        <circle cx="84" cy="38" r="3" fill={A} />
      </>
    ),
  },
  {
    id: "music",
    label: "Music notes",
    category: "Life",
    draw: () => (
      <>
        <path d="M48 70V22l40-10v48" stroke={F} strokeWidth="5" fill="none" strokeLinejoin="round" />
        <ellipse cx="40" cy="70" rx="10" ry="7" fill={A} />
        <ellipse cx="80" cy="60" rx="10" ry="7" fill={A} />
      </>
    ),
  },
  {
    id: "clock",
    label: "Clock",
    category: "Life",
    draw: () => (
      <>
        <circle cx="60" cy="45" r="32" fill={F} />
        <circle cx="60" cy="45" r="26" fill={A} opacity=".25" />
        {[0, 90, 180, 270].map((a) => (
          <rect key={a} x="58.5" y="16" width="3" height="6" fill={A} transform={`rotate(${a} 60 45)`} />
        ))}
        <path d="M60 45V26M60 45l14 8" stroke={A} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "bicycle",
    label: "Bicycle",
    category: "Life",
    draw: () => (
      <>
        <circle cx="34" cy="62" r="16" fill="none" stroke={F} strokeWidth="4" />
        <circle cx="86" cy="62" r="16" fill="none" stroke={F} strokeWidth="4" />
        <path
          d="M34 62 50 36h28l8 26M50 36l12 26H34M62 62l16-26M44 28h12M74 36l4-10h8"
          stroke={A}
          strokeWidth="3"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    id: "openbook",
    label: "Open book",
    category: "Life",
    draw: () => (
      <>
        <path d={spark(60, 12, 7)} fill={A} />
        <path d="M60 28c-12-8-28-10-42-8v54c14-2 30 0 42 8Z" fill={F} opacity=".85" />
        <path d="M60 28c12-8 28-10 42-8v54c-14-2-30 0-42 8Z" fill={F} opacity=".65" />
        <path d="M28 36c10-1 20 0 26 4M28 46c10-1 20 0 26 4M66 40c6-4 16-5 26-4M66 50c6-4 16-5 26-4" stroke={A} strokeWidth="1.5" fill="none" />
      </>
    ),
  },
  {
    id: "nib",
    label: "Pen nib",
    category: "Life",
    draw: () => (
      <>
        <path d="M60 8 82 40 66 82H54L38 40Z" fill={F} />
        <path d="M60 40v38" stroke={A} strokeWidth="2.5" />
        <circle cx="60" cy="40" r="5" fill={A} />
      </>
    ),
  },
  {
    id: "butterfly",
    label: "Butterfly",
    category: "Life",
    draw: () => (
      <>
        <path d="M58 45C46 20 22 18 24 36s18 14 34 9Zm4 0c12-25 36-27 34-9s-18 14-34 9Z" fill={F} />
        <path d="M58 47C44 50 32 62 40 72s16-10 18-25Zm4 0c14 3 26 15 18 25s-16-10-18-25Z" fill={A} />
        <path d="M60 30v40" stroke={F} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "birds",
    label: "Flying birds",
    category: "Life",
    draw: () => (
      <>
        <path d="M14 56c14-14 30-14 40 0 10-14 26-14 40 0-12-6-28-4-40 10-12-14-28-16-40-10Z" fill={F} />
        <path d="M66 26c6-6 13-6 18 0 5-6 12-6 18 0-6-3-12-2-18 4-6-6-12-7-18-4Z" fill={A} />
      </>
    ),
  },
  {
    id: "constellation",
    label: "Constellation",
    category: "Life",
    draw: () => {
      const pts = [
        [24, 62],
        [40, 30],
        [64, 44],
        [84, 18],
        [98, 54],
      ];
      return (
        <>
          <path d={`M${pts.map((p) => p.join(" ")).join("L")}`} stroke={A} strokeWidth="1.5" fill="none" />
          {pts.map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="3.5" fill={F} />
          ))}
        </>
      );
    },
  },
  {
    id: "city",
    label: "City skyline",
    category: "Life",
    draw: () => (
      <>
        <circle cx="98" cy="18" r="7" fill={A} />
        <path d="M10 86V50h14V36h12v50h6V24h16v62h6V44h14v42h6V30h12v56Z" fill={F} />
        {[
          [28, 42],
          [48, 32],
          [48, 46],
          [68, 52],
          [88, 40],
          [88, 56],
        ].map(([x, y]) => (
          <rect key={`${x}${y}`} x={x} y={y} width="4" height="5" fill={A} />
        ))}
      </>
    ),
  },
];

/** Gold accents vanish on light covers; switch to a deep red there. */
export function artAccent(bg: string) {
  const m = /^#([0-9a-f]{6})$/i.exec(bg);
  if (!m) return "#f6c453";
  const n = parseInt(m[1], 16);
  const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.62 ? "#b3202a" : "#f6c453";
}

export const ART_IDS = ARTWORKS.map((a) => a.id);
export const ART_CATEGORIES = Array.from(new Set(ARTWORKS.map((a) => a.category)));
const byId = new Map(ARTWORKS.map((a) => [a.id, a]));
export const isArtId = (id: unknown): id is string => typeof id === "string" && byId.has(id);

/** Render a cover artwork; unknown ids fall back to the moon & river. */
export function Art({ id, className = "book-art" }: { id: string; className?: string }) {
  const art = byId.get(id) ?? ARTWORKS[0];
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden>
      {art.draw()}
    </svg>
  );
}
