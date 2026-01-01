"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FadeIn from "../animations/FadeIn";
import StaggerChildren, { StaggerItem } from "../animations/StaggerChildren";

// Placeholder posts - will be replaced with real data from MDX
const posts = [
  {
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js 14",
    excerpt: "A comprehensive guide to building modern web applications with Next.js App Router.",
    date: "2025-01-15",
    readTime: "5 min read",
  },
  {
    slug: "design-engineering",
    title: "The Art of Design Engineering",
    excerpt: "Bridging the gap between design and development for better products.",
    date: "2025-01-10",
    readTime: "4 min read",
  },
  {
    slug: "building-in-public",
    title: "Why I Build in Public",
    excerpt: "Thoughts on transparency, community, and the benefits of sharing your work.",
    date: "2025-01-05",
    readTime: "3 min read",
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RecentPosts() {
  return (
    <section className="py-8 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent" />
            <h2 className="text-lg md:text-2xl tracking-tight text-[var(--text-secondary)]">
              Recent Writing
            </h2>
            <Link
              href="/blog"
              className="text-xs md:text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              View all →
            </Link>
          </div>
        </FadeIn>

        <StaggerChildren className="space-y-1">
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <Link href={`/blog/${post.slug}`}>
                <motion.article
                  className="group flex items-baseline justify-between py-4 border-b border-[var(--bg-tertiary)] hover:border-[var(--border)] transition-colors"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="flex-1">
                    <h3 className="text-base font-medium group-hover:text-[var(--text-primary)] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1 hidden md:block">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] ml-4 shrink-0">
                    <span className="hidden sm:inline">{post.readTime}</span>
                    <span>{formatDate(post.date)}</span>
                  </div>
                </motion.article>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
