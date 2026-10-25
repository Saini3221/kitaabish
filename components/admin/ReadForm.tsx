"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveRead } from "@/app/admin/actions";
import CoverFields from "./CoverFields";
import { Field, FormError, SubmitButton } from "./FormBits";
import type { RecommendedRead } from "@/lib/reads";

const blank = {
  title: "",
  author: "",
  genre: "",
  note: "",
  order: 99,
  cover: { c1: "#2f29a0", c2: "#141047", fg: "#ffffff", art: "river" as const },
};

export default function ReadForm({ read }: { read?: RecommendedRead }) {
  const [state, action] = useActionState(saveRead, undefined);
  const r = read ?? blank;
  const [title, setTitle] = useState(r.title);
  const [author, setAuthor] = useState(r.author);
  const [genre, setGenre] = useState(r.genre);

  return (
    <form action={action} className="adm-form">
      {read && <input type="hidden" name="originalSlug" value={read.slug} />}
      <FormError state={state} />
      <div className="adm-row-2">
        <Field label="Title" name="title" state={state}>
          <input name="title" defaultValue={r.title} required maxLength={120} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Author" name="author" state={state}>
          <input name="author" defaultValue={r.author} required maxLength={120} onChange={(e) => setAuthor(e.target.value)} />
        </Field>
      </div>
      <div className="adm-row-2">
        <Field label="Genre" name="genre" state={state} hint="e.g. Fiction, Memoir, Writing craft">
          <input name="genre" defaultValue={r.genre} required maxLength={60} onChange={(e) => setGenre(e.target.value)} />
        </Field>
        <Field label="Order" name="order" state={state} hint="Lower numbers show first">
          <input type="number" name="order" defaultValue={r.order} min={0} max={9999} required />
        </Field>
      </div>
      <Field label="Why we recommend it" name="note" state={state} hint="One short line, shown under the book (max 200 characters)" wide>
        <textarea name="note" defaultValue={r.note} required maxLength={200} rows={2} />
      </Field>
      <CoverFields initial={r.cover} title={title} author={author} genre={genre} state={state} />
      <div className="adm-actions">
        <Link href="/admin/reads" className="adm-btn">
          Cancel
        </Link>
        <SubmitButton>{read ? "Save changes" : "Add book"}</SubmitButton>
      </div>
    </form>
  );
}
