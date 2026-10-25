type P = { className?: string };

export function PenIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M15.6 2.3a1 1 0 0 1 1.4 0l4.7 4.7a1 1 0 0 1 0 1.4l-2.3 2.3-6.1-6.1 2.3-2.3Z" />
      <path d="M11.9 6 18 12.1l-1.6 5.3a2 2 0 0 1-1.3 1.3L4.5 22l5.8-5.8a2.2 2.2 0 1 0-1.5-1.5L3 20.5 6.3 9.9a2 2 0 0 1 1.3-1.3L11.9 6Z" />
    </svg>
  );
}

export function WandIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="m14.5 7.5 2 2L5 21a1.4 1.4 0 0 1-2-2L14.5 7.5Z" />
      <path d="m15.6 6.4 1.4-1.4a1.4 1.4 0 0 1 2 2l-1.4 1.4-2-2Z" opacity=".75" />
      <path d="m9 1.5.8 2.2L12 4.5l-2.2.8L9 7.5l-.8-2.2L6 4.5l2.2-.8L9 1.5ZM19.5 10l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6ZM20 1l.5 1.4L22 3l-1.5.5L20 5l-.5-1.5L18 3l1.5-.6L20 1Z" />
    </svg>
  );
}

export function FrameTextIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="4" y="4" width="16" height="16" />
      <rect x="2" y="2" width="4" height="4" fill="currentColor" />
      <rect x="18" y="2" width="4" height="4" fill="currentColor" />
      <rect x="2" y="18" width="4" height="4" fill="currentColor" />
      <rect x="18" y="18" width="4" height="4" fill="currentColor" />
      <path d="M8.5 8.5h7M12 8.5v7.5" strokeWidth="2.4" />
    </svg>
  );
}

export function BrushIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.7 2.3a1.1 1.1 0 0 1 1.6 1.5l-8.8 10-2.6-2.6 9.8-8.9Z" />
      <path d="M9.6 12.3 12.3 15c-.2 3-2.4 5.2-5.6 5.2-2.2 0-3.6-.8-4.7-2 1.8-.2 2.7-1 3-2.4.4-2 1.9-3.4 4.6-3.5Z" opacity=".8" />
    </svg>
  );
}

export function StackIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <rect x="3" y="15" width="18" height="5" rx="1.2" />
      <rect x="5" y="9" width="15" height="5" rx="1.2" opacity=".75" />
      <rect x="4" y="3" width="13" height="5" rx="1.2" opacity=".5" />
    </svg>
  );
}

export function HeadphonesIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 15v-3a9 9 0 0 1 18 0v3" />
      <rect x="2.5" y="14" width="5" height="7" rx="2" fill="currentColor" />
      <rect x="16.5" y="14" width="5" height="7" rx="2" fill="currentColor" />
    </svg>
  );
}

export function GlobeIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19M12 2.5c2.6 2.6 3.8 5.8 3.8 9.5s-1.2 6.9-3.8 9.5c-2.6-2.6-3.8-5.8-3.8-9.5S9.4 5.1 12 2.5Z" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.2-1.6-1.2-3s.8-2.2 1.1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.6-.1 1.2Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function HeartEyesIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="currentColor" />
      <path
        fill="#1b1b1b"
        d="M8.2 7.2c.8-.9 2.4-.4 2.3 1-.1 1.1-1.6 2.2-2.6 2.8-1-.6-2.5-1.7-2.6-2.8-.1-1.4 1.5-1.9 2.3-1 .2.2.4.3.6 0Zm7.6 0c.8-.9 2.4-.4 2.3 1-.1 1.1-1.6 2.2-2.6 2.8-1-.6-2.5-1.7-2.6-2.8-.1-1.4 1.5-1.9 2.3-1 .2.2.4.3.6 0ZM6.8 13.4h10.4c-.4 2.9-2.6 4.8-5.2 4.8s-4.8-1.9-5.2-4.8Z"
      />
    </svg>
  );
}
