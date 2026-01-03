"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import {
  weeklyReads,
  getCategories,
  getCategoryCount,
  getTotalReads,
  type WeeklyReads,
} from "@/lib/reads";

const INITIAL_WEEKS = 4;
const LOAD_INCREMENT = 4;

// Icons
const ExternalIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors shrink-0"
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
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19 9l-7 7-7-7"
    />
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
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
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
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
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
          <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
            {week.week}
          </span>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            {week.dateRange}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-muted)] tabular-nums">
            {filteredReads.length}{" "}
            {filteredReads.length === 1 ? "read" : "reads"}
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
                        <span className="text-xs text-[var(--text-muted)] font-mono">
                          {read.source}
                        </span>
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

  const categories = useMemo(() => getCategories(), []);
  const totalReads = getTotalReads();

  const filteredWeeklyReads = activeCategory
    ? weeklyReads.filter((week) =>
        week.reads.some((r) => r.category === activeCategory),
      )
    : weeklyReads;

  const displayedWeeks = filteredWeeklyReads.slice(0, visibleWeeks);
  const totalFilteredWeeks = filteredWeeklyReads.length;

  const canShowLess = visibleWeeks > INITIAL_WEEKS;
  const canLoadMore = visibleWeeks < totalFilteredWeeks;

  const handleShowLess = () => {
    setVisibleWeeks(Math.max(INITIAL_WEEKS, visibleWeeks - LOAD_INCREMENT));
  };

  const handleLoadMore = () => {
    setVisibleWeeks(
      Math.min(totalFilteredWeeks, visibleWeeks + LOAD_INCREMENT),
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-6 mobile-content-top pb-12">
      {/* Header */}
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl tracking-tight mb-3">
            Weekly Reads
          </h1>
          <p className="text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            A curated collection of articles, essays, and resources I find
            interesting each week.
          </p>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1}>
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[var(--border)] text-sm text-[var(--text-muted)]">
          <span className="font-mono">
            <span className="text-[var(--text-primary)] font-medium">
              {totalReads}
            </span>{" "}
            reads
          </span>
          <span className="font-mono">
            <span className="text-[var(--text-primary)] font-medium">
              {weeklyReads.length}
            </span>{" "}
            weeks
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
                  setActiveCategory(
                    category === activeCategory ? null : category,
                  );
                  setVisibleWeeks(INITIAL_WEEKS);
                  setOpenWeek(null);
                }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  activeCategory === category
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
                    : "bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-muted)]"
                }`}
              >
                {category} ({getCategoryCount(category)})
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
                  onToggle={() =>
                    setOpenWeek(openWeek === week.week ? null : week.week)
                  }
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
