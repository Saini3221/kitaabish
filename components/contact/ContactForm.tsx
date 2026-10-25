"use client";

import { useActionState } from "react";
import { sendMessage } from "@/app/contact/actions";
import { CONTACT_TOPICS } from "@/lib/contact";
import { Field, SubmitButton } from "../giveaways/PublicFormBits";

export default function ContactForm() {
  const [state, action] = useActionState(sendMessage, undefined);

  if (state?.success) {
    return (
      <div className="entry-done" role="status">
        <span className="entry-done-icon" aria-hidden>
          ✉️
        </span>
        <h3>{state.success}</h3>
        <p>We read every message ourselves and usually reply within a day or two.</p>
      </div>
    );
  }

  return (
    <form action={action} className="entry-form ct-form" noValidate>
      {/* Honeypot: hidden from people, irresistible to bots */}
      <div className="hp" aria-hidden>
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state?.error && (
        <p className="entry-error" role="alert">
          {state.error}
        </p>
      )}
      <div className="entry-row">
        <Field label="Your name" name="name" state={state}>
          <input name="name" required maxLength={80} autoComplete="name" />
        </Field>
        <Field label="What's this about?" name="topic" state={state}>
          <select name="topic" required defaultValue="">
            <option value="" disabled>
              Choose one…
            </option>
            {CONTACT_TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="entry-row">
        <Field label="Email" name="email" state={state}>
          <input type="email" name="email" maxLength={200} autoComplete="email" />
        </Field>
        <Field label="WhatsApp" name="whatsapp" state={state} hint="Email or WhatsApp — one is enough">
          <input type="tel" name="whatsapp" maxLength={25} autoComplete="tel" placeholder="91 98765 43210" />
        </Field>
      </div>
      <Field label="Book title (optional)" name="bookTitle" state={state}>
        <input name="bookTitle" maxLength={160} />
      </Field>
      <Field label="Your message" name="message" state={state}>
        <textarea
          name="message"
          required
          maxLength={3000}
          rows={5}
          placeholder="Tell us about your book, where you are with it, and what kind of help you're looking for."
        />
      </Field>
      <SubmitButton pendingText="Sending…">Send message →</SubmitButton>
    </form>
  );
}
