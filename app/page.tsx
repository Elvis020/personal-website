import Hero from "@/components/home/Hero";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import RecentPosts from "@/components/home/RecentPosts";
import LatestReads from "@/components/home/LatestReads";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <RecentPosts />
      <LatestReads />
    </>
  );
}
