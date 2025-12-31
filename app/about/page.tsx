"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren, { StaggerItem } from "@/components/animations/StaggerChildren";

const skills = [
  { category: "Languages", items: ["TypeScript", "JavaScript", "Python", "Go"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "PostgreSQL", "Redis", "GraphQL"] },
  { category: "Tools", items: ["Git", "Docker", "AWS", "Vercel"] },
];

const experience = [
  {
    role: "Software Engineer",
    company: "Company Name",
    period: "2023 - Present",
    description: "Building scalable web applications and leading frontend architecture.",
  },
  {
    role: "Developer",
    company: "Previous Company",
    period: "2021 - 2023",
    description: "Full-stack development with focus on React and Node.js ecosystems.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      {/* Header */}
      <FadeIn>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          About Me
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mb-16 leading-relaxed">
          I&apos;m a developer passionate about building beautiful, functional, and
          accessible web experiences. I believe in the power of clean code and
          thoughtful design.
        </p>
      </FadeIn>

      {/* Bio Section */}
      <section className="mb-20">
        <FadeIn>
          <h2 className="text-2xl font-semibold mb-8">Background</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              I started my journey in tech with a curiosity for how things work.
              That curiosity led me to explore programming, design, and everything
              in between. Today, I specialize in building modern web applications
              that prioritize user experience and performance.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              When I&apos;m not coding, you can find me reading about emerging
              technologies, contributing to open source, or exploring new ideas
              through side projects. I believe in continuous learning and sharing
              knowledge with the community.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Skills Section */}
      <section className="mb-20">
        <FadeIn>
          <h2 className="text-2xl font-semibold mb-8">Skills</h2>
        </FadeIn>
        <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skillGroup) => (
            <StaggerItem key={skillGroup.category}>
              <div className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">
                  {skillGroup.category}
                </h3>
                <ul className="space-y-2">
                  {skillGroup.items.map((skill) => (
                    <li
                      key={skill}
                      className="text-sm text-[var(--text-primary)] flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* Experience Section */}
      <section className="mb-20">
        <FadeIn>
          <h2 className="text-2xl font-semibold mb-8">Experience</h2>
        </FadeIn>
        <StaggerChildren className="space-y-6">
          {experience.map((exp, index) => (
            <StaggerItem key={index}>
              <motion.div
                className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--bg-tertiary)]"
                whileHover={{ borderColor: "var(--border)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-lg font-medium">{exp.role}</h3>
                  <span className="text-sm text-[var(--text-muted)] font-mono">
                    {exp.period}
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] text-sm mb-2">{exp.company}</p>
                <p className="text-[var(--text-muted)] text-sm">{exp.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* Contact CTA */}
      <section>
        <FadeIn>
          <div className="p-8 rounded-xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border)] text-center">
            <h2 className="text-2xl font-semibold mb-4">Let&apos;s Connect</h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              I&apos;m always open to discussing new projects, creative ideas, or
              opportunities to be part of something great.
            </p>
            <motion.a
              href="mailto:hello@example.com"
              className="group relative inline-block px-6 py-3 text-sm font-medium rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <span className="absolute inset-0 bg-[var(--text-primary)]" />
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative text-[var(--bg-primary)]">Get in Touch</span>
            </motion.a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
