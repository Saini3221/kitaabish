"use client";

import { useFormStatus } from "react-dom";
import type { FormState } from "@/lib/validation";

export function SubmitButton({ children, pendingText }: { children: React.ReactNode; pendingText: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-red entry-submit" disabled={pending}>
      {pending ? pendingText : children}
    </button>
  );
}

export function Field({
  label,
  name,
  state,
  hint,
  children,
}: {
  label: string;
  name: string;
  state: FormState;
  hint?: string;
  children: React.ReactNode;
}) {
  const err = state?.fieldErrors?.[name];
  return (
    <label className={`entry-field${err ? " has-error" : ""}`}>
      <span>{label}</span>
      {children}
      {err ? <em>{err}</em> : hint && <small>{hint}</small>}
    </label>
  );
}
