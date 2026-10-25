"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { savePost } from "@/app/admin/actions";
import { Field, FormError, SubmitButton } from "./FormBits";
import SeoFields, { type SeoSite } from "./SeoFields";
import type { Post } from "@/lib/blog-utils";

const today = () => new Date().toISOString().slice(0, 10);

export default function PostForm({ post, body, site }: { post?: Post; body?: string; site: SeoSite }) {
  const [state, action] = useActionState(savePost, undefined);
  const [cover, setCover] = useState(post?.cover.url ?? "");
  const validCover = /^https:\/\/images\.unsplash\.com\//.test(cover);

  return (
    <form action={action} className="adm-form">
      {post && <input type="hidden" name="originalSlug" value={post.slug} />}
      <FormError state={state} />
      <Field label="Title" name="title" state={state} wide>
        <input name="title" defaultValue={post?.title} required maxLength={160} />
      </Field>
      <Field label="Excerpt" name="excerpt" state={state} hint="Shown on cards and as the intro" wide>
        <textarea name="excerpt" defaultValue={post?.excerpt} required maxLength={400} rows={2} />
      </Field>
      <div className="adm-row-3">
        <Field label="Category" name="category" state={state} hint="e.g. Writing, Editing">
          <input name="category" defaultValue={post?.category} required maxLength={40} />
        </Field>
        <Field label="Tags" name="tags" state={state} hint="Comma separated">
          <input name="tags" defaultValue={post?.tags.join(", ")} maxLength={300} />
        </Field>
        <Field label="Publish date" name="publishedAt" state={state}>
          <input type="date" name="publishedAt" defaultValue={post ? post.publishedAt.slice(0, 10) : today()} required />
        </Field>
      </div>
      <div className="adm-row-2">
        <Field label="Author name" name="authorName" state={state}>
          <input name="authorName" defaultValue={post?.author.name ?? "Kitaabish Editorial Team"} required maxLength={80} />
        </Field>
        <Field label="Author role" name="authorRole" state={state}>
          <input name="authorRole" defaultValue={post?.author.role ?? "Editors & publishing experts"} maxLength={120} />
        </Field>
      </div>

      <fieldset className="adm-cover">
        <legend>Cover photo</legend>
        <div className="adm-photo-grid">
          <div className="adm-photo-preview">
            {validCover ? (
              // Plain <img>: preview only, any Unsplash size works.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`${cover.split("?")[0]}?w=600&q=70&auto=format&fit=crop`} alt="" />
            ) : (
              <span>Paste an Unsplash image URL to preview</span>
            )}
          </div>
          <div>
            <Field
              label="Unsplash image URL"
              name="coverUrl"
              state={state}
              hint="Right-click a photo on unsplash.com → Copy image address (starts with https://images.unsplash.com/)"
            >
              <input name="coverUrl" defaultValue={post?.cover.url} required onChange={(e) => setCover(e.target.value.trim())} />
            </Field>
            <Field label="Image description (alt text)" name="coverAlt" state={state}>
              <input name="coverAlt" defaultValue={post?.cover.alt} required maxLength={160} />
            </Field>
            <Field label="Photo credit" name="coverCredit" state={state} hint="e.g. Jane Doe / Unsplash">
              <input name="coverCredit" defaultValue={post?.cover.credit ?? "Unsplash"} maxLength={80} />
            </Field>
          </div>
        </div>
      </fieldset>

      <Field label="Post" name="body" state={state} wide>
        <textarea name="body" defaultValue={body} rows={18} className="adm-editor" spellCheck />
      </Field>
      <div className="adm-cheatsheet">
        <strong>Formatting:</strong>
        <code>## Heading</code>
        <code>&gt; Pull quote</code>
        <code>! Kitaabish tip</code>
        <code>- List item</code>
        <span>Leave a blank line between paragraphs. Reading time is calculated automatically.</span>
      </div>

      <label className="adm-check">
        <input type="checkbox" name="featured" defaultChecked={!!post?.featured} />
        <span>Featured story (shown large at the top of the journal)</span>
      </label>

      <fieldset className="adm-cover">
        <legend>SEO — Google &amp; social sharing</legend>
        <p className="adm-subnote">Leave empty to use the post title, excerpt and cover photo.</p>
        <SeoFields
          names={{
            title: "seoTitle",
            description: "seoDescription",
            keywords: "seoKeywords",
            ogImage: "seoOgImage",
            canonical: "seoCanonical",
            noindex: "seoNoindex",
          }}
          initial={post?.seo ?? {}}
          fallbackTitle={post?.title ?? "Post title"}
          fallbackDescription={post?.excerpt ?? "Post excerpt"}
          fallbackImage={validCover ? `${cover.split("?")[0]}?w=1200&q=75&auto=format&fit=crop` : ""}
          path={`/blog/${post?.slug ?? "new-post"}`}
          site={site}
          state={state}
        />
      </fieldset>

      <div className="adm-actions">
        <Link href="/admin/posts" className="adm-btn">
          Cancel
        </Link>
        <SubmitButton>{post ? "Save changes" : "Publish post"}</SubmitButton>
      </div>
    </form>
  );
}
