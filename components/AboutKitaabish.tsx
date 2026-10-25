const promises = [
  {
    icon: "✦",
    title: "Your rights stay yours",
    text: "You keep 100% of your rights and royalties — even with ghostwriting, your name is on the cover.",
  },
  {
    icon: "❦",
    title: "One dedicated team",
    text: "A writer, editor, designer and marketer who know your book inside out, from first call to launch day.",
  },
  {
    icon: "❧",
    title: "Every genre, every format",
    text: "Fiction, memoir, poetry, business, children's books — in paperback, hardcover, eBook and audio.",
  },
  {
    icon: "✎",
    title: "You approve every step",
    text: "Clear milestones and honest feedback. Nothing moves forward until you're happy with it.",
  },
];

// "Why Kitaabish" — the about section on the home page (navbar #about).
export default function AboutKitaabish() {
  return (
    <section className="about" id="about">
      <div className="about-text">
        <span className="eyebrow">Why Kitaabish</span>
        <h2>
          We don&apos;t just publish books. <em>We build authors.</em>
        </h2>
        <p>
          Kitaabish — from <em>kitaab</em>, a book — is a team of writers, editors, designers and marketers who believe
          every story deserves to be read. Whether you have a finished manuscript or just an idea in a notebook, we
          help you turn it into a book you&apos;re proud to hold.
        </p>
        <a href="/services" className="btn btn-dark">
          Explore our services
        </a>
      </div>
      <ul className="about-cards">
        {promises.map((p, i) => (
          <li key={p.title} className="about-card" style={{ ["--i" as string]: i }}>
            <span className="about-icon" aria-hidden>
              {p.icon}
            </span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
