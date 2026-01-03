"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Blur reveal animation wrapper
function BlurReveal({
  children,
  delay = 0,
  baseDelay = 0,
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

// Typewriter: Classic typing effect with occasional mistakes
function useTypewriterScramble(finalText: string, baseDelay: number) {
  const [displayText, setDisplayText] = useState("");
  const chars = "abcdefghijklmnopqrstuvwxyz";

  useEffect(() => {
    let currentIndex = 0;
    const startDelay = (baseDelay + 0.2) * 1000;
    const mistakes: number[] = [];

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < finalText.length) {
          const char = finalText[currentIndex];

          // 15% chance to make a "mistake" on non-space characters
          if (
            char !== " " &&
            char !== "\n" &&
            Math.random() > 0.85 &&
            !mistakes.includes(currentIndex)
          ) {
            mistakes.push(currentIndex);
            const mistakeIndex = currentIndex; // Capture the index for closure
            setDisplayText(
              finalText.slice(0, currentIndex) +
                chars[Math.floor(Math.random() * chars.length)],
            );

            // Fix the mistake after a short delay
            setTimeout(() => {
              setDisplayText(finalText.slice(0, mistakeIndex + 1));
            }, 100);
          } else {
            setDisplayText(finalText.slice(0, currentIndex + 1));
          }

          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 80);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [finalText, baseDelay]);

  return displayText;
}

export default function Hero() {
  // Check if this is the first visit (loading screen is showing)
  const [baseDelay] = useState(() => {
    if (typeof window === "undefined") return 2.1;
    return sessionStorage.getItem("hasLoaded") ? 0 : 2.1;
  });

  const scrambledName = useTypewriterScramble("Elvis O. Amoako", baseDelay);

  return (
    <section className="min-h-[70vh] md:min-h-[80vh] flex items-center relative overflow-hidden z-20">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <BlurReveal delay={0.1} baseDelay={baseDelay}>
              <p className="text-sm font-mono text-[var(--text-muted)] mb-4 tracking-widest uppercase">
                Software Engineer
              </p>
            </BlurReveal>

            <BlurReveal delay={0.2} baseDelay={baseDelay}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-[var(--text-primary)] font-mono">
                {scrambledName}
              </h1>
            </BlurReveal>

            <BlurReveal delay={0.4} baseDelay={baseDelay}>
              <div className="h-1 w-20 bg-[var(--text-primary)] mb-8" />
            </BlurReveal>

            <BlurReveal delay={0.6} baseDelay={baseDelay}>
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm text-[var(--text-secondary)]">
                  Open to opportunities
                </span>
              </div>
            </BlurReveal>
          </div>

          {/* Right Column */}
          <div>
            <BlurReveal delay={0.5} baseDelay={baseDelay}>
              <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed mb-6">
                Senior software engineer building scalable systems and leading
                teams. I architect full-stack solutions and mentor developers to
                achieve their potential.
              </p>
            </BlurReveal>

            <BlurReveal delay={0.7} baseDelay={baseDelay}>
              <div className="space-y-4 text-base text-[var(--text-muted)]">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--text-primary)]">▸</span>
                  <span>
                    Full-stack: Spring Boot, React, NextJS, PostgreSQL
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--text-primary)]">▸</span>
                  <span>
                    Leadership: Mentorship, code reviews, team guidance
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--text-primary)]">▸</span>
                  <span>
                    Teaching: Python tutor, sharing knowledge with the community
                  </span>
                </div>
              </div>
            </BlurReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
