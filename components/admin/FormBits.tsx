"use client";

import { useFormStatus } from "react-dom";
import type { FormState } from "@/lib/validation";

export function SubmitButton({ children, pendingText = "Saving…" }: { children: React.ReactNode; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>
      {pending ? pendingText : children}
    </button>
  );
}

export function FormError({ state }: { state: FormState }) {
  if (state?.success)
    return (
      <p className="adm-alert adm-alert-ok" role="status">
        {state.success}
      </p>
    );
  if (!state?.error) return null;
  return (
    <p className="adm-alert adm-alert-error" role="alert">
      {state.error}
    </p>
  );
}

/** Label + input wrapper that shows the server-side validation message for its field. */
export function Field({
  label,
  name,
  state,
  hint,
  children,
  wide = false,
}: {
  label: string;
  name: string;
  state: FormState;
  hint?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const err = state?.fieldErrors?.[name];
  return (
    <label className={`adm-field${wide ? " adm-field-wide" : ""}${err ? " has-error" : ""}`}>
      <span className="adm-label">{label}</span>
      {children}
      {err ? <span className="adm-field-error">{err}</span> : hint && <span className="adm-hint">{hint}</span>}
    </label>
  );
}

/** Delete via a server action, with a browser confirm first. */
export function DeleteButton({ action, label }: { action: () => Promise<void>; label: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${label}"? This can't be undone.`)) e.preventDefault();
      }}
    >
      <button type="submit" className="adm-btn adm-btn-danger adm-btn-sm">
        Delete
      </button>
    </form>
  );
}
