"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FadeIn from "../animations/FadeIn";
import StaggerChildren, { StaggerItem } from "../animations/StaggerChildren";

// Placeholder reads - will be replaced with real data
const reads = [
  {
    id: 1,
    title: "The Future of Web Development",
    source: "smashingmagazine.com",
    url: "https://smashingmagazine.com",
    category: "Development",
  },
  {
    id: 2,
    title: "Designing for Accessibility",
    source: "a11yproject.com",
    url: "https://a11yproject.com",
    category: "Design",
  },
  {
    id: 3,
    title: "Understanding Modern JavaScript",
    source: "javascript.info",
    url: "https://javascript.info",
    category: "Learning",
  },
];

export default function LatestReads() {
  return (
    <section className="pt-16 pb-8 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-semibold tracking-tight">
              Weekly Reads
            </h2>
            <Link
              href="/reads"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              View all →
            </Link>
          </div>
        </FadeIn>

        <StaggerChildren className="grid md:grid-cols-3 gap-4">
          {reads.map((read) => (
            <StaggerItem key={read.id}>
              <motion.a
                href={read.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-5 rounded-lg bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] hover:border-[var(--border)] transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                    {read.category}
                  </span>
                  <svg
                    className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2">
                  {read.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  {read.source}
                </p>
              </motion.a>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
