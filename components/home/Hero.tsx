"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
          if (char !== " " && char !== "\n" && Math.random() > 0.85 && !mistakes.includes(currentIndex)) {
            mistakes.push(currentIndex);
            const mistakeIndex = currentIndex; // Capture the index for closure
            setDisplayText(finalText.slice(0, currentIndex) + chars[Math.floor(Math.random() * chars.length)]);

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

// Social Links Component
function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <a
        href="https://github.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        aria-label="GitHub"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      </a>
      <a
        href="https://twitter.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        aria-label="Twitter/X"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href="https://linkedin.com/in/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        aria-label="LinkedIn"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
      <a
        href="mailto:your.email@example.com"
        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        aria-label="Email"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </a>
    </div>
  );
}

export default function Hero() {
  // Check if this is the first visit (loading screen is showing)
  const [baseDelay] = useState(() => {
    if (typeof window === "undefined") return 2.1;
    return sessionStorage.getItem("hasLoaded") ? 0 : 2.1;
  });

  const scrambledName = useTypewriterScramble("Elvis O.\nAmoako", baseDelay);

  return (
    <section className="min-h-[70vh] md:min-h-[80vh] flex items-center relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <BlurReveal delay={0.1} baseDelay={baseDelay}>
              <p className="text-sm font-mono text-[var(--text-muted)] mb-4 tracking-widest uppercase">
                Web Developer & Designer
              </p>
            </BlurReveal>

            <BlurReveal delay={0.2} baseDelay={baseDelay}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-[var(--text-primary)] whitespace-pre-line font-mono">
                {scrambledName}
              </h1>
            </BlurReveal>

            <BlurReveal delay={0.4} baseDelay={baseDelay}>
              <div className="h-1 w-20 bg-[var(--text-primary)] mb-8" />
            </BlurReveal>

            <BlurReveal delay={0.6} baseDelay={baseDelay}>
              <div className="flex items-center gap-3 mb-8">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm text-[var(--text-secondary)]">Open to opportunities</span>
              </div>
            </BlurReveal>

            <BlurReveal delay={0.8} baseDelay={baseDelay}>
              <SocialLinks />
            </BlurReveal>
          </div>

          {/* Right Column */}
          <div>
            <BlurReveal delay={0.5} baseDelay={baseDelay}>
              <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed mb-6">
                I build digital products that blend aesthetics with functionality.
                From concept to deployment, I create experiences that users love.
              </p>
            </BlurReveal>

            <BlurReveal delay={0.7} baseDelay={baseDelay}>
              <div className="space-y-4 text-base text-[var(--text-muted)]">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--text-primary)]">▸</span>
                  <span>Full-stack development with modern frameworks</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--text-primary)]">▸</span>
                  <span>UI/UX design with attention to detail</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--text-primary)]">▸</span>
                  <span>Performance optimization and accessibility</span>
                </div>
              </div>
            </BlurReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
