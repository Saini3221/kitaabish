import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import PostForm from "@/components/admin/PostForm";
import { getSiteSeo } from "@/lib/seo";

const starter = `Start with an opening paragraph that hooks the reader.

## Your first section
Write a paragraph here.

> A memorable line worth pulling out.

- A list item
- Another list item

! A practical tip for the reader.`;

export default async function NewPost() {
  await requireAdmin();
  const { siteName, siteUrl, titleTemplate } = await getSiteSeo();
  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/posts" className="adm-crumb">
            ← Journal posts
          </Link>
          <h1>New post</h1>
        </div>
      </header>
      <PostForm body={starter} site={{ siteName, siteUrl, titleTemplate }} />
    </>
  );
}
