"use client";

import { useFormStatus } from "react-dom";

function Inner({ again }: { again: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>
      {pending ? "Picking…" : again ? "🎲 Pick again" : "🎲 Pick random winner"}
    </button>
  );
}

export default function PickWinnerButton({ action, again }: { action: () => Promise<void>; again: boolean }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const msg = again
          ? "Pick a different winner? The current winner will be replaced on the website."
          : "Pick a winner at random from all entries and announce it on the website?";
        if (!confirm(msg)) e.preventDefault();
      }}
    >
      <Inner again={again} />
    </form>
  );
}
