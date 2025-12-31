"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FadeIn from "../animations/FadeIn";
import StaggerChildren, { StaggerItem } from "../animations/StaggerChildren";

// Placeholder projects - these will be replaced with real data
const projects = [
  {
    id: 1,
    title: "Project One",
    description: "A brief description of what this project does and the technologies used.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    link: "/projects/project-one",
  },
  {
    id: 2,
    title: "Project Two",
    description: "Another amazing project showcasing different skills and capabilities.",
    tags: ["React", "Node.js", "PostgreSQL"],
    link: "/projects/project-two",
  },
  {
    id: 3,
    title: "Project Three",
    description: "Something creative and innovative that solves a real problem.",
    tags: ["Python", "ML", "FastAPI"],
    link: "/projects/project-three",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-semibold tracking-tight">
              Featured Projects
            </h2>
            <Link
              href="/projects"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              View all →
            </Link>
          </div>
        </FadeIn>

        <StaggerChildren className="grid md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <motion.article
                className="group relative p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Link href={project.link} className="block">
                  <h3 className="text-lg font-medium mb-2 group-hover:text-[var(--text-primary)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-dashed border-[var(--border)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
