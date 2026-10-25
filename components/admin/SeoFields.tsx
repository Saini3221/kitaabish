"use client";

import { useState } from "react";
import { Field } from "./FormBits";
import type { FormState } from "@/lib/validation";

export type SeoSite = { siteName: string; siteUrl: string; titleTemplate: string };

type Names = { title: string; description: string; keywords: string; ogImage: string; canonical?: string; noindex?: string };
type Initial = { title?: string; description?: string; keywords?: string[]; ogImage?: string; canonical?: string; noindex?: boolean };

const TITLE_MAX = 60;
const DESC_MAX = 160;

function Counter({ n, max }: { n: number; max: number }) {
  const cls = n === 0 ? "" : n > max ? "is-over" : n < max * 0.5 ? "is-short" : "is-good";
  return (
    <span className={`adm-counter ${cls}`}>
      {n}/{max}
    </span>
  );
}

/**
 * SEO inputs with live previews: how the page looks in Google and when shared on social media.
 * Empty fields fall back to `fallbackTitle` / `fallbackDescription`.
 */
export default function SeoFields({
  names,
  initial,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
  path,
  site,
  useTemplate = true,
  state,
}: {
  names: Names;
  initial: Initial;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackImage?: string;
  path: string;
  site: SeoSite;
  useTemplate?: boolean;
  state: FormState;
}) {
  const [title, setTitle] = useState(initial.title ?? "");
  const [desc, setDesc] = useState(initial.description ?? "");
  const [image, setImage] = useState(initial.ogImage ?? "");

  const shownTitle = title || fallbackTitle;
  const fullTitle = useTemplate ? site.titleTemplate.replace("%s", shownTitle) : shownTitle;
  const shownDesc = desc || fallbackDescription;
  const shownImage = image || fallbackImage || "";
  let host = "kitaabish.com";
  try {
    host = new URL(site.siteUrl).host;
  } catch {}
  const crumbs = [host, ...path.split("/").filter(Boolean)].join(" › ");

  return (
    <div className="adm-seo">
      <div className="adm-seo-fields">
        <Field label="Meta title" name={names.title} state={state} hint={`Empty = “${fallbackTitle}”`}>
          <div className="adm-input-count">
            <input name={names.title} defaultValue={initial.title} maxLength={70} onChange={(e) => setTitle(e.target.value)} />
            <Counter n={fullTitle.length} max={TITLE_MAX} />
          </div>
        </Field>
        <Field label="Meta description" name={names.description} state={state} hint="Aim for 120–160 characters">
          <div className="adm-input-count">
            <textarea
              name={names.description}
              defaultValue={initial.description}
              maxLength={200}
              rows={3}
              onChange={(e) => setDesc(e.target.value)}
            />
            <Counter n={shownDesc.length} max={DESC_MAX} />
          </div>
        </Field>
        <Field label="Keywords" name={names.keywords} state={state} hint="Comma separated, e.g. ghostwriting, book editing">
          <input name={names.keywords} defaultValue={initial.keywords?.join(", ")} maxLength={600} />
        </Field>
        <Field label="Social share image URL" name={names.ogImage} state={state} hint="1200×630 works best. Empty = default image">
          <input name={names.ogImage} defaultValue={initial.ogImage} onChange={(e) => setImage(e.target.value.trim())} />
        </Field>
        {names.canonical && (
          <Field label="Canonical URL (optional)" name={names.canonical} state={state} hint="Only if this content first appeared elsewhere">
            <input name={names.canonical} defaultValue={initial.canonical} />
          </Field>
        )}
        {names.noindex && (
          <label className="adm-check">
            <input type="checkbox" name={names.noindex} defaultChecked={!!initial.noindex} />
            <span>Hide from search engines (noindex)</span>
          </label>
        )}
      </div>

      <div className="adm-seo-previews">
        <span className="adm-preview-label">Google preview</span>
        <div className="adm-serp">
          <div className="adm-serp-site">
            <span className="adm-serp-fav">{site.siteName.charAt(0)}</span>
            <span>
              <strong>{site.siteName}</strong>
              <small>{crumbs}</small>
            </span>
          </div>
          <p className="adm-serp-title">{fullTitle.length > 62 ? `${fullTitle.slice(0, 60)}…` : fullTitle}</p>
          <p className="adm-serp-desc">{shownDesc.length > 160 ? `${shownDesc.slice(0, 158)}…` : shownDesc}</p>
        </div>

        <span className="adm-preview-label">Social share preview</span>
        <div className="adm-og">
          <div className="adm-og-img">
            {/^https:\/\//.test(shownImage) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shownImage} alt="" />
            ) : (
              <span>{site.siteName}</span>
            )}
          </div>
          <div className="adm-og-body">
            <small>{host.toUpperCase()}</small>
            <strong>{shownTitle}</strong>
            <p>{shownDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
