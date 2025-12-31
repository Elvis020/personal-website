"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import FadeIn from "../animations/FadeIn";

type EffectType = "default" | "stagger" | "rotate" | "tilt" | "blur";

const effectNames: Record<EffectType, string> = {
  default: "Simple",
  stagger: "Stagger",
  rotate: "Rotate",
  tilt: "3D Tilt",
  blur: "Blur",
};

const effects: EffectType[] = ["default", "stagger", "rotate", "tilt", "blur"];

// Character stagger animation for name
function StaggerName({ text }: { text: string }) {
  return (
    <motion.span
      className="inline-block bg-gradient-to-r from-[var(--text-primary)] via-[var(--text-secondary)] to-[var(--text-primary)] bg-clip-text text-transparent bg-[length:200%_100%]"
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: i * 0.04,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="inline-block"
          style={{ marginRight: char === " " ? "0.25em" : "0" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Rotating words for tagline
function RotatingWords() {
  const words = ["things", "experiences", "interfaces", "products", "solutions"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed mb-8 max-w-2xl block">
      I build{" "}
      <span className="relative inline-block w-[140px] md:w-[180px] text-left">
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index]}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute left-0 text-[var(--text-primary)] font-medium"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
      {" "}for the web.
      <br />
      Currently exploring the intersection of design, code, and emerging technologies.
    </span>
  );
}

// 3D Tilt wrapper
function TiltWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}

// Blur reveal text
function BlurReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ filter: "blur(10px)", opacity: 0 }}
      animate={{ filter: "blur(0px)", opacity: 1 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const [effect, setEffect] = useState<EffectType>("default");
  const [key, setKey] = useState(0); // Force re-render on effect change

  const cycleEffect = () => {
    const currentIndex = effects.indexOf(effect);
    const nextIndex = (currentIndex + 1) % effects.length;
    setEffect(effects[nextIndex]);
    setKey((prev) => prev + 1);
  };

  const renderContent = () => {
    const greeting = (
      <p className="text-[var(--text-secondary)] text-lg mb-4 font-mono">Hi, I&apos;m</p>
    );

    const name = (
      <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6">
        {effect === "stagger" ? (
          <StaggerName text="Elvis O. Amoako" />
        ) : (
          <span className="text-[var(--text-primary)]">Elvis O. Amoako</span>
        )}
      </h1>
    );

    const tagline = effect === "rotate" ? (
      <RotatingWords />
    ) : (
      <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed mb-8 max-w-2xl">
        I build things for the web. Currently exploring the intersection
        of design, code, and emerging technologies.
      </p>
    );

    const status = (
      <div className="flex items-center gap-3 text-sm">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="text-[var(--text-secondary)]">
          Available for new opportunities
        </span>
      </div>
    );

    const cta = (
      <div className="flex flex-wrap items-center gap-4 mt-10">
        <motion.a
          href="/projects"
          className="group relative px-6 py-3 text-sm font-medium rounded-lg overflow-hidden"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <span className="absolute inset-0 bg-[var(--text-primary)]" />
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative text-[var(--bg-primary)]">View Projects</span>
        </motion.a>
        <motion.a
          href="/blog"
          className="px-6 py-3 border border-[var(--border)] text-[var(--text-primary)] text-sm font-medium rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          Read Blog
        </motion.a>
      </div>
    );

    // Default effect
    if (effect === "default") {
      return (
        <>
          <FadeIn delay={0.2}>{greeting}</FadeIn>
          <FadeIn delay={0.3}>{name}</FadeIn>
          <FadeIn delay={0.4}>{tagline}</FadeIn>
          <FadeIn delay={0.5}>{status}</FadeIn>
          <FadeIn delay={0.6}>{cta}</FadeIn>
        </>
      );
    }

    // Stagger effect (letters animate individually)
    if (effect === "stagger") {
      return (
        <>
          <FadeIn delay={0.1}>{greeting}</FadeIn>
          {name}
          <FadeIn delay={0.8}>{tagline}</FadeIn>
          <FadeIn delay={0.9}>{status}</FadeIn>
          <FadeIn delay={1}>{cta}</FadeIn>
        </>
      );
    }

    // Rotate effect (rotating words)
    if (effect === "rotate") {
      return (
        <>
          <FadeIn delay={0.2}>{greeting}</FadeIn>
          <FadeIn delay={0.3}>{name}</FadeIn>
          {tagline}
          <FadeIn delay={0.5}>{status}</FadeIn>
          <FadeIn delay={0.6}>{cta}</FadeIn>
        </>
      );
    }

    // Blur effect
    if (effect === "blur") {
      return (
        <>
          <BlurReveal delay={0.1}>{greeting}</BlurReveal>
          <BlurReveal delay={0.2}>{name}</BlurReveal>
          <BlurReveal delay={0.4}>{tagline}</BlurReveal>
          <BlurReveal delay={0.6}>{status}</BlurReveal>
          <BlurReveal delay={0.8}>{cta}</BlurReveal>
        </>
      );
    }

    // Tilt effect (default content with tilt wrapper applied at section level)
    return (
      <>
        <FadeIn delay={0.2}>{greeting}</FadeIn>
        <FadeIn delay={0.3}>{name}</FadeIn>
        <FadeIn delay={0.4}>{tagline}</FadeIn>
        <FadeIn delay={0.5}>{status}</FadeIn>
        <FadeIn delay={0.6}>{cta}</FadeIn>
      </>
    );
  };

  const content = (
    <div className="max-w-5xl mx-auto px-6 py-32">
      <div className="max-w-3xl" key={key}>
        {renderContent()}
      </div>
    </div>
  );

  return (
    <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
      {effect === "tilt" ? <TiltWrapper>{content}</TiltWrapper> : content}

      {/* Subtle gradient orb */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[var(--bg-tertiary)] to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* Effect Switcher */}
      <motion.button
        onClick={cycleEffect}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors backdrop-blur-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
        <span className="font-mono">{effectNames[effect]}</span>
      </motion.button>
    </section>
  );
}
