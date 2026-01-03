"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren, { StaggerItem } from "@/components/animations/StaggerChildren";

const experience = [
  {
    role: "Software Engineer III",
    company: "turntabl",
    period: "Dec 2024 - Present",
    description: "Leading development of critical systems including payroll and attendance monitoring platforms. Mentoring junior developers, conducting code reviews, and driving technical excellence across teams.",
  },
  {
    role: "Software Engineer II",
    company: "turntabl",
    period: "Dec 2022 - Dec 2024",
    description: "Architected and delivered full-stack solutions using Spring Boot, React, and PostgreSQL. Collaborated with cross-functional teams to build scalable, production-ready applications.",
  },
  {
    role: "Python Tutor",
    company: "Global Code Programme, turntabl",
    period: "Aug 2022 - Present",
    description: "Teaching Python programming fundamentals and advanced concepts including Flask APIs and MQTT protocols. Mentoring students through project ideation, development, and presentation.",
  },
  {
    role: "Junior Software Engineer",
    company: "turntabl",
    period: "Jan 2021 - Dec 2022",
    description: "Began software engineering career working remotely for Morgan Stanley as a contingent worker. Mastered Scala, built Spring Boot microservices, and contributed to backend systems maintenance.",
  },
  {
    role: "Web Developer",
    company: "Code Coast Training Center (Ghana Tech Lab)",
    period: "Jun 2020 - Sep 2020",
    description: "Completed intensive 3-month full-stack bootcamp. Built backend microservices in Node.js and Python, created React frontends, and led UI/UX design for a food delivery app.",
  },
  {
    role: "Teaching Assistant (Physics)",
    company: "University of Cape Coast",
    period: "Sep 2019 - Aug 2020",
    description: "Assisted in evaluating student progress, supervised physics lab work, and tutored students individually and in small groups on complex physics concepts.",
  },
];

const currently = {
  reading: "Designing Data-Intensive Applications",
};

const skillsRow1 = ["Java", "Python", "Scala", "TypeScript", "JavaScript", "Spring Boot", "React", "NextJS"];
const skillsRow2 = ["PostgreSQL", "MongoDB", "Docker", "Kubernetes", "AWS", "Svelte", "HTML/CSS", "Git"];

