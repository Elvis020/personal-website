"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FadeIn from "../animations/FadeIn";
import StaggerChildren, { StaggerItem } from "../animations/StaggerChildren";
import { getAllProjects } from "@/lib/projects";

export default function FeaturedProjects() {
  const projects = getAllProjects().slice(0, 3); // Show latest 3 on homepage

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header with subtle line */}
        <FadeIn>
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent" />
            <h2 className="text-lg md:text-2xl tracking-tight text-[var(--text-secondary)]">
              Projects
            </h2>
            <Link
              href="/projects"
              className="text-xs md:text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              View all →
            </Link>
          </div>
        </FadeIn>

        <StaggerChildren className="grid md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <StaggerItem key={project.id} className="h-full">
              <motion.article
                className="group relative h-full rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--text-primary)]/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <a
                  href={project.demo || project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col h-full p-5"
                >
                  <h3 className="text-lg font-medium mb-2 group-hover:text-[var(--text-primary)] transition-colors flex items-center gap-2">
                    {project.title}
                    <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-dashed border-[var(--border)]"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-xs px-2 py-1 text-[var(--text-muted)]">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </a>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
