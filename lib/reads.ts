// Shared reads data - edit this file to add new reads

// ============================================
// ADD YOUR READS HERE (just date + url minimum)
// ============================================
const readsData: ReadInput[] = [
  // Add newest first. Only date and url are required!
  // source is auto-extracted from url, other fields you fill in manually
  {
    date: "2026-01-05",
    url: "https://loggingsucks.com/",
    title: "Logging sucks - And here's how to make it better",
    category: "Observability",
    note: "High-cardinality structured logging done right",
  },
  {
    date: "2026-01-03",
    url: "https://nanamanu.com/posts/branded-types-typescript/",
    title: "Branded Types in TypeScript: From Structural to Nominal",
    category: "TypeScript",
    note: "Branded types make TypeScript distinguish between structurally identical types at compile time.",
  },
  {
    date: "2026-01-11",
    url: "https://cpu.land/",
    title: "Putting the “You” in CPU",
    category: "Kernel",
    note: "Curious exactly what happens when you run a program on your computer? Read this article to learn how multiprocessing works",
  },
];

// ============================================
// TYPES
// ============================================
export interface ReadInput {
  date: string; // Format: "YYYY-MM-DD"
  url: string;
  title: string;
  category: string;
  source?: string; // Auto-extracted from url if not provided
  note?: string;
}

export interface Read {
  id: number;
  title: string;
  source: string;
  url: string;
  category: string;
  note?: string;
}

export interface WeeklyReads {
  week: string;
  dateRange: string;
  reads: Read[];
}

// ============================================
// HELPER FUNCTIONS (internal)
// ============================================

/**
 * Extract domain from URL (e.g., "https://example.com/path" → "example.com")
 */
function extractSource(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Get week number and year from a date
 */
function getWeekFromDate(dateString: string): { week: number; year: number } {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear =
    Math.floor(
      (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
    ) + 1;
  const week = Math.ceil(dayOfYear / 7);
  return { week, year };
}

/**
 * Get current week number and year
 */
function getCurrentWeekAndYear(): { week: number; year: number } {
  const now = new Date();
  return getWeekFromDate(now.toISOString().split("T")[0]);
}

/**
 * Generate week label (e.g., "Week 1, 2026")
 */
function getWeekLabel(week: number, year: number): string {
  return `Week ${week}, ${year}`;
}

/**
 * Calculate date range for a week (e.g., "Jan 1 - Jan 7")
 */
function getDateRange(week: number, year: number): string {
  const startDayOfYear = (week - 1) * 7 + 1;
  const endDayOfYear = startDayOfYear + 6;

  const startDate = new Date(year, 0, startDayOfYear);
  const endDate = new Date(year, 0, endDayOfYear);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Check if a week is in the past or current
 */
function isWeekVisible(week: number, year: number): boolean {
  const current = getCurrentWeekAndYear();
  if (year < current.year) return true;
  if (year > current.year) return false;
  return week <= current.week;
}

// ============================================
// TRANSFORM DATA: Group reads into weeks
// ============================================
function groupReadsIntoWeeks(reads: ReadInput[]): WeeklyReads[] {
  const weekMap = new Map<
    string,
    { week: number; year: number; reads: Read[] }
  >();

  reads.forEach((read, index) => {
    const { week, year } = getWeekFromDate(read.date);
    const key = `${year}-${week}`;

    if (!weekMap.has(key)) {
      weekMap.set(key, { week, year, reads: [] });
    }

    weekMap.get(key)!.reads.push({
      id: index + 1,
      title: read.title,
      source: read.source || extractSource(read.url),
      url: read.url,
      category: read.category,
      note: read.note,
    });
  });

  // Convert to array, filter visible weeks, sort newest first
  return Array.from(weekMap.values())
    .filter(({ week, year }) => isWeekVisible(week, year))
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.week - a.week;
    })
    .map(({ week, year, reads }) => ({
      week: getWeekLabel(week, year),
      dateRange: getDateRange(week, year),
      reads,
    }));
}

// Export the grouped weekly reads
export const weeklyReads: WeeklyReads[] = groupReadsIntoWeeks(readsData);

// ============================================
// PUBLIC HELPER FUNCTIONS
// ============================================

/**
 * Get all unique categories from the reads
 */
export function getCategories(): string[] {
  const categories = new Set<string>();
  weeklyReads.forEach((week) =>
    week.reads.forEach((read) => categories.add(read.category)),
  );
  return Array.from(categories).sort();
}

/**
 * Get total number of reads across all weeks
 */
export function getTotalReads(): number {
  return weeklyReads.reduce((acc, week) => acc + week.reads.length, 0);
}

/**
 * Get the latest N reads across all weeks (most recent first)
 */
export function getLatestReads(count: number = 3): Read[] {
  const allReads: Read[] = [];

  for (const week of weeklyReads) {
    for (const read of week.reads) {
      allReads.push(read);
      if (allReads.length >= count) {
        return allReads;
      }
    }
  }

  return allReads;
}

/**
 * Count reads in a specific category
 */
export function getCategoryCount(category: string): number {
  return weeklyReads.reduce(
    (acc, week) =>
      acc + week.reads.filter((r) => r.category === category).length,
    0,
  );
}
