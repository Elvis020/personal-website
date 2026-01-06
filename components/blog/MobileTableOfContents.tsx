"use client";

import { useState, useEffect, useRef } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface MobileTableOfContentsProps {
  headings: TOCItem[];
}

export default function MobileTableOfContents({ headings }: MobileTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || "");
  const [progress, setProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const isScrollingProgrammatically = useRef(false);

  const activeIndex = headings.findIndex((h) => h.id === activeId);

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
        setProgress(100);
        return;
      }

      const scrollTop = window.scrollY + 100;
      let currentHeading = headings[0]?.id;
      let currentIndex = 0;

      for (let i = 0; i < headings.length; i++) {
        const element = document.getElementById(headings[i].id);
        if (element && element.offsetTop <= scrollTop) {
          currentHeading = headings[i].id;
          currentIndex = i;
        }
      }

      if (currentHeading) {
        setActiveId(currentHeading);
        // Calculate progress percentage
        const progressPercent = ((currentIndex + 1) / headings.length) * 100;
        setProgress(progressPercent);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  // Auto-scroll to active item
  useEffect(() => {
    if (activeButtonRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const button = activeButtonRef.current;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      // Center the active button in the container, but keep first item at start
      const isFirstItem = headings.findIndex((h) => h.id === activeId) === 0;
      const scrollLeft = isFirstItem
        ? 0
        : Math.max(0, button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeId, headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Set flag to prevent scroll detection interference
      isScrollingProgrammatically.current = true;

      // Immediately update active ID for instant visual feedback
      setActiveId(id);

      // Update progress immediately
      const clickedIndex = headings.findIndex((h) => h.id === id);
      if (clickedIndex !== -1) {
        const progressPercent = ((clickedIndex + 1) / headings.length) * 100;
        setProgress(progressPercent);
      }

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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-primary)]/95 backdrop-blur-lg border-t border-[var(--border)] hidden md:block xl:hidden">
      {/* Progress bar */}
      <div className="h-0.5 bg-[var(--border)] relative">
        <div
          className="absolute left-0 top-0 h-full bg-[var(--text-primary)] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* Moving dot indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--text-primary)] transition-all duration-300 ease-out shadow-sm"
          style={{ left: `calc(${progress}% - 4px)` }}
        />
      </div>

      {/* Horizontal scrollable headings */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1 px-4 py-3 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          const isPast = activeIndex > index;

          return (
            <button
              key={heading.id}
              ref={isActive ? activeButtonRef : null}
              onClick={() => handleClick(heading.id)}
              className={`
                flex-shrink-0 px-3 py-1.5 text-xs rounded-full transition-all duration-200
                max-w-[200px] truncate
                ${heading.level === 3 ? "text-[11px]" : ""}
                ${isActive
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-medium"
                  : isPast
                    ? "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                    : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                }
              `}
            >
              {heading.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
