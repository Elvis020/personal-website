"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren, { StaggerItem } from "@/components/animations/StaggerChildren";

interface Read {
  id: number;
  title: string;
  source: string;
  url: string;
  category: string;
  note?: string;
}

interface WeeklyReads {
  week: string;
  dateRange: string;
  reads: Read[];
}

// Placeholder data - will be replaced with real data
const weeklyReads: WeeklyReads[] = [
  {
    week: "Week 3, 2025",
    dateRange: "Jan 13 - Jan 19",
    reads: [
      {
        id: 1,
        title: "The Future of React Server Components",
        source: "react.dev",
        url: "https://react.dev",
        category: "Development",
        note: "Great deep dive into how RSC works under the hood.",
      },
      {
        id: 2,
        title: "Designing for Accessibility: A Practical Guide",
        source: "a11yproject.com",
        url: "https://a11yproject.com",
        category: "Design",
      },
      {
        id: 3,
        title: "How to Build a Second Brain",
        source: "fortelabs.com",
        url: "https://fortelabs.com",
        category: "Productivity",
        note: "Changed how I think about note-taking and knowledge management.",
      },
    ],
  },
  {
    week: "Week 2, 2025",
    dateRange: "Jan 6 - Jan 12",
    reads: [
      {
        id: 4,
        title: "Modern CSS in 2025",
        source: "css-tricks.com",
        url: "https://css-tricks.com",
        category: "Development",
      },
      {
        id: 5,
        title: "The Psychology of Design",
        source: "nngroup.com",
        url: "https://nngroup.com",
        category: "Design",
      },
      {
        id: 6,
        title: "Building in Public: Lessons Learned",
        source: "medium.com",
        url: "https://medium.com",
        category: "Career",
      },
      {
        id: 7,
        title: "Understanding WebAssembly",
        source: "webassembly.org",
        url: "https://webassembly.org",
        category: "Development",
      },
    ],
  },
  {
    week: "Week 1, 2025",
    dateRange: "Jan 1 - Jan 5",
    reads: [
      {
        id: 8,
        title: "Year in Review: Web Development Trends",
        source: "stateofjs.com",
        url: "https://stateofjs.com",
        category: "Development",
        note: "Essential reading for understanding where the ecosystem is heading.",
      },
      {
        id: 9,
        title: "Effective Remote Work Strategies",
        source: "notion.so",
        url: "https://notion.so",
        category: "Productivity",
      },
    ],
  },
];

const categoryColors: Record<string, string> = {
  Development: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Design: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Productivity: "bg-green-500/10 text-green-400 border-green-500/20",
  Career: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function ReadsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      {/* Header */}
      <FadeIn>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          Weekly Reads
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mb-16 leading-relaxed">
          A curated collection of articles, essays, and resources I find
          interesting each week. Covering development, design, productivity, and more.
        </p>
      </FadeIn>

      {/* Weekly Sections */}
      <div className="space-y-16">
        {weeklyReads.map((week, weekIndex) => (
          <section key={week.week}>
            <FadeIn delay={weekIndex * 0.1}>
              <div className="flex items-baseline gap-4 mb-6">
                <h2 className="text-xl font-semibold">{week.week}</h2>
                <span className="text-sm text-[var(--text-muted)] font-mono">
                  {week.dateRange}
                </span>
              </div>
            </FadeIn>

            <StaggerChildren className="grid gap-4">
              {week.reads.map((read) => (
                <StaggerItem key={read.id}>
                  <motion.a
                    href={read.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-5 rounded-xl bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] hover:border-[var(--border)] transition-colors"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded border ${
                              categoryColors[read.category] ||
                              "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border)]"
                            }`}
                          >
                            {read.category}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] font-mono">
                            {read.source}
                          </span>
                        </div>
                        <h3 className="text-base font-medium group-hover:text-[var(--text-primary)] transition-colors mb-1">
                          {read.title}
                        </h3>
                        {read.note && (
                          <p className="text-sm text-[var(--text-muted)] mt-2">
                            &ldquo;{read.note}&rdquo;
                          </p>
                        )}
                      </div>
                      <svg
                        className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors shrink-0 mt-1"
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
                  </motion.a>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        ))}
      </div>
    </div>
  );
}
