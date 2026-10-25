import Image from "next/image";
import Link from "next/link";
import Countdown from "./Countdown";
import { formatIST, type GiveawayWithCount } from "@/lib/giveaways";

const label = { live: "Live now", upcoming: "Coming soon", ended: "Ended" } as const;

// A giveaway shown as a golden ticket: photo stub on the left, details on the right.
export default function GiveawayTicket({ g, big = false }: { g: GiveawayWithCount; big?: boolean }) {
  return (
    <article className={`ticket ticket-${g.status}${big ? " ticket-big" : ""}`}>
      <div className="ticket-stub">
        <Image
          src={`${g.image.url}?w=${big ? 900 : 600}&q=75&auto=format&fit=crop`}
          alt={g.image.alt}
          fill
          sizes={big ? "(max-width: 800px) 100vw, 40vw" : "(max-width: 800px) 100vw, 30vw"}
        />
        <span className={`ticket-status ticket-status-${g.status}`}>
          {g.status === "live" && <span className="ticket-dot" aria-hidden />}
          {label[g.status]}
        </span>
      </div>
      <div className="ticket-body">
        <span className="ticket-kicker">🎁 Kitaabish Giveaway</span>
        <h3>{g.title}</h3>
        <p className="ticket-prize">
          <span>Prize</span>
          {g.prize}
        </p>
        <p className="ticket-summary">{g.summary}</p>

        {g.status === "live" && (
          <>
            <span className="ticket-label">Ends in</span>
            <Countdown to={g.endsAt} />
          </>
        )}
        {g.status === "upcoming" && (
          <>
            <span className="ticket-label">Starts in</span>
            <Countdown to={g.startsAt} endedText="Starting now — refresh!" />
          </>
        )}
        {g.status === "ended" && (
          <p className="ticket-winner">
            {g.winner ? (
              <>
                🏆 Winner: <strong>{g.winner.name}</strong>
              </>
            ) : (
              <>Winner announcement coming soon</>
            )}
          </p>
        )}

        <div className="ticket-foot">
          <span className="ticket-meta">
            {g.status === "upcoming"
              ? `Opens ${formatIST(g.startsAt)}`
              : `${g.entries.toLocaleString("en-IN")} ${g.entries === 1 ? "entry" : "entries"}`}
          </span>
          <Link href={`/giveaways/${g.slug}`} className={`btn ${g.status === "live" ? "btn-red" : "btn-ghost"}`}>
            {g.status === "live" ? "Enter now →" : g.status === "upcoming" ? "See details" : "See results"}
          </Link>
        </div>
      </div>
    </article>
  );
}
