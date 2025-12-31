import Link from "next/link";
import { getAllPostsMeta, formatDate } from "@/lib/mdx";
import BlogListClient from "./BlogListClient";

export const metadata = {
  title: "Blog | Elvis O. Amoako",
  description: "Thoughts on software development, design, and building products.",
};

export default function BlogPage() {
  const posts = getAllPostsMeta();

  return (
    <div className="max-w-5xl mx-auto px-6 pt-12 pb-8">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
        Blog
      </h1>

      <p className="text-lg text-[var(--text-secondary)] max-w-2xl mb-16 leading-relaxed">
        Thoughts on software development, design, and building products.
        I write about what I learn and what interests me.
      </p>

      {/* Posts List */}
      <BlogListClient posts={posts} />
    </div>
  );
}
