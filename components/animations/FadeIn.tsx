"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

const directionOffset = {
  up: { y: 30 },
  down: { y: -30 },
  left: { x: 30 },
  right: { x: -30 },
};

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: FadeInProps) {
  const [hasAnimated, setHasAnimated] = useState(false);

  // Trigger animation after mount with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 50); // Small delay to ensure DOM is ready
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directionOffset[direction],
      }}
      animate={hasAnimated ? {
        opacity: 1,
        x: 0,
        y: 0,
      } : undefined}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
