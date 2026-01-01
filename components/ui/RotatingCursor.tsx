"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

interface TrailPoint {
  x: number;
  y: number;
  rotation: number;
  opacity: number;
}

export default function RotatingCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track current and target rotation
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);

  // Track previous position for direction calculation
  const prevPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const speed = useRef(0);

  // Trail positions (ghost effect)
  const trailPositions = useRef<TrailPoint[]>([
    { x: -100, y: -100, rotation: 0, opacity: 0 },
    { x: -100, y: -100, rotation: 0, opacity: 0 },
    { x: -100, y: -100, rotation: 0, opacity: 0 },
  ]);

  // Animation frame ref
  const frameRef = useRef<number | null>(null);
  const isAnimating = useRef(false);
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Normalize angle to prevent spinning the long way around
  const normalizeAngle = useCallback((angle: number, reference: number) => {
    while (angle - reference > 180) angle -= 360;
    while (angle - reference < -180) angle += 360;
    return angle;
  }, []);

  // Smooth lerp function
  const lerp = useCallback((start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  }, []);

  useEffect(() => {
    if (!mounted || !cursorRef.current) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    let trailUpdateCounter = 0;

    // Create style element for cursor hiding
    const styleEl = document.createElement('style');
    styleEl.id = 'cursor-hide-styles';
    styleEl.textContent = `
      @media (min-width: 768px) and (pointer: fine) {
        *, *::before, *::after { cursor: none !important; }
      }
    `;
    if (!document.getElementById('cursor-hide-styles')) {
      document.head.appendChild(styleEl);
    }

    const updateCursor = (e: MouseEvent) => {
      // INSTANT position update - no lag
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      // Start animation if not running
      startAnimation();

      // Reset idle timeout
      if (idleTimeout.current) {
        clearTimeout(idleTimeout.current);
      }
      idleTimeout.current = setTimeout(() => {
        idleTimeout.current = null;
      }, 500);

      // Calculate velocity
      const dx = e.clientX - prevPos.current.x;
      const dy = e.clientY - prevPos.current.y;

      // Smooth velocity with momentum
      velocity.current.x = lerp(velocity.current.x, dx, 0.5);
      velocity.current.y = lerp(velocity.current.y, dy, 0.5);

      speed.current = Math.sqrt(
        velocity.current.x * velocity.current.x +
        velocity.current.y * velocity.current.y
      );

      // Only update rotation when moving with enough speed
      if (speed.current > 1.5) {
        const angle = Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) + 90;
        targetRotation.current = normalizeAngle(angle, currentRotation.current);
      }

      // Update trail positions (staggered for smooth effect)
      trailUpdateCounter++;
      if (trailUpdateCounter % 3 === 0) {
        // Shift trail positions
        for (let i = trailPositions.current.length - 1; i > 0; i--) {
          trailPositions.current[i] = { ...trailPositions.current[i - 1] };
        }
        trailPositions.current[0] = {
          x: e.clientX,
          y: e.clientY,
          rotation: currentRotation.current,
          opacity: Math.min(speed.current / 15, 0.6),
        };
      }

      prevPos.current = { x: e.clientX, y: e.clientY };
    };

    // Start animation loop (only when needed)
    const startAnimation = () => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      frameRef.current = requestAnimationFrame(animateRotation);
    };

    // Stop animation loop (when idle)
    const stopAnimation = () => {
      if (!isAnimating.current) return;
      isAnimating.current = false;
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    // Smooth rotation animation loop
    const animateRotation = () => {
      if (!isAnimating.current) return;

      const easeFactor = 0.12;

      currentRotation.current = lerp(
        currentRotation.current,
        targetRotation.current,
        easeFactor
      );

      if (cursor) {
        cursor.style.setProperty('--rotation', `${currentRotation.current}deg`);
      }

      // Update ring size based on speed
      if (ring) {
        const ringScale = 1 + Math.min(speed.current / 20, 0.5);
        const ringOpacity = Math.min(speed.current / 10, 0.8);
        ring.style.transform = `translate(-50%, -50%) scale(${ringScale})`;
        ring.style.opacity = `${ringOpacity}`;
      }

      // Update trail ghosts
      trailRefs.current.forEach((trail, i) => {
        if (trail && trailPositions.current[i]) {
          const pos = trailPositions.current[i];
          trail.style.left = `${pos.x}px`;
          trail.style.top = `${pos.y}px`;
          trail.style.setProperty('--rotation', `${pos.rotation}deg`);
          // Fade based on position in trail and current speed
          const fadeMultiplier = speed.current > 3 ? 1 : 0.3;
          trail.style.opacity = `${pos.opacity * (1 - i * 0.3) * fadeMultiplier}`;
        }
      });

      // Decay speed
      speed.current *= 0.95;

      // Stop animation when effectively idle (speed very low and no recent movement)
      if (speed.current < 0.1 && !idleTimeout.current) {
        stopAnimation();
        return;
      }

      frameRef.current = requestAnimationFrame(animateRotation);
    };

    // Hover detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        !!target.closest("a") ||
        !!target.closest("button") ||
        !!target.closest("[role='button']") ||
        target.classList.contains("cursor-pointer");

      setIsHovering(isInteractive);
    };

    const handleMouseOut = () => setIsHovering(false);

    const handleMouseLeave = () => {
      cursor.style.opacity = "0";
      trailRefs.current.forEach(trail => {
        if (trail) trail.style.opacity = "0";
      });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      cursor.style.opacity = "1";
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      prevPos.current = { x: e.clientX, y: e.clientY };
      startAnimation();
    };

    // Event listeners (animation starts on first mouse move)
    window.addEventListener("mousemove", updateCursor, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      window.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      document.getElementById('cursor-hide-styles')?.remove();
    };
  }, [mounted, lerp, normalizeAngle]);

  // Accessibility checks
  if (typeof window !== "undefined") {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = navigator.maxTouchPoints > 0 || "ontouchstart" in window;

    if (prefersReducedMotion || isTouchDevice) {
      return null;
    }
  }

  if (!mounted) return null;

  // Theme-aware colors
  const cursorFill = isDark ? "#ffffff" : "#2c2c2c";
  const cursorStroke = isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.5)";
  const glowColor = isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.4)";
  const ghostFill = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(44, 44, 44, 0.3)";

  const CursorTriangle = ({ isGhost = false, index = 0 }: { isGhost?: boolean; index?: number }) => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      style={{
        filter: isGhost ? 'none' : `drop-shadow(0 0 8px ${glowColor})`,
        transform: isHovering && !isGhost ? "scale(0.7)" : "scale(1)",
        transition: "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <path
        d="M10 2L17 18H3L10 2Z"
        fill={isGhost ? ghostFill : cursorFill}
        stroke={cursorStroke}
        strokeWidth={isGhost ? "0.5" : "1"}
        strokeLinejoin="round"
        opacity={isGhost ? 0.4 - index * 0.1 : 1}
      />
    </svg>
  );

  return (
    <>
      {/* Ghost trails */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="fixed pointer-events-none z-[9996] hidden md:block"
          style={{
            left: -100,
            top: -100,
            transform: "translate(-50%, -50%)",
            opacity: 0,
            transition: "opacity 0.1s ease",
          }}
        >
          <div style={{ transform: "rotate(var(--rotation, 0deg))" }}>
            <CursorTriangle isGhost index={i} />
          </div>
        </div>
      ))}

      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9998] hidden md:block"
        style={{
          left: -100,
          top: -100,
          transform: "translate(-50%, -50%)",
          transition: "opacity 0.2s ease",
        }}
      >
        {/* Outer ring - reacts to speed */}
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 w-10 h-10 rounded-full border"
          style={{
            borderColor: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(44, 44, 44, 0.4)",
            transform: "translate(-50%, -50%) scale(1)",
            opacity: 0,
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
          }}
        />

        {/* Rotating triangle */}
        <div
          className="relative"
          style={{ transform: "rotate(var(--rotation, 0deg))" }}
        >
          <CursorTriangle />
        </div>

        {/* Center dot - appears on hover */}
        <div
          className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full"
          style={{
            backgroundColor: isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.7)",
            transform: "translate(-50%, -50%)",
            opacity: isHovering ? 1 : 0,
            transition: "opacity 0.15s ease",
          }}
        />
      </div>
    </>
  );
}
