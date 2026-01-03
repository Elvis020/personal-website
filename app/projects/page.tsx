"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren, { StaggerItem } from "@/components/animations/StaggerChildren";
import { getAllProjects } from "@/lib/projects";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="max-w-4xl mx-auto px-6 mobile-content-top pb-12">
      {/* Header */}
      <FadeIn>
        <h1 className="text-3xl md:text-4xl tracking-tight mb-4">
          Projects
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="text-base text-[var(--text-secondary)] max-w-xl mb-12 leading-relaxed">
          A collection of work showcasing web development, design, and creative problem-solving.
        </p>
      </FadeIn>

      {/* Minimal Project List */}
      <StaggerChildren className="space-y-8">
        {projects.map((project) => (
          <StaggerItem key={project.id}>
            <motion.article
              className="group"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <a
                href={project.demo || project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {/* Project header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-medium group-hover:text-[var(--text-primary)] transition-colors">
                        {project.title}
                      </h3>
                      <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  {project.year && (
                    <span className="text-xs text-[var(--text-muted)] font-mono flex-shrink-0">
                      {project.year}
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 text-[var(--text-muted)] border border-[var(--border)] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className="mt-6 h-px bg-[var(--border)]" />
              </a>
            </motion.article>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </div>
  );
}
