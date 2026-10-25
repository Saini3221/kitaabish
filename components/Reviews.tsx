const reviews = [
  { quote: "They turned my scattered notes into a memoir my family can't put down.", name: "Anita M.", book: "The Silent River" },
  { quote: "The editing was surgical. Every chapter came back sharper and truer.", name: "Rohan K.", book: "Ink & Ember" },
  { quote: "My cover stops people mid-scroll. Sales doubled in the first month.", name: "Sara I.", book: "Paper Kingdoms" },
  { quote: "From ISBN to launch day, I never had to chase anything. Pure calm.", name: "Jatin D.", book: "Letters Home" },
  { quote: "The ghostwriter captured my voice so well my friends were stunned.", name: "Meera S.", book: "Second Spring" },
  { quote: "Formatting looked flawless on Kindle, paperback and hardcover.", name: "Arjun P.", book: "Northbound" },
  { quote: "Their launch campaign got my debut into the top 100 in its category.", name: "Priya N.", book: "Monsoon Hearts" },
  { quote: "Honest feedback, kind people, and a book I'm genuinely proud of.", name: "Kabir T.", book: "Salt & Saffron" },
];

function Card({ r }: { r: (typeof reviews)[number] }) {
  return (
    <figure className="review">
      <span className="review-stars" aria-label="5 out of 5 stars">
        ★★★★★
      </span>
      <blockquote>“{r.quote}”</blockquote>
      <figcaption>
        <strong>{r.name}</strong> · author of <em>{r.book}</em>
      </figcaption>
    </figure>
  );
}

// Back-cover style blurbs drifting in two rows; hovering pauses them.
export default function Reviews() {
  const rowA = reviews.slice(0, 4);
  const rowB = reviews.slice(4);
  return (
    <section className="reviews">
      <div className="sbook-heading">
        <span className="eyebrow">Reader reviews</span>
        <h2>
          What our <em>authors</em> say
        </h2>
      </div>
      {[rowA, rowB].map((row, i) => (
        <div key={i} className={`marquee${i ? " marquee-reverse" : ""}`}>
          <div className="marquee-track">
            {[...row, ...row].map((r, j) => (
              <Card key={j} r={r} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
