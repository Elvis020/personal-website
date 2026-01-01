"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// Blur reveal animation wrapper
function BlurReveal({
  children,
  delay = 0,
  baseDelay = 0
}: {
  children: React.ReactNode;
  delay?: number;
  baseDelay?: number;
}) {
  return (
    <motion.div
      initial={{ filter: "blur(10px)", opacity: 0 }}
      animate={{ filter: "blur(0px)", opacity: 1 }}
      transition={{ duration: 0.8, delay: baseDelay + delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  // Check if this is the first visit (loading screen is showing)
  // Use lazy initializer to read sessionStorage synchronously on first render
  const [baseDelay] = useState(() => {
    if (typeof window === "undefined") return 2.1;
    return sessionStorage.getItem("hasLoaded") ? 0 : 2.1;
  });

  return (
    <section className="min-h-[50vh] md:min-h-[60vh] flex items-center relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <div className="max-w-3xl">
          {/* Greeting */}
          <BlurReveal delay={0.1} baseDelay={baseDelay}>
            <p className="text-[var(--text-secondary)] text-lg mb-4 font-mono">Hi, I&apos;m</p>
          </BlurReveal>

          {/* Name */}
          <BlurReveal delay={0.2} baseDelay={baseDelay}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight mb-6">
              <span className="text-[var(--text-primary)]">Elvis O. Amoako</span>
            </h1>
          </BlurReveal>

          {/* Tagline */}
          <BlurReveal delay={0.4} baseDelay={baseDelay}>
            <p className="text-base md:text-xl lg:text-2xl text-[var(--text-secondary)] leading-relaxed mb-8 max-w-2xl">
              I build things for the web. Currently exploring the intersection
              of design, code, and emerging technologies.
            </p>
          </BlurReveal>

          {/* Status badge */}
          <BlurReveal delay={0.6} baseDelay={baseDelay}>
            <div className="flex items-center gap-3 text-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-[var(--text-secondary)]">
                Available for new opportunities
              </span>
            </div>
          </BlurReveal>

          {/* CTA Buttons */}
          <BlurReveal delay={0.8} baseDelay={baseDelay}>
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link href="/projects">
                <motion.div
                  className="group relative px-6 py-3 text-sm font-medium rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <span className="absolute inset-0 bg-[var(--text-primary)]" />
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative text-[var(--bg-primary)]">View Projects</span>
                </motion.div>
              </Link>
              <Link href="/blog">
                <motion.div
                  className="px-6 py-3 border border-[var(--border)] text-[var(--text-primary)] text-sm font-medium rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  Read Blog
                </motion.div>
              </Link>
            </div>
          </BlurReveal>
        </div>
      </div>

    </section>
  );
}
