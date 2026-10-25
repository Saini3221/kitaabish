import Image from "next/image";

// Circular "Let's Start the Journey!" text that spins around the logo.
export default function JourneyBadge() {
  return (
    <a href="/contact" className="badge" aria-label="Let's start the journey">
      <svg className="badge-ring" viewBox="0 0 200 200" aria-hidden>
        <defs>
          <path id="badge-circle" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
        </defs>
        <text>
          <textPath href="#badge-circle" textLength="510">
            Let&apos;s Start the Journey! — Let&apos;s Start the Journey! —
          </textPath>
        </text>
      </svg>
      <span className="badge-core">
        <Image src="/logo-1.png" alt="" width={56} height={94} />
        <svg className="badge-arrow" viewBox="0 0 24 24" aria-hidden>
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      </span>
    </a>
  );
}
