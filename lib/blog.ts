import { getDb } from "./mongodb";
import type { Post } from "./blog-utils";

export * from "./blog-utils";

type PostDoc = Omit<Post, "publishedAt"> & { publishedAt: Date };

const toPost = (d: PostDoc): Post => ({ ...d, content: d.content ?? [], publishedAt: new Date(d.publishedAt).toISOString() });

export async function getPosts(): Promise<{ posts: Post[]; error?: string }> {
  try {
    const db = await getDb();
    const docs = await db
      .collection<PostDoc>("posts")
      .find({}, { projection: { _id: 0, content: 0 } })
      .sort({ publishedAt: -1 })
      .toArray();
    return { posts: docs.map(toPost) };
  } catch (err) {
    console.error("[blog] failed to load posts:", err);
    return { posts: [], error: "We couldn't load the journal right now. Please try again shortly." };
  }
}

type PostPage = { post: Post | null; related: Post[]; prev: Post | null; next: Post | null };

export async function getPost(slug: string): Promise<PostPage> {
  const empty: PostPage = { post: null, related: [], prev: null, next: null };
  try {
    const db = await getDb();
    const col = db.collection<PostDoc>("posts");
    const doc = await col.findOne({ slug }, { projection: { _id: 0 } });
    if (!doc) return empty;
    const light = { projection: { _id: 0, content: 0 } };
    const [others, older, newer] = await Promise.all([
      col.find({ slug: { $ne: slug } }, light).sort({ publishedAt: -1 }).limit(3).toArray(),
      col.find({ publishedAt: { $lt: doc.publishedAt } }, light).sort({ publishedAt: -1 }).limit(1).toArray(),
      col.find({ publishedAt: { $gt: doc.publishedAt } }, light).sort({ publishedAt: 1 }).limit(1).toArray(),
    ]);
    return {
      post: toPost(doc),
      related: others.map(toPost),
      prev: older[0] ? toPost(older[0]) : null,
      next: newer[0] ? toPost(newer[0]) : null,
    };
  } catch (err) {
    console.error("[blog] failed to load post:", err);
    return empty;
  }
}
