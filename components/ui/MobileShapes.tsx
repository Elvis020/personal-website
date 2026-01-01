"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

interface FloatingShape {
  id: number;
  type: "circle" | "ring" | "line" | "diamond" | "dot";
  x: number;
  y: number;
  size: number;
  rotation: number;
  baseOpacity: number;
  duration: number;
  delay: number;
}

function generateShapes(): FloatingShape[] {
  const shapes: FloatingShape[] = [];
  const types: FloatingShape["type"][] = ["circle", "ring", "line", "diamond", "dot"];

  // 8 subtle shapes for hero section only
  for (let i = 0; i < 8; i++) {
    shapes.push({
      id: i,
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10, // Spread within the 60vh hero container
      size: 20 + Math.random() * 35,
      rotation: Math.random() * 360,
      baseOpacity: 0.6 + Math.random() * 0.3,
      duration: 35 + Math.random() * 45,
      delay: Math.random() * -15,
    });
  }

  return shapes;
}

function Shape({ shape, scrollOpacity }: { shape: FloatingShape; scrollOpacity: MotionValue<number> }) {
  const baseClasses = "absolute pointer-events-none";

  // Multiply scroll-based opacity by shape's base opacity for variation
  const opacity = useTransform(scrollOpacity, (value) => value * shape.baseOpacity);

  // Gentler, slower floating motion
  const floatAnimation = {
    y: [0, -8, 0, 6, 0],
    x: [0, 4, -3, 2, 0],
    rotate: [shape.rotation, shape.rotation + 15, shape.rotation - 10, shape.rotation + 8, shape.rotation],
  };

  const transition = {
    duration: shape.duration,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay: shape.delay,
  };

  const baseStyle = {
    left: `${shape.x}%`,
    top: `${shape.y}%`,
    opacity,
  };

  switch (shape.type) {
    case "circle":
      return (
        <motion.div
          className={baseClasses}
          style={baseStyle}
          animate={floatAnimation}
          transition={transition}
        >
          <div
            className="rounded-full bg-[var(--text-muted)]"
            style={{ width: shape.size, height: shape.size }}
          />
        </motion.div>
      );

    case "ring":
      return (
        <motion.div
          className={baseClasses}
          style={baseStyle}
          animate={floatAnimation}
          transition={transition}
        >
          <div
            className="rounded-full border border-[var(--text-muted)]"
            style={{ width: shape.size * 1.5, height: shape.size * 1.5 }}
          />
        </motion.div>
      );

    case "line":
      return (
        <motion.div
          className={baseClasses}
          style={{ ...baseStyle, transformOrigin: "center" }}
          animate={{
            ...floatAnimation,
            rotate: [shape.rotation, shape.rotation + 30, shape.rotation],
          }}
          transition={{ ...transition, duration: shape.duration * 1.5 }}
        >
          <div
            className="bg-[var(--text-muted)]"
            style={{ width: 1, height: shape.size * 1.5 }}
          />
        </motion.div>
      );

    case "diamond":
      return (
        <motion.div
          className={baseClasses}
          style={baseStyle}
          animate={floatAnimation}
          transition={transition}
        >
          <div
            className="bg-[var(--text-muted)]"
            style={{
              width: shape.size * 0.7,
              height: shape.size * 0.7,
              transform: "rotate(45deg)",
            }}
          />
        </motion.div>
      );

    case "dot":
      return (
        <motion.div
          className={baseClasses}
          style={baseStyle}
          animate={{
            ...floatAnimation,
            scale: [1, 1.15, 1, 0.9, 1],
          }}
          transition={transition}
        >
          <div
            className="rounded-full bg-[var(--text-muted)]"
            style={{ width: shape.size * 0.5, height: shape.size * 0.5 }}
          />
        </motion.div>
      );

    default:
      return null;
  }
}

export default function MobileShapes() {
  const [shapes, setShapes] = useState<FloatingShape[]>([]);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { isLowEnd } = useDeviceCapability();

  // Track scroll position for opacity changes
  // More subtle in dark mode, more visible in light mode
  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(
    scrollY,
    [0, 250],
    isDark ? [0.08, 0.02] : [0.15, 0.03]
  );

  useEffect(() => {
    setMounted(true);
    setShapes(generateShapes());
  }, []);

  // Skip on low-end devices
  if (!mounted || isLowEnd) return null;

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-[60vh] z-[1] pointer-events-none overflow-hidden">
      {shapes.map((shape) => (
        <Shape key={shape.id} shape={shape} scrollOpacity={scrollOpacity} />
      ))}
    </div>
  );
}
