import Hero from "@/components/home/Hero";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import RecentPosts from "@/components/home/RecentPosts";
import LatestReads from "@/components/home/LatestReads";
import { getAllPostsMeta } from "@/lib/mdx";

export default function Home() {
  // Fetch posts at build time (server component)
  const posts = getAllPostsMeta();

  return (
    <>
      <Hero />
      <FeaturedProjects />
      <RecentPosts posts={posts} />
      <LatestReads />
    </>
  );
}
