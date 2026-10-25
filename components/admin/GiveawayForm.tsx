"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveGiveaway } from "@/app/admin/actions";
import { Field, FormError, SubmitButton } from "./FormBits";
import type { Giveaway } from "@/lib/giveaways";

// ISO → value for <input type="datetime-local">, shown in India time.
const toIstInput = (iso: string) => new Date(new Date(iso).getTime() + 5.5 * 3_600_000).toISOString().slice(0, 16);
const inDays = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

export default function GiveawayForm({ giveaway }: { giveaway?: Giveaway }) {
  const [state, action] = useActionState(saveGiveaway, undefined);
  const g = giveaway;
  const [img, setImg] = useState(g?.image.url ?? "");
  const validImg = /^https:\/\/images\.unsplash\.com\//.test(img);

  return (
    <form action={action} className="adm-form">
      {g && <input type="hidden" name="originalSlug" value={g.slug} />}
      <FormError state={state} />

      <div className="adm-row-2">
        <Field label="Giveaway title" name="title" state={state}>
          <input name="title" defaultValue={g?.title} required maxLength={120} placeholder="Win a free book cover design" />
        </Field>
        <Field label="Prize" name="prize" state={state} hint="What the winner gets">
          <input name="prize" defaultValue={g?.prize} required maxLength={160} />
        </Field>
      </div>
      <Field label="Short summary" name="summary" state={state} hint="One or two lines, shown on cards and in link previews" wide>
        <textarea name="summary" defaultValue={g?.summary} required maxLength={240} rows={2} />
      </Field>
      <Field label="Full description" name="description" state={state} hint="Blank line = new paragraph" wide>
        <textarea name="description" defaultValue={g?.description} required maxLength={3000} rows={5} />
      </Field>
      <Field label="Rules / how to win" name="rules" state={state} hint="One rule per line" wide>
        <textarea name="rules" defaultValue={g?.rules.join("\n")} maxLength={3000} rows={5} />
      </Field>

      <div className="adm-row-2">
        <Field label="Starts (India time)" name="startsAt" state={state}>
          <input type="datetime-local" name="startsAt" defaultValue={toIstInput(g?.startsAt ?? inDays(0))} required />
        </Field>
        <Field label="Ends (India time)" name="endsAt" state={state}>
          <input type="datetime-local" name="endsAt" defaultValue={toIstInput(g?.endsAt ?? inDays(14))} required />
        </Field>
      </div>

      <fieldset className="adm-cover">
        <legend>Photo</legend>
        <div className="adm-photo-grid">
          <div className="adm-photo-preview">
            {validImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`${img.split("?")[0]}?w=600&q=70&auto=format&fit=crop`} alt="" />
            ) : (
              <span>Paste an Unsplash image URL to preview</span>
            )}
          </div>
          <div>
            <Field label="Unsplash image URL" name="imageUrl" state={state} hint="Right-click a photo on unsplash.com → Copy image address">
              <input name="imageUrl" defaultValue={g?.image.url} required onChange={(e) => setImg(e.target.value.trim())} />
            </Field>
            <Field label="Image description (alt text)" name="imageAlt" state={state}>
              <input name="imageAlt" defaultValue={g?.image.alt} required maxLength={160} />
            </Field>
          </div>
        </div>
      </fieldset>

      <fieldset className="adm-cover">
        <legend>Winner announcement</legend>
        <p className="adm-subnote">
          Use “Pick random winner” on the entries page, or type a name here yourself. Leave empty until the winner is
          chosen.
        </p>
        <div className="adm-row-2">
          <Field label="Winner name (shown publicly)" name="winnerName" state={state} hint="e.g. Priya S.">
            <input name="winnerName" defaultValue={g?.winner?.name} maxLength={80} />
          </Field>
          <Field label="Winner note (optional)" name="winnerNote" state={state}>
            <input name="winnerNote" defaultValue={g?.winner?.note} maxLength={200} placeholder="Congratulations! We'll DM you on Instagram." />
          </Field>
        </div>
      </fieldset>

      <label className="adm-check adm-check-strong">
        <input type="checkbox" name="published" defaultChecked={g ? g.published : true} />
        <span>
          <strong>Published</strong>
          <small>Untick to keep it as a draft — it won&apos;t appear anywhere on the website.</small>
        </span>
      </label>

      <div className="adm-actions">
        <Link href="/admin/giveaways" className="adm-btn">
          Cancel
        </Link>
        <SubmitButton>{g ? "Save changes" : "Create giveaway"}</SubmitButton>
      </div>
    </form>
  );
}
