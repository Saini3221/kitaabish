// Title-page intro: letters drop in one by one (pure CSS). The last word is highlighted.
export default function ServicesIntro({
  title = "The Book of Services",
  sub = "Every great book is written in chapters. Here are ours — from the first word of your manuscript to the moment it reaches a reader's hands.",
}: {
  title?: string;
  sub?: string;
}) {
  return (
    <section className="sintro">
      <h1 className="sintro-title" aria-label={title}>
        {title.split(" ").map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            <span className="sintro-word" aria-hidden>
              {word.split("").map((ch, i) => (
                <span key={i} className="sintro-letter" style={{ animationDelay: `${0.15 + (w * 5 + i) * 0.04}s` }}>
                  {ch}
                </span>
              ))}
            </span>
          </span>
        ))}
      </h1>
      <p className="sintro-sub reveal" style={{ animationDelay: "0.9s" }}>
        {sub}
      </p>
    </section>
  );
}
