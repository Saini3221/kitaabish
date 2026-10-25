import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundBoxes from "@/components/BackgroundBoxes";
import ServicesIntro from "@/components/ServicesIntro";
import BlogList from "@/components/BlogList";
import { getPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import "../services/services.css";
import "../portfolio/portfolio.css";
import "./blog.css";

export async function generateMetadata() {
  return pageMetadata("blog");
}

// Re-read posts from MongoDB at most once a minute.
export const revalidate = 60;

export default async function BlogPage() {
  const { posts, error } = await getPosts();
  return (
    <>
      <BackgroundBoxes />
      <Navbar />
      <main>
        <ServicesIntro
          title="The Kitaabish Journal"
          sub="Writing tips, publishing guides and honest advice from the people who make books for a living."
        />
        <BlogList posts={posts} error={error} />
      </main>
      <Footer />
    </>
  );
}
