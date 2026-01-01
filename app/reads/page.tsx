"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

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

// Placeholder data
const weeklyReads: WeeklyReads[] = [
  {
    week: "Week 3, 2025",
    dateRange: "Jan 13 - Jan 19",
    reads: [
      { id: 1, title: "The Future of React Server Components", source: "react.dev", url: "https://react.dev", category: "Development", note: "Great deep dive into how RSC works under the hood." },
      { id: 2, title: "Designing for Accessibility: A Practical Guide", source: "a11yproject.com", url: "https://a11yproject.com", category: "Design" },
      { id: 3, title: "How to Build a Second Brain", source: "fortelabs.com", url: "https://fortelabs.com", category: "Productivity", note: "Changed how I think about note-taking." },
    ],
  },
  {
    week: "Week 2, 2025",
    dateRange: "Jan 6 - Jan 12",
    reads: [
      { id: 4, title: "Modern CSS in 2025", source: "css-tricks.com", url: "https://css-tricks.com", category: "Development" },
      { id: 5, title: "The Psychology of Design", source: "nngroup.com", url: "https://nngroup.com", category: "Design" },
      { id: 6, title: "Building in Public: Lessons Learned", source: "medium.com", url: "https://medium.com", category: "Career" },
      { id: 7, title: "Understanding WebAssembly", source: "webassembly.org", url: "https://webassembly.org", category: "Development" },
    ],
  },
  {
    week: "Week 1, 2025",
    dateRange: "Jan 1 - Jan 5",
    reads: [
      { id: 8, title: "Year in Review: Web Development Trends", source: "stateofjs.com", url: "https://stateofjs.com", category: "Development", note: "Essential reading for understanding where the ecosystem is heading." },
      { id: 9, title: "Effective Remote Work Strategies", source: "notion.so", url: "https://notion.so", category: "Productivity" },
    ],
  },
  {
    week: "Week 52, 2024",
    dateRange: "Dec 23 - Dec 29",
    reads: [
      { id: 10, title: "Reflecting on a Year of Coding", source: "dev.to", url: "https://dev.to", category: "Career", note: "Great retrospective format I want to adopt." },
      { id: 11, title: "The Art of Minimalist Design", source: "smashingmagazine.com", url: "https://smashingmagazine.com", category: "Design" },
    ],
  },
  {
    week: "Week 51, 2024",
    dateRange: "Dec 16 - Dec 22",
    reads: [
      { id: 12, title: "Edge Computing: The Next Frontier", source: "vercel.com", url: "https://vercel.com", category: "Development" },
      { id: 13, title: "Mental Models for Designers", source: "designsystems.com", url: "https://designsystems.com", category: "Design", note: "Useful frameworks for thinking about user behavior." },
      { id: 14, title: "Time Blocking for Deep Work", source: "calnewport.com", url: "https://calnewport.com", category: "Productivity" },
    ],
  },
  {
    week: "Week 50, 2024",
    dateRange: "Dec 9 - Dec 15",
    reads: [
      { id: 15, title: "TypeScript 5.4 Features You Should Know", source: "typescript.com", url: "https://typescript.com", category: "Development" },
      { id: 16, title: "Color Theory for Digital Products", source: "uxdesign.cc", url: "https://uxdesign.cc", category: "Design" },
      { id: 17, title: "Negotiating Your Tech Salary", source: "levels.fyi", url: "https://levels.fyi", category: "Career" },
      { id: 18, title: "Introduction to Deno 2.0", source: "deno.land", url: "https://deno.land", category: "Development" },
    ],
  },
  {
    week: "Week 49, 2024",
    dateRange: "Dec 2 - Dec 8",
    reads: [
      { id: 19, title: "Building a Personal Knowledge Base", source: "obsidian.md", url: "https://obsidian.md", category: "Productivity", note: "Finally convinced me to switch from Notion." },
      { id: 20, title: "Animation Performance on the Web", source: "web.dev", url: "https://web.dev", category: "Development" },
    ],
  },
  {
    week: "Week 48, 2024",
    dateRange: "Nov 25 - Dec 1",
    reads: [
      { id: 21, title: "The State of JavaScript 2024", source: "stateofjs.com", url: "https://stateofjs.com", category: "Development", note: "Fascinating to see the ecosystem evolution." },
      { id: 22, title: "Micro-interactions That Delight", source: "awwwards.com", url: "https://awwwards.com", category: "Design" },
      { id: 23, title: "Writing Technical Documentation", source: "writethedocs.org", url: "https://writethedocs.org", category: "Career" },
    ],
  },
  {
    week: "Week 47, 2024",
    dateRange: "Nov 18 - Nov 24",
    reads: [
      { id: 24, title: "Rust for JavaScript Developers", source: "rust-lang.org", url: "https://rust-lang.org", category: "Development" },
      { id: 25, title: "The Power of Design Tokens", source: "designtokens.org", url: "https://designtokens.org", category: "Design" },
      { id: 26, title: "Atomic Habits for Programmers", source: "jamesclear.com", url: "https://jamesclear.com", category: "Productivity", note: "Applied the 2-minute rule to my coding practice." },
      { id: 27, title: "GraphQL vs REST in 2024", source: "apollographql.com", url: "https://apollographql.com", category: "Development" },
    ],
  },
  {
    week: "Week 46, 2024",
    dateRange: "Nov 11 - Nov 17",
    reads: [
      { id: 28, title: "Tailwind CSS Best Practices", source: "tailwindcss.com", url: "https://tailwindcss.com", category: "Development" },
      { id: 29, title: "Building a Personal Brand as a Developer", source: "hashnode.com", url: "https://hashnode.com", category: "Career" },
    ],
  },
  {
    week: "Week 45, 2024",
    dateRange: "Nov 4 - Nov 10",
    reads: [
      { id: 30, title: "Next.js 15 Deep Dive", source: "nextjs.org", url: "https://nextjs.org", category: "Development", note: "The new caching defaults are a game changer." },
      { id: 31, title: "Gestalt Principles in UI Design", source: "interaction-design.org", url: "https://interaction-design.org", category: "Design" },
      { id: 32, title: "Debugging Like a Pro", source: "kentcdodds.com", url: "https://kentcdodds.com", category: "Development" },
    ],
  },
  {
    week: "Week 44, 2024",
    dateRange: "Oct 28 - Nov 3",
    reads: [
      { id: 33, title: "AI-Assisted Coding: Best Practices", source: "github.com", url: "https://github.com", category: "Development" },
      { id: 34, title: "The Pomodoro Technique Revisited", source: "todoist.com", url: "https://todoist.com", category: "Productivity" },
      { id: 35, title: "Dark Mode Design Patterns", source: "material.io", url: "https://material.io", category: "Design" },
      { id: 36, title: "Contributing to Open Source", source: "opensource.guide", url: "https://opensource.guide", category: "Career", note: "Finally made my first significant OSS contribution." },
    ],
  },
  {
    week: "Week 43, 2024",
    dateRange: "Oct 21 - Oct 27",
    reads: [
      { id: 37, title: "Server Actions in Next.js", source: "nextjs.org", url: "https://nextjs.org", category: "Development" },
      { id: 38, title: "Typography Fundamentals", source: "typewolf.com", url: "https://typewolf.com", category: "Design", note: "The font pairing suggestions are gold." },
    ],
  },
  {
    week: "Week 42, 2024",
    dateRange: "Oct 14 - Oct 20",
    reads: [
      { id: 39, title: "Database Design Patterns", source: "planetscale.com", url: "https://planetscale.com", category: "Development" },
      { id: 40, title: "The Art of Code Review", source: "google.github.io", url: "https://google.github.io", category: "Development" },
      { id: 41, title: "Freelancing vs Full-Time", source: "freelancer.com", url: "https://freelancer.com", category: "Career" },
      { id: 42, title: "Motion Design Principles", source: "framer.com", url: "https://framer.com", category: "Design" },
    ],
  },
  {
    week: "Week 41, 2024",
    dateRange: "Oct 7 - Oct 13",
    reads: [
      { id: 43, title: "Bun 1.0: A New JavaScript Runtime", source: "bun.sh", url: "https://bun.sh", category: "Development", note: "The speed improvements are incredible." },
      { id: 44, title: "Getting Things Done for Developers", source: "gettingthingsdone.com", url: "https://gettingthingsdone.com", category: "Productivity" },
      { id: 45, title: "Responsive Design in 2024", source: "css-tricks.com", url: "https://css-tricks.com", category: "Design" },
    ],
  },
  {
    week: "Week 40, 2024",
    dateRange: "Sep 30 - Oct 6",
    reads: [
      { id: 46, title: "Introduction to Astro", source: "astro.build", url: "https://astro.build", category: "Development" },
      { id: 47, title: "The Manager's Path for ICs", source: "oreilly.com", url: "https://oreilly.com", category: "Career", note: "Even as an IC, understanding management helps." },
      { id: 48, title: "Whitespace in Web Design", source: "uxplanet.org", url: "https://uxplanet.org", category: "Design" },
      { id: 49, title: "Testing React Applications", source: "testing-library.com", url: "https://testing-library.com", category: "Development" },
      { id: 50, title: "Weekly Review Systems", source: "bulletjournal.com", url: "https://bulletjournal.com", category: "Productivity" },
    ],
  },
];

