// Shared projects data - edit this file to add/update projects

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  link: string;
  demo?: string;
  year?: string;
  status?: "Live" | "In Progress" | "Archived";
}

// ============================================
// ADD YOUR PROJECTS HERE
// ============================================
export const projects: Project[] = [
  {
    id: 1,
    title: "We-Oudy",
    description:
      "An event discovery platform for Accra, Ghana. Discover cultural festivals, concerts, art exhibitions, nightlife, and community gatherings happening in your city.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/projects/we-oudy.png",
    demo: "https://we-oudy.com",
    link: "https://we-oudy.com",
    year: "2025",
    status: "Live",
  },
  {
    id: 2,
    title: "GIF Stasher",
    description:
      "Your meme arsenal. A personal media management tool to save and organize Twitter/X GIFs. Built for curating and storing your favorite animated content from social media.",
    tags: ["Next.js", "React", "React Query", "TypeScript"],
    image: "/projects/gif-stasher.png",
    demo: "https://gif-stasher.vercel.app/",
    link: "https://gif-stasher.vercel.app/",
    year: "2025",
    status: "Live",
  },
  {
    id: 3,
    title: "Kwame Obed",
    description:
      "Official website for Ghanaian comedian and performing artist Kwame Obed, winner of Next Rated Comedy Star at Ghana Comedy Awards 2025. Features comedy clips, show bookings, and social media integration to connect fans with authentic Ghanaian humor.",
    tags: ["Next.js", "TypeScript", "SEO", "Entertainment"],
    image: "/projects/kwameobed.png",
    demo: "https://kwameobed.com",
    link: "https://kwameobed.com",
    year: "2025",
    status: "Live",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all projects sorted by year (newest first)
 */
export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => {
    const yearA = parseInt(a.year || "0");
    const yearB = parseInt(b.year || "0");
    return yearB - yearA; // Descending order (newest first)
  });
}

/**
 * Get all unique tags from projects
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  projects.forEach((project) => project.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

/**
 * Get project by ID
 */
export function getProjectById(id: number): Project | undefined {
  return projects.find((p) => p.id === id);
}

/**
 * Filter projects by tag
 */
export function getProjectsByTag(tag: string): Project[] {
  return projects.filter((p) => p.tags.includes(tag));
}
