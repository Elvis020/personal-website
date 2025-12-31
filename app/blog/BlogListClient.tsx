"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/mdx";

interface BlogListClientProps {
  posts: BlogPostMeta[];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="space-y-2"
    >
      {posts.map((post) => (
        <motion.div
          key={post.slug}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
        >
          <Link href={`/blog/${post.slug}`}>
            <motion.article
              className="group p-6 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors border border-transparent hover:border-[var(--border)]"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-medium mb-2 group-hover:text-[var(--text-primary)] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-1 text-sm text-[var(--text-muted)] shrink-0">
                  <span>{formatDate(post.date)}</span>
                  <span className="hidden md:inline">{post.readTime}</span>
                </div>
              </div>
            </motion.article>
          </Link>
        </motion.div>
      ))}

      {posts.length === 0 && (
        <p className="text-[var(--text-secondary)] text-center py-12">
          No posts yet. Check back soon!
        </p>
      )}
    </motion.div>
  );
}