interface SpotifyData {
  isPlaying: boolean;
  title: string | null;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

// Spotify Now Playing Component
function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpotify() {
      try {
        const res = await fetch("/api/spotify");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch Spotify data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpotify();
    // Refresh every 30 seconds
    const interval = setInterval(fetchSpotify, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <motion.div
        className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] animate-pulse" />
          <div className="flex-1">
            <div className="h-3 w-16 bg-[var(--bg-tertiary)] rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-[var(--bg-tertiary)] rounded animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Fallback if no Spotify data or not configured
  if (!data || !data.title) {
    return (
      <motion.div
        className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]"
        whileHover={{ scale: 1.02, borderColor: "var(--text-muted)" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-lg">
            🎧
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Listening
            </p>
            <p className="text-[var(--text-primary)] font-medium">Not playing</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]"
      whileHover={{ scale: 1.02, borderColor: "var(--text-muted)" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-start gap-4">
        {data.albumImageUrl ? (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={data.albumImageUrl}
              alt={data.album || "Album art"}
              fill
              className="object-cover"
            />
            {data.isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="flex gap-0.5 items-end h-3">
                  <span className="w-0.5 bg-green-500 animate-bounce" style={{ height: '8px', animationDelay: '0ms' }} />
                  <span className="w-0.5 bg-green-500 animate-bounce" style={{ height: '12px', animationDelay: '150ms' }} />
                  <span className="w-0.5 bg-green-500 animate-bounce" style={{ height: '6px', animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-lg flex-shrink-0">
            🎧
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1 flex items-center gap-2">
            {data.isPlaying ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Now Playing
              </>
            ) : (
              "Recently Played"
            )}
          </p>
          <p className="text-[var(--text-primary)] font-medium truncate">{data.title}</p>
          <p className="text-[var(--text-secondary)] text-sm truncate">{data.artist}</p>
        </div>
      </div>
    </motion.a>
  );
}

// Currently Section - Reading & Listening (Spotify)
function CurrentlySection() {
  return (
    <section className="mb-20">
      <FadeIn>
        <h2 className="text-2xl mb-8">Currently</h2>
      </FadeIn>
      <StaggerChildren className="grid md:grid-cols-2 gap-4">
        <StaggerItem>
          <motion.div
            className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]"
            whileHover={{ scale: 1.02, borderColor: "var(--text-muted)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-lg">
                📚
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Reading
                </p>
                <p className="text-[var(--text-primary)] font-medium">{currently.reading}</p>
              </div>
            </div>
          </motion.div>
        </StaggerItem>
        <StaggerItem>
          <SpotifyNowPlaying />
        </StaggerItem>
      </StaggerChildren>
    </section>
  );
}

// Marquee Skills Section
function SkillsMarquee() {
  return (
    <section className="mb-20">
      <FadeIn>
        <h2 className="text-2xl mb-8">Skills</h2>
      </FadeIn>
      <div className="space-y-4 overflow-hidden">
        {/* Row 1 - scrolls left */}
        <div className="relative">
          <div className="flex animate-marquee">
            {[...skillsRow1, ...skillsRow1].map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="flex-shrink-0 px-4 py-2 mx-2 text-sm rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 - scrolls right */}
        <div className="relative">
          <div className="flex animate-marquee-reverse">
            {[...skillsRow2, ...skillsRow2].map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="flex-shrink-0 px-4 py-2 mx-2 text-sm rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Timeline Experience Section
function TimelineExperience() {
  return (
    <section className="mb-20">
      <FadeIn>
        <h2 className="text-2xl mb-8">Experience</h2>
      </FadeIn>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[var(--text-muted)] via-[var(--border)] to-transparent" />

        <StaggerChildren className="space-y-8">
          {experience.map((exp, index) => (
            <StaggerItem key={index}>
              <div className="relative pl-8">
                {/* Dot on timeline */}
                <motion.div
                  className="absolute left-0 top-2 w-4 h-4 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--text-muted)]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                />

                <motion.div
                  className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]"
                  whileHover={{ x: 4, borderColor: "var(--text-muted)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-lg font-medium">{exp.role}</h3>
                    <span className="text-sm text-[var(--text-muted)] font-mono">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-[var(--accent)] text-sm mb-2">{exp.company}</p>
                  <p className="text-[var(--text-secondary)] text-sm">{exp.description}</p>
                </motion.div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 mobile-content-top pb-8">
      {/* Header */}
      <FadeIn>
        <h1 className="text-4xl md:text-5xl tracking-tight mb-6">
          About Me
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mb-16 leading-relaxed">
          Software Engineer at turntabl, where I lead teams, architect scalable systems,
          and mentor the next generation of developers. From Engineering Physics to full-stack development,
          my journey has been driven by curiosity and a passion for solving complex problems.
        </p>
      </FadeIn>

      {/* Bio Section */}
      <section className="mb-20">
        <FadeIn>
          <h2 className="text-2xl mb-8">Background</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              My journey began with a BSc in Engineering Physics from the University of Cape Coast,
              where I developed a foundation in problem-solving and analytical thinking. After graduating,
              I worked as a Teaching Assistant in Physics, which sparked my passion for education—a passion
              I still pursue today as a Python tutor since 2022.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              The turning point came in 2020 when I enrolled in a 3-month intensive web development bootcamp
              at Code Coast Training Center (Ghana Tech Lab). There, I was introduced to the full-stack ecosystem—
              building backend microservices in Node.js and Python, creating frontends with React, and even leading
              UI/UX design for a food delivery app. That experience ignited my passion for software engineering and
              set me on a new path.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              In 2021, I joined turntabl as a Junior Software Engineer. Over four years, I&apos;ve grown from
              writing my first production code to leading critical projects like payroll systems and attendance
              monitoring platforms. Each promotion—from Junior to Engineer II to Software Engineer III—has been
              earned through delivering impact and helping others succeed.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Today, I architect full-stack solutions using Spring Boot, React, and NextJS, while also mentoring
              junior developers and conducting code reviews. Whether I&apos;m debugging a distributed system,
              teaching Python concepts, or exploring new technologies, I&apos;m driven by the belief that great
              software comes from continuous learning and knowledge sharing.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Currently - Reading & Listening (Spotify) */}
      <CurrentlySection />

      {/* Skills Marquee */}
      <SkillsMarquee />

      {/* Timeline Experience */}
      <TimelineExperience />

      {/* Contact CTA */}
      <section>
        <FadeIn>
          <div className="p-8 rounded-xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border)] text-center">
            <h2 className="text-2xl mb-4">Let&apos;s Connect</h2>
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
