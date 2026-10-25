import Image from "next/image";
import Link from "next/link";
import { formatDate, unsplash, type Post } from "@/lib/blog-utils";

export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className={`post-card${featured ? " post-card-featured" : ""}`}>
      <div className="post-card-img">
        <Image
          src={unsplash(post.cover.url, featured ? 1400 : 900)}
          alt={post.cover.alt}
          fill
          sizes={featured ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 700px) 100vw, 33vw"}
          priority={featured}
        />
        <span className="post-chip">{post.category}</span>
      </div>
      <div className="post-card-body">
        <span className="post-meta">
          {formatDate(post.publishedAt)} · {post.readingTime} min read
        </span>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <span className="post-more">
          Read the story <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
