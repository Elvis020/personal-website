"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TOCItem[];
}

// Constants for path calculation
const ITEM_PADDING_Y = 6;
const ITEM_LINE_HEIGHT = 20;
const NAV_PADDING_TOP = 16;
const CORNER_RADIUS = 4;
const MIN_X_OFFSET = 4;

interface PathSegment {
  offset: number;
  top: number;
  bottom: number;
  centerY: number;
}

// Get line x-offset based on heading depth (h2 stays left, h3 indents)
function getLineOffset(depth: number): number {
  return depth <= 2 ? 0 : 13;
}

// Get text padding based on heading depth
function getItemOffset(depth: number): number {
  if (depth <= 2) return 24;
  if (depth === 3) return 36;
  return 48;
}

// Build SVG path with straight lines and rounded 90-degree corners
function buildSvgPath(segments: PathSegment[]): string {
  const d: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const prevSeg = segments[i - 1];
    const nextSeg = segments[i + 1];

    if (i === 0) {
      // Start point
      d.push(`M${seg.offset} ${seg.top}`);
    } else if (prevSeg && seg.offset !== prevSeg.offset) {
      // Coming from different offset - we're at the end of a horizontal move
      // Draw rounded corner then continue down
      const cornerY = seg.top - CORNER_RADIUS;
      d.push(`L${seg.offset} ${cornerY}`);
      d.push(`Q${seg.offset} ${seg.top},${seg.offset} ${seg.top}`);
    }

    if (nextSeg && seg.offset !== nextSeg.offset) {
      // Need to transition to different offset
      // Go straight down, then rounded corner, then horizontal
      const cornerY = seg.bottom;
      d.push(`L${seg.offset} ${cornerY - CORNER_RADIUS}`);
      // Rounded corner turning horizontal
      d.push(`Q${seg.offset} ${cornerY},${seg.offset + Math.sign(nextSeg.offset - seg.offset) * CORNER_RADIUS} ${cornerY}`);
      // Horizontal line to next offset (minus corner radius)
      d.push(`L${nextSeg.offset - Math.sign(nextSeg.offset - seg.offset) * CORNER_RADIUS} ${cornerY}`);
      // Rounded corner turning down
      d.push(`Q${nextSeg.offset} ${cornerY},${nextSeg.offset} ${cornerY + CORNER_RADIUS}`);
    } else {
      // Same offset - straight down to bottom
      d.push(`L${seg.offset} ${seg.bottom}`);
    }
  }

  return d.join(" ");
}

// Compute SVG data from headings
function computeTocSvgData(headings: TOCItem[]): {
  path: string;
  width: number;
  height: number;
  segments: PathSegment[];
  endX: number;
  endY: number;
} | null {
  if (headings.length === 0) return null;

  const segments: PathSegment[] = [];
  let cumulativeY = NAV_PADDING_TOP;
  let w = 0;
  let h = 0;

  for (let i = 0; i < headings.length; i++) {
    const isFirst = i === 0;
    const isLast = i === headings.length - 1;

    const paddingTop = isFirst ? 0 : ITEM_PADDING_Y;
    const paddingBottom = isLast ? 0 : ITEM_PADDING_Y;

    const offset = Math.max(MIN_X_OFFSET, getLineOffset(headings[i].level) + 1);

    const top = cumulativeY + paddingTop;
    const contentHeight = ITEM_LINE_HEIGHT;
    const bottom = isLast
      ? cumulativeY + paddingTop + contentHeight / 2
      : cumulativeY + paddingTop + contentHeight;

    const centerY = cumulativeY + paddingTop + contentHeight / 2;

    w = Math.max(offset, w);
    h = Math.max(h, bottom);
    segments.push({ offset, top, bottom, centerY });

    cumulativeY += paddingTop + contentHeight + paddingBottom;
  }

  const path = buildSvgPath(segments);
  const lastSeg = segments[segments.length - 1];

  return {
    path,
    width: w + 1,
    height: h,
    segments,
    endX: lastSeg?.offset ?? MIN_X_OFFSET,
    endY: lastSeg?.bottom ?? h,
  };
}

// Get path progress position for a given index
function getProgressAtIndex(
  segments: PathSegment[],
  index: number
): { x: number; y: number; pathLength: number } {
  if (segments.length === 0 || index < 0) {
    return { x: MIN_X_OFFSET, y: NAV_PADDING_TOP, pathLength: 0 };
  }

  const targetIndex = Math.min(index, segments.length - 1);
  const segment = segments[targetIndex];

  return {
    x: segment.offset,
    y: segment.centerY,
    pathLength: calculatePathLengthToIndex(segments, targetIndex),
  };
}

