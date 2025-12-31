import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPostBySlug,
  getAllPostSlugs,
  extractHeadings,
  formatDate,
} from "@/lib/mdx";
import BlogPostClient from "./BlogPostClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Elvis O. Amoako`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
        {/* Main Content */}
        <article className="max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
              <time>{formatDate(post.date)}</time>
              <span className="text-[var(--text-muted)]">·</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          {/* MDX Content */}
          <BlogPostClient content={post.content} headings={headings} />

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                ← All posts
              </Link>
            </div>
          </footer>
        </article>

        {/* Sidebar with TOC - rendered in client component */}
      </div>
    </div>
  );
}
