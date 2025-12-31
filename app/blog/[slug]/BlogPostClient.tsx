"use client";

import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";
import TableOfContents from "@/components/blog/TableOfContents";
import MobileTableOfContents from "@/components/blog/MobileTableOfContents";

interface TOCHeading {
  id: string;
  text: string;
  level: number;
}

interface BlogPostClientProps {
  content: string;
  headings: TOCHeading[];
}

// Custom MDX components for styling
const components = {
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = children
      ?.toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return (
      <h2 id={id} className="scroll-mt-24" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = children
      ?.toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return (
      <h3 id={id} className="scroll-mt-24" {...props}>
        {children}
      </h3>
    );
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="relative group" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInlineCode = !className;
    if (isInlineCode) {
      return (
        <code className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

export default function BlogPostClient({ content, headings }: BlogPostClientProps) {
  const [mdxSource, setMdxSource] = useState<Awaited<ReturnType<typeof serialize>> | null>(null);

  // Hide scrollbar on blog post pages
  useEffect(() => {
    document.documentElement.classList.add("hide-scrollbar");
    return () => {
      document.documentElement.classList.remove("hide-scrollbar");
    };
  }, []);

  useEffect(() => {
    async function compileMDX() {
      const serialized = await serialize(content, {
        mdxOptions: {
          development: process.env.NODE_ENV === "development",
        },
      });
      setMdxSource(serialized);
    }
    compileMDX();
  }, [content]);

  if (!mdxSource) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4"></div>
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-full"></div>
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div className="relative pb-0 md:pb-20 xl:pb-0">
      {/* Article content */}
      <div
        className="prose prose-lg max-w-none dark:prose-invert
          prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--text-primary)]
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed
          prose-a:text-[var(--text-primary)] prose-a:underline prose-a:underline-offset-4
          prose-strong:text-[var(--text-primary)]
          prose-code:text-[var(--text-primary)] prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[var(--bg-secondary)] prose-pre:border prose-pre:border-[var(--border)] prose-pre:rounded-lg prose-pre:overflow-x-auto
          prose-ul:text-[var(--text-secondary)] prose-li:marker:text-[var(--text-muted)]"
      >
        <MDXRemote {...mdxSource} components={components} />
      </div>

      {/* Fixed TOC on the right side of viewport - Desktop */}
      <aside className="hidden xl:block fixed top-28 w-52 right-12 2xl:right-24">
        <TableOfContents headings={headings} />
      </aside>

      {/* Mobile TOC - Fixed at bottom */}
      <MobileTableOfContents headings={headings} />
    </div>
  );
}
