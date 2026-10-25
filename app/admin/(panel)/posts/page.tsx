import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { formatDate } from "@/lib/blog-utils";
import { deletePost } from "../../actions";
import { DeleteButton } from "@/components/admin/FormBits";
import Flash from "@/components/admin/Flash";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
type Row = { slug: string; title: string; category: string; publishedAt: Date; readingTime: number; featured?: boolean };

export default async function PostsAdmin({ searchParams }: Props) {
  await requireAdmin();
  const posts = await (await getDb())
    .collection<Row>("posts")
    .find({}, { projection: { _id: 0, slug: 1, title: 1, category: 1, publishedAt: 1, readingTime: 1, featured: 1 } })
    .sort({ publishedAt: -1 })
    .toArray();

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Journal posts</h1>
          <p>Articles shown at /blog.</p>
        </div>
        <Link href="/admin/posts/new" className="adm-btn adm-btn-primary">
          + New post
        </Link>
      </header>
      <Flash params={await searchParams} />
      {posts.length === 0 ? (
        <p className="adm-empty">No posts yet. Write the first one.</p>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Published</th>
              <th>Read</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.slug}>
                <td>
                  <strong>{p.title}</strong> {p.featured && <span className="adm-badge">Featured</span>}
                </td>
                <td>{p.category}</td>
                <td>{formatDate(new Date(p.publishedAt).toISOString())}</td>
                <td>{p.readingTime} min</td>
                <td>
                  <div className="adm-row-actions">
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-sm">
                      View
                    </a>
                    <Link href={`/admin/posts/${p.slug}`} className="adm-btn adm-btn-sm">
                      Edit
                    </Link>
                    <DeleteButton action={deletePost.bind(null, p.slug)} label={p.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
