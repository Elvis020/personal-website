"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren, { StaggerItem } from "@/components/animations/StaggerChildren";

const projects = [
  {
    id: 1,
    title: "Project One",
    description:
      "A comprehensive web application that solves a real problem. Built with modern technologies and best practices for performance and accessibility.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    link: "https://github.com",
    demo: "https://demo.com",
    featured: true,
  },
  {
    id: 2,
    title: "Project Two",
    description:
      "An innovative tool that streamlines workflow and increases productivity. Features a clean UI and robust backend.",
    tags: ["React", "Node.js", "GraphQL", "Redis"],
    link: "https://github.com",
    demo: "https://demo.com",
    featured: true,
  },
  {
    id: 3,
    title: "Project Three",
    description:
      "A creative experiment exploring new technologies and design patterns. Built for learning and sharing with the community.",
    tags: ["Python", "FastAPI", "Machine Learning"],
    link: "https://github.com",
    featured: false,
  },
  {
    id: 4,
    title: "Project Four",
    description:
      "An open source contribution to improve developer experience. Focused on documentation and API design.",
    tags: ["TypeScript", "Documentation", "CLI"],
    link: "https://github.com",
    featured: false,
  },
  {
    id: 5,
    title: "Project Five",
    description:
      "A mobile-first web application with offline support and progressive enhancement.",
    tags: ["PWA", "Service Workers", "IndexedDB"],
    link: "https://github.com",
    featured: false,
  },
  {
    id: 6,
    title: "Project Six",
    description:
      "An automation tool that saves hours of manual work. Built with reliability and scalability in mind.",
    tags: ["Go", "Docker", "Kubernetes"],
    link: "https://github.com",
    featured: false,
  },
];

export default function ProjectsPage() {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      {/* Header */}
      <FadeIn>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          Projects
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mb-16 leading-relaxed">
          A collection of projects I&apos;ve worked on. From full-stack applications
          to open source contributions, each project represents a learning journey.
        </p>
      </FadeIn>

      {/* Featured Projects */}
      <section className="mb-20">
        <FadeIn>
          <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-8">
            Featured
          </h2>
        </FadeIn>

        <StaggerChildren className="grid md:grid-cols-2 gap-6">
          {featuredProjects.map((project) => (
            <StaggerItem key={project.id}>
              <motion.article
                className="group p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors h-full flex flex-col"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <h3 className="text-xl font-medium mb-3">{project.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4 flex-grow">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-dashed border-[var(--border)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Code
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
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
                      Demo
                    </a>
                  )}
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* Other Projects */}
      <section>
        <FadeIn>
          <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-8">
            Other Projects
          </h2>
        </FadeIn>

        <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherProjects.map((project) => (
            <StaggerItem key={project.id}>
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-5 rounded-lg bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] hover:border-[var(--border)] transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <svg
                    className="w-5 h-5 text-[var(--text-muted)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
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
                <h3 className="text-sm font-medium mb-2 group-hover:text-[var(--text-primary)] transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.a>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>
    </div>
  );
}
