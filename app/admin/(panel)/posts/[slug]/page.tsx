import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getPost } from "@/lib/blog";
import { blocksToMarkup } from "@/lib/markup";
import { isSlug } from "@/lib/validation";
import PostForm from "@/components/admin/PostForm";
import { getSiteSeo } from "@/lib/seo";

export default async function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const [{ post }, { siteName, siteUrl, titleTemplate }] = await Promise.all([getPost(slug), getSiteSeo()]);
  if (!post) notFound();

  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/posts" className="adm-crumb">
            ← Journal posts
          </Link>
          <h1>Edit post</h1>
        </div>
      </header>
      <PostForm post={post} body={blocksToMarkup(post.content)} site={{ siteName, siteUrl, titleTemplate }} />
    </>
  );
}
