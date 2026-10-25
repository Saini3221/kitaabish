"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { savePortfolio } from "@/app/admin/actions";
import CoverFields from "./CoverFields";
import { Field, FormError, SubmitButton } from "./FormBits";
import type { PortfolioBook } from "@/lib/portfolio";

const blank: Omit<PortfolioBook, "slug"> = {
  title: "",
  author: "",
  genre: "",
  year: new Date().getFullYear(),
  pages: 200,
  formats: ["Paperback", "eBook"],
  services: [],
  blurb: "",
  quote: "",
  featured: false,
  order: 99,
  cover: { c1: "#2f29a0", c2: "#141047", fg: "#ffffff", art: "river" },
};

export default function PortfolioForm({ book }: { book?: PortfolioBook }) {
  const [state, action] = useActionState(savePortfolio, undefined);
  const b = book ?? blank;
  const [title, setTitle] = useState(b.title);
  const [author, setAuthor] = useState(b.author);
  const [genre, setGenre] = useState(b.genre);

  return (
    <form action={action} className="adm-form">
      {book && <input type="hidden" name="originalSlug" value={book.slug} />}
      <FormError state={state} />
      <div className="adm-row-2">
        <Field label="Title" name="title" state={state}>
          <input name="title" defaultValue={b.title} required maxLength={120} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Author" name="author" state={state}>
          <input name="author" defaultValue={b.author} required maxLength={120} onChange={(e) => setAuthor(e.target.value)} />
        </Field>
      </div>
      <div className="adm-row-3">
        <Field label="Genre" name="genre" state={state}>
          <input name="genre" defaultValue={b.genre} required maxLength={60} onChange={(e) => setGenre(e.target.value)} />
        </Field>
        <Field label="Year" name="year" state={state}>
          <input type="number" name="year" defaultValue={b.year} min={1900} max={2100} required />
        </Field>
        <Field label="Pages" name="pages" state={state}>
          <input type="number" name="pages" defaultValue={b.pages} min={1} max={5000} required />
        </Field>
      </div>
      <Field label="Blurb" name="blurb" state={state} wide>
        <textarea name="blurb" defaultValue={b.blurb} required maxLength={800} rows={3} />
      </Field>
      <Field label="Author quote (optional)" name="quote" state={state} wide>
        <input name="quote" defaultValue={b.quote ?? ""} maxLength={300} />
      </Field>
      <div className="adm-row-2">
        <Field label="Formats" name="formats" state={state} hint="Comma separated, e.g. Paperback, eBook">
          <input name="formats" defaultValue={b.formats.join(", ")} maxLength={300} />
        </Field>
        <Field label="Services we did" name="services" state={state} hint="Comma separated">
          <input name="services" defaultValue={b.services.join(", ")} maxLength={500} />
        </Field>
      </div>
      <div className="adm-row-2">
        <Field label="Order" name="order" state={state} hint="Lower numbers show first">
          <input type="number" name="order" defaultValue={b.order} min={0} max={9999} required />
        </Field>
        <label className="adm-check">
          <input type="checkbox" name="featured" defaultChecked={!!b.featured} />
          <span>Featured (gold badge in the library)</span>
        </label>
      </div>
      <CoverFields initial={b.cover} title={title} author={author} genre={genre} state={state} />
      <div className="adm-actions">
        <Link href="/admin/portfolio" className="adm-btn">
          Cancel
        </Link>
        <SubmitButton>{book ? "Save changes" : "Add book"}</SubmitButton>
      </div>
    </form>
  );
}