const INITIAL_WEEKS = 4;
const LOAD_INCREMENT = 4;

// Utilities
function getCategories(weeks: WeeklyReads[]): string[] {
  const categories = new Set<string>();
  weeks.forEach((week) => week.reads.forEach((read) => categories.add(read.category)));
  return Array.from(categories).sort();
}

// Icons
const ExternalIcon = () => (
  <svg className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <motion.svg
    className="w-4 h-4 text-[var(--text-muted)]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    animate={{ rotate: isOpen ? 180 : 0 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
  </motion.svg>
);

// ============================================
// ARCHIVE DEPTH CONTROL
// ============================================
function ArchiveDepthControl({
  visible,
  total,
  canShowLess,
  canLoadMore,
  onShowLess,
  onLoadMore,
}: {
  visible: number;
  total: number;
  canShowLess: boolean;
  canLoadMore: boolean;
  onShowLess: () => void;
  onLoadMore: () => void;
}) {
  return (
    <div className="py-8">
      {/* Controls row */}
      <div className="flex items-center justify-between">
          {/* Show Less */}
          <button
            onClick={onShowLess}
            disabled={!canShowLess}
            className={`group flex items-center gap-2 text-xs transition-all ${
              canShowLess
                ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                : "text-[var(--text-muted)]/40 cursor-not-allowed"
            }`}
          >
            <motion.span
              className="flex items-center justify-center w-6 h-6 rounded-full border border-current"
              whileHover={canShowLess ? { scale: 1.1 } : {}}
              whileTap={canShowLess ? { scale: 0.95 } : {}}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </motion.span>
            <span className="hidden sm:inline">Collapse</span>
          </button>

          {/* Center status */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs text-[var(--text-muted)] font-mono tracking-wide">
              <motion.span
                key={visible}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block text-[var(--text-primary)] font-medium"
              >
                {visible}
              </motion.span>
              <span className="mx-1 text-[var(--text-muted)]/50">/</span>
              <span>{total}</span>
              <span className="ml-1.5 text-[var(--text-muted)]">weeks</span>
            </div>
            <div className="text-[10px] text-[var(--text-muted)]/60 uppercase tracking-widest">
              Archive Depth
            </div>
          </div>

          {/* Load More */}
          <button
            onClick={onLoadMore}
            disabled={!canLoadMore}
            className={`group flex items-center gap-2 text-xs transition-all ${
              canLoadMore
                ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                : "text-[var(--text-muted)]/40 cursor-not-allowed"
            }`}
          >
            <span className="hidden sm:inline">Dig Deeper</span>
            <motion.span
              className="flex items-center justify-center w-6 h-6 rounded-full border border-current"
              whileHover={canLoadMore ? { scale: 1.1 } : {}}
              whileTap={canLoadMore ? { scale: 0.95 } : {}}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.span>
          </button>
        </div>
    </div>
  );
}

// ============================================
// COLLAPSIBLE WEEK SECTION
// ============================================
function CollapsibleWeek({
  week,
  activeCategory,
  isOpen,
  onToggle,
}: {
  week: WeeklyReads;
  activeCategory: string | null;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const filteredReads = activeCategory
    ? week.reads.filter((r) => r.category === activeCategory)
    : week.reads;

  if (filteredReads.length === 0) return null;

  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      {/* Week Header - Clickable */}
      <button
        onClick={onToggle}
        className="w-full group py-3 flex items-center justify-between hover:bg-[var(--bg-secondary)]/30 transition-colors -mx-2 px-2 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{week.week}</span>
          <span className="text-xs text-[var(--text-muted)] font-mono">{week.dateRange}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-muted)] tabular-nums">
            {filteredReads.length} {filteredReads.length === 1 ? "read" : "reads"}
          </span>
          <ChevronIcon isOpen={isOpen} />
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-4 border-l-2 border-[var(--border)] ml-1 space-y-1">
              {filteredReads.map((read, index) => (
                <motion.a
                  key={read.id}
                  href={read.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors -ml-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                          {read.category}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] font-mono">{read.source}</span>
                      </div>
                      <h3 className="text-base font-medium group-hover:text-[var(--text-primary)] transition-colors leading-snug">
                        {read.title}
                      </h3>
                      {read.note && (
                        <p className="text-sm text-[var(--text-muted)] mt-2 italic">
                          &ldquo;{read.note}&rdquo;
                        </p>
                      )}
                    </div>
                    <ExternalIcon />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function ReadsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visibleWeeks, setVisibleWeeks] = useState(INITIAL_WEEKS);
  const [openWeek, setOpenWeek] = useState<string | null>(null);

  const categories = useMemo(() => getCategories(weeklyReads), []);
  const totalReads = weeklyReads.reduce((acc, week) => acc + week.reads.length, 0);
  const categoryCount = (category: string) =>
    weeklyReads.reduce((acc, week) => acc + week.reads.filter((r) => r.category === category).length, 0);

  const filteredWeeklyReads = activeCategory
    ? weeklyReads.filter((week) => week.reads.some((r) => r.category === activeCategory))
    : weeklyReads;

  const displayedWeeks = filteredWeeklyReads.slice(0, visibleWeeks);
  const totalFilteredWeeks = filteredWeeklyReads.length;

  const canShowLess = visibleWeeks > INITIAL_WEEKS;
  const canLoadMore = visibleWeeks < totalFilteredWeeks;

  const handleShowLess = () => {
    setVisibleWeeks(Math.max(INITIAL_WEEKS, visibleWeeks - LOAD_INCREMENT));
  };

  const handleLoadMore = () => {
    setVisibleWeeks(Math.min(totalFilteredWeeks, visibleWeeks + LOAD_INCREMENT));
  };

  return (
    <div className="max-w-3xl mx-auto px-6 mobile-content-top pb-12">
      {/* Header */}
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl tracking-tight mb-3">Weekly Reads</h1>
          <p className="text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            A curated collection of articles, essays, and resources I find interesting each week.
          </p>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1}>
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[var(--border)] text-sm text-[var(--text-muted)]">
          <span className="font-mono">
            <span className="text-[var(--text-primary)] font-medium">{totalReads}</span> reads
          </span>
          <span className="font-mono">
            <span className="text-[var(--text-primary)] font-medium">{weeklyReads.length}</span> weeks
          </span>
        </div>
      </FadeIn>

      {/* Category Filter */}
      <FadeIn delay={0.15}>
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveCategory(null);
                setVisibleWeeks(INITIAL_WEEKS);
                setOpenWeek(null);
              }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                activeCategory === null
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
                  : "bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-muted)]"
              }`}
            >
              All ({totalReads})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category === activeCategory ? null : category);
                  setVisibleWeeks(INITIAL_WEEKS);
                  setOpenWeek(null);
                }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  activeCategory === category
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
                    : "bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-muted)]"
                }`}
              >
                {category} ({categoryCount(category)})
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Weeks List */}
      <FadeIn delay={0.2}>
        <div>
          <AnimatePresence mode="popLayout">
            {displayedWeeks.map((week, index) => (
              <motion.div
                key={week.week}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, delay: index * 0.02 }}
              >
                <CollapsibleWeek
                  week={week}
                  activeCategory={activeCategory}
                  isOpen={openWeek === week.week}
                  onToggle={() => setOpenWeek(openWeek === week.week ? null : week.week)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {displayedWeeks.length === 0 && (
            <p className="text-[var(--text-muted)] text-center py-12">
              No reads found for this category.
            </p>
          )}
        </div>
      </FadeIn>

      {/* Archive Depth Control */}
      {totalFilteredWeeks > INITIAL_WEEKS && (
        <FadeIn delay={0.25}>
          <ArchiveDepthControl
            visible={Math.min(visibleWeeks, totalFilteredWeeks)}
            total={totalFilteredWeeks}
            canShowLess={canShowLess}
            canLoadMore={canLoadMore}
            onShowLess={handleShowLess}
            onLoadMore={handleLoadMore}
          />
        </FadeIn>
      )}
    </div>
  );
}
