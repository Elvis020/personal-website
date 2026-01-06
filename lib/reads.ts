// Shared reads data - edit this file to add new weekly reads

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
// ADD YOUR WEEKLY READS HERE
// ============================================
export const weeklyReads: WeeklyReads[] = [
  {
    week: "Week 1, 2026",
    dateRange: "Jan 1 - Jan 7",
    reads: [
      // Example format:
      {
        id: 1,
        title: "Logging sucks - And here's how to make it better",
        source: "boristane.com",
        url: "https://loggingsucks.com/",
        category: "Observability",
        note: "High-cardinality structured logging done right",
      },
      {
        id: 2,
        title: "Branded Types in TypeScript: From Structural to Nominal",
        source: "nanamanu.com",
        url: "https://nanamanu.com/posts/branded-types-typescript/",
        category: "TypeScript",
        note: "Branded types make TypeScript distinguish between structurally identical types at compile time.",
      },
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
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

  // Weeks are assumed to be in reverse chronological order (newest first)
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
