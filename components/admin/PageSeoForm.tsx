"use client";

import { useActionState } from "react";
import { savePageSeo } from "@/app/admin/actions";
import { FormError, SubmitButton } from "./FormBits";
import SeoFields, { type SeoSite } from "./SeoFields";
import type { PageKey, PageSeo } from "@/lib/seo";

export default function PageSeoForm({
  pageKey,
  path,
  saved,
  defaults,
  site,
  siteImage,
}: {
  pageKey: PageKey;
  path: string;
  saved: Partial<PageSeo>;
  defaults: PageSeo;
  site: SeoSite;
  siteImage: string;
}) {
  const [state, action] = useActionState(savePageSeo, undefined);
  return (
    <form action={action} className="adm-form">
      <input type="hidden" name="key" value={pageKey} />
      <FormError state={state} />
      <SeoFields
        names={{ title: "title", description: "description", keywords: "keywords", ogImage: "ogImage", noindex: "noindex" }}
        initial={saved}
        fallbackTitle={defaults.title}
        fallbackDescription={defaults.description}
        fallbackImage={siteImage}
        path={path}
        site={site}
        useTemplate={pageKey !== "home"}
        state={state}
      />
      <div className="adm-actions">
        <SubmitButton>Save page SEO</SubmitButton>
      </div>
    </form>
  );
}
