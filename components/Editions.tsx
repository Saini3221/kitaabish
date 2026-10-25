const editions = [
  {
    name: "Paperback",
    tag: "Essential",
    blurb: "For authors with a finished manuscript who want it polished and published.",
    color: "#1f7891",
    features: ["Copy editing & proofreading", "Interior formatting", "Premade cover design", "Publishing on major stores"],
  },
  {
    name: "Hardcover",
    tag: "Professional",
    blurb: "Our most chosen package — from rough draft to a launch readers notice.",
    color: "#2c2690",
    featured: true,
    features: [
      "Developmental & line editing",
      "Custom cover design",
      "Print & eBook formatting",
      "Global distribution",
      "Launch marketing campaign",
    ],
  },
  {
    name: "Collector's Edition",
    tag: "Premium",
    blurb: "Full-service ghostwriting and publishing, with a dedicated team end to end.",
    color: "#8a1c24",
    features: [
      "Ghostwriting from scratch",
      "Complete editorial suite",
      "Premium cover & audiobook",
      "Author website",
      "3-month marketing plan",
    ],
  },
];

// Packages as hardcover books: hovering swings the cover open to show the pages.
export default function Editions() {
  return (
    <section className="editions">
      <div className="sbook-heading">
        <span className="eyebrow">Packages</span>
        <h2>
          Choose your <em>edition</em>
        </h2>
        <p>Three ways to bring your book to life. Every package can be tailored to your story.</p>
      </div>

      <div className="editions-grid">
        {editions.map((e) => (
          // tabIndex lets touch users open the cover with a tap (:focus-within).
          <article
            key={e.name}
            className={`edition${e.featured ? " is-featured" : ""}`}
            style={{ ["--c" as string]: e.color }}
            tabIndex={0}
          >
            <div className="edition-pages">
              <ul>
                {e.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a href="/contact" className="btn edition-cta">
                Get a quote
              </a>
            </div>
            <div className="edition-cover">
              {e.featured && <span className="edition-ribbon">Most popular</span>}
              <span className="edition-frame" aria-hidden />
              <span className="edition-tag">{e.tag}</span>
              <h3>{e.name}</h3>
              <span className="edition-rule" aria-hidden>
                ✦
              </span>
              <p>{e.blurb}</p>
              <span className="edition-hint">Open to see what&apos;s inside →</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
