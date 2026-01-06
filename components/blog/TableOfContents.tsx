"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TOCItem[];
}

// Get line x-offset based on heading depth (h2 stays left, h3 indents)
function getLineOffset(depth: number): number {
  return depth <= 2 ? 5 : 18;
}

// Get text padding based on heading depth
function getItemOffset(depth: number): number {
  if (depth <= 2) return 24;
  if (depth === 3) return 36;
  return 48;
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || "");
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const fillPathRef = useRef<SVGPathElement>(null);
  const [pathData, setPathData] = useState<string>("");
  const [svgHeight, setSvgHeight] = useState(0);
  const [itemCenters, setItemCenters] = useState<{ x: number; y: number }[]>([]);
  const [markerPos, setMarkerPos] = useState<{ x: number; y: number } | null>(null);
  const animatedProgress = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);
  const isScrollingProgrammatically = useRef(false);

  const activeIndex = headings.findIndex((h) => h.id === activeId);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  // Measure actual DOM positions and build path
  const measureAndBuildPath = useCallback(() => {
    if (!navRef.current || itemRefs.current.length === 0) return;

    const navRect = navRef.current.getBoundingClientRect();
    const centers: { x: number; y: number }[] = [];
    let maxY = 0;

    // Measure each item's center position relative to nav
    itemRefs.current.forEach((btn, i) => {
      if (btn) {
        const btnRect = btn.getBoundingClientRect();
        const x = getLineOffset(headings[i]?.level ?? 2);
        const y = btnRect.top - navRect.top + btnRect.height / 2;
        centers.push({ x, y });
        maxY = Math.max(maxY, y);
      }
    });

    if (centers.length === 0) return;

    // Build SVG path connecting all centers
    const pathParts: string[] = [`M${centers[0].x} ${centers[0].y}`];

    for (let i = 1; i < centers.length; i++) {
      const prev = centers[i - 1];
      const curr = centers[i];

      if (curr.x !== prev.x) {
        // Different x-offset - horizontal transition at midpoint
        const midY = (prev.y + curr.y) / 2;
        pathParts.push(`L${prev.x} ${midY}`);
        pathParts.push(`L${curr.x} ${midY}`);
      }
      pathParts.push(`L${curr.x} ${curr.y}`);
    }

    setPathData(pathParts.join(" "));
    setSvgHeight(maxY + 20);
    setItemCenters(centers);
    // Set initial marker position at first item
    if (centers.length > 0) {
      setMarkerPos(centers[0]);
    }
  }, [headings]);

  // Measure on mount and when headings change
  useEffect(() => {
    // Small delay to ensure DOM is rendered
    const timer = setTimeout(measureAndBuildPath, 50);

    // Also measure on resize
    window.addEventListener("resize", measureAndBuildPath);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measureAndBuildPath);
    };
  }, [measureAndBuildPath]);

  // Calculate target progress based on active index
  const targetProgress = itemCenters.length > 0 ? safeActiveIndex / (itemCenters.length - 1) : 0;

  // Animate marker to active item's center (using calculated positions, not path interpolation)
  useEffect(() => {
    if (!pathRef.current || !fillPathRef.current || !pathData || itemCenters.length === 0 || !markerPos) return;

    const totalLength = pathRef.current.getTotalLength();
    if (totalLength === 0) return;

    // Get target position directly from calculated centers
    const targetCenter = itemCenters[safeActiveIndex];
    if (!targetCenter) return;

    const startPos = { x: markerPos.x, y: markerPos.y };
    const endPos = targetCenter;
    const startProgress = animatedProgress.current;
    const endProgress = targetProgress;
    const duration = 400;
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(rawProgress);

      // Update fill progress
      const currentProgress = startProgress + (endProgress - startProgress) * easedProgress;
      animatedProgress.current = currentProgress;
      const fillLength = totalLength * currentProgress;

      fillPathRef.current!.style.strokeDasharray = `${fillLength} ${totalLength}`;
      fillPathRef.current!.style.strokeDashoffset = "0";

      // Interpolate marker position directly between centers (not using path)
      const newX = startPos.x + (endPos.x - startPos.x) * easedProgress;
      const newY = startPos.y + (endPos.y - startPos.y) * easedProgress;
      setMarkerPos({ x: newX, y: newY });

      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    pathRef.current.style.strokeDasharray = `${totalLength}`;
    pathRef.current.style.strokeDashoffset = "0";

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetProgress, pathData, itemCenters.length, safeActiveIndex]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // Skip scroll detection during programmatic scrolling
      if (isScrollingProgrammatically.current) {
        return;
      }

      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const isNearBottom = scrollPosition >= pageHeight - 100;

      if (isNearBottom && headings.length > 0) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }

      const scrollTop = window.scrollY + 100;
      let currentHeading = headings[0]?.id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.offsetTop <= scrollTop) {
          currentHeading = heading.id;
        }
      }

      if (currentHeading) {
        setActiveId(currentHeading);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Set flag to prevent scroll detection interference
      isScrollingProgrammatically.current = true;

      // Immediately update active ID for instant visual feedback
      setActiveId(id);

      // Perform smooth scroll
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });

      // Re-enable scroll detection after smooth scroll completes
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 1000);
    }
  };

  if (headings.length === 0) return null;

  const firstCenter = itemCenters[0];
  const lastCenter = itemCenters[itemCenters.length - 1];

  return (
    <nav ref={navRef} className="relative">
      {/* SVG for the path and marker */}
      {pathData && (
        <svg
          className="absolute left-0 top-0 overflow-visible pointer-events-none"
          width={30}
          height={svgHeight}
        >
          {/* Background track */}
          <path
            ref={pathRef}
            d={pathData}
            fill="none"
            stroke="var(--border)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Fill path (progress) */}
          <path
            ref={fillPathRef}
            d={pathData}
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Start dot */}
          {firstCenter && (
            <circle
              cx={firstCenter.x}
              cy={firstCenter.y}
              r="3"
              fill={safeActiveIndex === 0 ? "var(--text-primary)" : "var(--text-muted)"}
              className="transition-all duration-300"
            />
          )}

          {/* Current position marker */}
          {markerPos && (
            <circle
              cx={markerPos.x}
              cy={markerPos.y}
              r="5"
              fill="var(--text-primary)"
            />
          )}

          {/* End dot */}
          {lastCenter && (
            <circle
              cx={lastCenter.x}
              cy={lastCenter.y}
              r="3"
              fill={safeActiveIndex === headings.length - 1 ? "var(--text-primary)" : "var(--text-muted)"}
              className="transition-all duration-300"
            />
          )}
        </svg>
      )}

      {/* TOC Items */}
      <ul className="relative space-y-0">
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          const isPast = safeActiveIndex > index;
          const paddingLeft = getItemOffset(heading.level);

          return (
            <li key={heading.id}>
              <button
                ref={(el) => { itemRefs.current[index] = el; }}
                onClick={() => handleClick(heading.id)}
                style={{ paddingLeft: `${paddingLeft}px` }}
                className={`
                  block w-full text-left py-[6px] text-sm leading-[20px] transition-all duration-300
                  truncate
                  ${heading.level === 3 ? "text-[13px]" : ""}
                  ${isActive
                    ? "text-[var(--text-primary)] font-semibold"
                    : isPast
                      ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }
                `}
              >
                {heading.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