// Calculate approximate path length to a given segment
function calculatePathLengthToIndex(segments: PathSegment[], index: number): number {
  let length = 0;

  for (let i = 0; i <= index && i < segments.length; i++) {
    const seg = segments[i];
    const prevSeg = segments[i - 1];

    if (i === 0) {
      length += seg.centerY - seg.top;
    } else {
      // Add distance from previous segment's center to current segment's center
      const dx = seg.offset - (prevSeg?.offset ?? seg.offset);
      const dy = seg.centerY - (prevSeg?.centerY ?? seg.top);
      length += Math.sqrt(dx * dx + dy * dy);
    }
  }

  return length;
}

// Calculate total path length
function calculateTotalPathLength(segments: PathSegment[]): number {
  if (segments.length === 0) return 0;

  let length = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const prevSeg = segments[i - 1];

    if (i === 0) {
      length += seg.bottom - seg.top;
    } else {
      const dx = seg.offset - (prevSeg?.offset ?? seg.offset);
      const dy = seg.bottom - (prevSeg?.bottom ?? seg.top);
      length += Math.sqrt(dx * dx + dy * dy);
    }
  }

  return length;
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || "");
  const pathRef = useRef<SVGPathElement>(null);
  const fillPathRef = useRef<SVGPathElement>(null);
  const [markerPos, setMarkerPos] = useState({ x: MIN_X_OFFSET, y: NAV_PADDING_TOP });
  const animatedProgress = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);

  const activeIndex = useMemo(() => {
    const index = headings.findIndex((h) => h.id === activeId);
    return index >= 0 ? index : 0;
  }, [headings, activeId]);

  // Compute SVG path data
  const svgData = useMemo(() => computeTocSvgData(headings), [headings]);

  // Calculate target fill progress (percentage of path to fill)
  const targetProgress = useMemo(() => {
    if (!svgData || svgData.segments.length === 0) return 0;
    const totalLength = calculateTotalPathLength(svgData.segments);
    const currentLength = calculatePathLengthToIndex(svgData.segments, activeIndex);
    return totalLength > 0 ? currentLength / totalLength : 0;
  }, [svgData, activeIndex]);

  // Smooth animation along the path
  useEffect(() => {
    if (!pathRef.current || !fillPathRef.current) return;

    const totalLength = pathRef.current.getTotalLength();
    const startProgress = animatedProgress.current;
    const endProgress = targetProgress;
    const duration = 400; // ms
    const startTime = performance.now();

    // Easing function (ease-out cubic)
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(rawProgress);

      // Interpolate between start and end
      const currentProgress = startProgress + (endProgress - startProgress) * easedProgress;
      animatedProgress.current = currentProgress;

      const fillLength = totalLength * currentProgress;

      // Update fill path
      fillPathRef.current!.style.strokeDasharray = `${fillLength} ${totalLength}`;
      fillPathRef.current!.style.strokeDashoffset = "0";

      // Update marker position along the actual path
      const point = pathRef.current!.getPointAtLength(fillLength);
      setMarkerPos({ x: point.x, y: point.y });

      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    // Set background path
    pathRef.current.style.strokeDasharray = `${totalLength}`;
    pathRef.current.style.strokeDashoffset = "0";

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetProgress]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
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
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  if (headings.length === 0 || !svgData) return null;

  return (
    <nav className="relative">
      {/* SVG for the curved path and marker */}
      <svg
        className="absolute left-0 top-0 overflow-visible pointer-events-none"
        width={svgData.width + 10}
        height={svgData.height + 20}
      >
        {/* Background track (dim) */}
        <path
          ref={pathRef}
          d={svgData.path}
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Fill path (progress, brighter) */}
        <path
          ref={fillPathRef}
          d={svgData.path}
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />

        {/* Start dot */}
        <circle
          cx={svgData.segments[0]?.offset ?? MIN_X_OFFSET}
          cy={svgData.segments[0]?.top ?? NAV_PADDING_TOP}
          r="3"
          fill={activeIndex === 0 ? "var(--text-primary)" : "var(--text-muted)"}
          className="transition-all duration-300"
        />

        {/* Current position marker (moving dot) */}
        <circle
          cx={markerPos.x}
          cy={markerPos.y}
          r="5"
          fill="var(--text-primary)"
        />

        {/* End dot */}
        <circle
          cx={svgData.endX}
          cy={svgData.endY}
          r="3"
          fill={activeIndex === headings.length - 1 ? "var(--text-primary)" : "var(--text-muted)"}
          className="transition-all duration-300"
        />
      </svg>

      {/* TOC Items */}
      <ul className="relative space-y-0">
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          const isPast = activeIndex > index;
          const paddingLeft = getItemOffset(heading.level);

          return (
            <li key={heading.id}>
              <button
                onClick={() => handleClick(heading.id)}
                style={{ paddingLeft: `${paddingLeft}px` }}
                className={`
                  block w-full text-left py-[6px] text-sm leading-[20px] transition-all duration-300
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
