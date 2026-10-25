import { Cover } from "./Library";
import type { RecommendedRead } from "@/lib/reads";

// The team's recommended reads (admin-curated "reads" collection in MongoDB).
export default function HomeShelf({ books }: { books: RecommendedRead[] }) {
  if (books.length === 0) return null;
  return (
    <section className="home-shelf">
      <div className="sbook-heading">
        <span className="eyebrow">From our bookshelf</span>
        <h2>
          Books we <em>love to read</em>
        </h2>
        <p>Handpicked by our team — the best books we&apos;ve read, and the ones we recommend to every storyteller.</p>
      </div>
      <ul className="home-shelf-grid">
        {books.map((b) => (
          <li key={b.slug} className="lib-item">
            <div className="lib-book" tabIndex={0}>
              <div className="pbook-wrap">
                <Cover book={b} />
              </div>
              <span className="lib-shadow" aria-hidden />
              <span className="lib-meta">
                <strong>{b.title}</strong>
                <span>{b.author}</span>
              </span>
              <p className="read-note">“{b.note}”</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
