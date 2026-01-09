"use client";

import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState, ReactNode } from "react";
import remarkGfm from "remark-gfm";
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

// Copy button component for code blocks
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 rounded-md bg-[var(--bg-tertiary)] hover:bg-[var(--border)] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      aria-label={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

// Extract text content from React children
function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (!children) return "";

  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }

  if (typeof children === "object" && children !== null && "props" in children) {
    const element = children as React.ReactElement<{ children?: ReactNode }>;
    return extractTextFromChildren(element.props.children);
  }

  return "";
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
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    const codeText = extractTextFromChildren(children);
    return (
      <pre className="relative group" {...props}>
        {children}
        <CopyButton text={codeText} />
      </pre>
    );
  },
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
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-[var(--bg-secondary)]" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="divide-y divide-[var(--border)]" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="border-b border-[var(--border)]" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)] border border-[var(--border)]" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-3 text-[var(--text-secondary)] border border-[var(--border)]" {...props}>
      {children}
    </td>
  ),
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
          remarkPlugins: [remarkGfm],
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
