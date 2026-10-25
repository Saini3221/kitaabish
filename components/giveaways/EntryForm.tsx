"use client";

import { useActionState, useEffect, useState } from "react";
import { enterGiveaway } from "@/app/giveaways/actions";
import { Field, SubmitButton } from "./PublicFormBits";
import { whatsappShare } from "./share";

export default function EntryForm({ slug, title }: { slug: string; title: string }) {
  const [state, action] = useActionState(enterGiveaway, undefined);
  const [url, setUrl] = useState("");
  useEffect(() => setUrl(window.location.href), []);

  if (state?.success) {
    return (
      <div className="entry-done" role="status">
        <span className="entry-done-icon" aria-hidden>
          🎉
        </span>
        <h3>{state.success}</h3>
        <p>Double your luck — share the giveaway with a friend who loves books.</p>
        <div className="entry-share">
          <a className="btn btn-red" href={whatsappShare(`Join the Kitaabish giveaway: ${title} ${url}`)} target="_blank" rel="noopener noreferrer">
            Share on WhatsApp
          </a>
          <button type="button" className="btn btn-ghost" onClick={() => navigator.clipboard?.writeText(url)}>
            Copy link
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="entry-form" noValidate>
      <input type="hidden" name="slug" value={slug} />
      {/* Honeypot: hidden from people, irresistible to bots */}
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
      <div className="entry-row">
        <Field label="Your name" name="name" state={state}>
          <input name="name" required maxLength={80} autoComplete="name" />
        </Field>
        <Field label="Email" name="email" state={state}>
          <input type="email" name="email" required maxLength={200} autoComplete="email" />
        </Field>
      </div>
      <div className="entry-row">
        <Field label="WhatsApp (optional)" name="whatsapp" state={state} hint="So we can reach you if you win">
          <input type="tel" name="whatsapp" maxLength={25} autoComplete="tel" placeholder="91 98765 43210" />
        </Field>
        <Field label="Instagram (optional)" name="instagram" state={state}>
          <input name="instagram" maxLength={31} placeholder="@yourhandle" />
        </Field>
      </div>
      <label className={`entry-consent${state?.fieldErrors?.consent ? " has-error" : ""}`}>
        <input type="checkbox" name="consent" />
        <span>
          I agree to the giveaway rules and to Kitaabish contacting me about this giveaway.
          {state?.fieldErrors?.consent && <em>{state.fieldErrors.consent}</em>}
        </span>
      </label>
      <SubmitButton pendingText="Entering…">Enter the giveaway 🎁</SubmitButton>
    </form>
  );
}
