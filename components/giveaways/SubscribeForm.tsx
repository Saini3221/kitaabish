"use client";

import { useActionState } from "react";
import { subscribeUpdates } from "@/app/giveaways/actions";
import { INSTAGRAM_URL } from "@/lib/contact";
import { Field, SubmitButton } from "./PublicFormBits";

// "Never miss a giveaway" — collects email and/or WhatsApp for future giveaway alerts.
export default function SubscribeForm() {
  const [state, action] = useActionState(subscribeUpdates, undefined);
  return (
    <section className="sub-card">
      <div className="sub-text">
        <span className="eyebrow">Giveaway alerts</span>
        <h2>
          Never miss a <em>giveaway.</em>
        </h2>
        <p>
          Get a heads-up the moment a new giveaway goes live — free books, cover designs, editing sessions and more.
          Or follow us on{" "}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>{" "}
          for every update.
        </p>
      </div>
      {state?.success ? (
        <p className="sub-done" role="status">
          {state.success}
        </p>
      ) : (
        <form action={action} className="sub-form" noValidate>
          <div className="hp" aria-hidden>
            <label>
              Website <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {state?.error && !state.fieldErrors && (
            <p className="entry-error" role="alert">
              {state.error}
            </p>
          )}
          <Field label="Name (optional)" name="name" state={state}>
            <input name="name" maxLength={80} autoComplete="name" />
          </Field>
          <Field label="Email" name="email" state={state}>
            <input type="email" name="email" maxLength={200} autoComplete="email" />
          </Field>
          <Field label="WhatsApp (optional)" name="whatsapp" state={state}>
            <input type="tel" name="whatsapp" maxLength={25} placeholder="91 98765 43210" />
          </Field>
          <label className={`entry-consent${state?.fieldErrors?.consent ? " has-error" : ""}`}>
            <input type="checkbox" name="consent" />
            <span>
              Send me giveaway updates. I can ask to stop anytime.
              {state?.fieldErrors?.consent && <em>{state.fieldErrors.consent}</em>}
            </span>
          </label>
          <SubmitButton pendingText="Subscribing…">Notify me 🔔</SubmitButton>
        </form>
      )}
    </section>
  );
}
