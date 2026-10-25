"use client";

import { useActionState } from "react";
import { saveSiteSeo } from "@/app/admin/actions";
import { Field, FormError, SubmitButton } from "./FormBits";
import SeoFields from "./SeoFields";
import type { SiteSeo } from "@/lib/seo";

export default function SiteSeoForm({ site }: { site: SiteSeo }) {
  const [state, action] = useActionState(saveSiteSeo, undefined);
  return (
    <form action={action} className="adm-form">
      <FormError state={state} />
      <div className="adm-row-3">
        <Field label="Site name" name="siteName" state={state}>
          <input name="siteName" defaultValue={site.siteName} required maxLength={60} />
        </Field>
        <Field label="Site URL" name="siteUrl" state={state} hint="Your live domain, e.g. https://kitaabish.com">
          <input name="siteUrl" defaultValue={site.siteUrl} required maxLength={200} />
        </Field>
        <Field label="Title format" name="titleTemplate" state={state} hint="%s = page title">
          <input name="titleTemplate" defaultValue={site.titleTemplate} required maxLength={80} />
        </Field>
      </div>

      <h3 className="adm-subhead">Default meta tags</h3>
      <p className="adm-subnote">Used on any page that doesn&apos;t set its own.</p>
      <SeoFields
        names={{ title: "defaultTitle", description: "defaultDescription", keywords: "keywords", ogImage: "ogImage" }}
        initial={{ title: site.defaultTitle, description: site.defaultDescription, keywords: site.keywords, ogImage: site.ogImage }}
        fallbackTitle={site.defaultTitle}
        fallbackDescription={site.defaultDescription}
        path="/"
        site={site}
        useTemplate={false}
        state={state}
      />

      <h3 className="adm-subhead">Search engines &amp; social</h3>
      <div className="adm-row-3">
        <Field label="Google Search Console code" name="googleVerification" state={state} hint="Paste the code or the whole meta tag">
          <input name="googleVerification" defaultValue={site.googleVerification} maxLength={300} />
        </Field>
        <Field label="Bing Webmaster code" name="bingVerification" state={state}>
          <input name="bingVerification" defaultValue={site.bingVerification} maxLength={300} />
        </Field>
        <Field label="X / Twitter handle" name="twitterHandle" state={state} hint="e.g. @kitaabish">
          <input name="twitterHandle" defaultValue={site.twitterHandle} maxLength={16} />
        </Field>
      </div>
      <label className="adm-check adm-check-strong">
        <input type="checkbox" name="allowIndexing" defaultChecked={site.allowIndexing} />
        <span>
          <strong>Allow search engines to index the website</strong>
          <small>Turn off only while the site is unfinished — it hides every page from Google.</small>
        </span>
      </label>

      <div className="adm-actions">
        <SubmitButton>Save site SEO</SubmitButton>
      </div>
    </form>
  );
}
