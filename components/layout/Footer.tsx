"use client";

import { useEffect, useState } from "react";

const socialLinks = [
  {
    href: "https://github.com",
    label: "GitHub",
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    href: "https://twitter.com",
    label: "X",
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

// Sticky scroll progress indicator for mobile
function MobileScrollIndicator() {
  const [progress, setProgress] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const scrollableHeight = docHeight - viewportHeight;

      // Only show indicator if page has meaningful scroll (more than 100px)
      const hasScroll = scrollableHeight > 100;
      setIsScrollable(hasScroll);

      if (scrollableHeight <= 0) {
        setProgress(0);
        return;
      }

      const newProgress = Math.min(100, Math.max(0, (scrollTop / scrollableHeight) * 100));
      setProgress(newProgress);
    };

    calculateProgress();

    window.addEventListener("scroll", calculateProgress, { passive: true });
    window.visualViewport?.addEventListener("resize", calculateProgress);
    window.addEventListener("resize", calculateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", calculateProgress);
      window.visualViewport?.removeEventListener("resize", calculateProgress);
      window.removeEventListener("resize", calculateProgress);
    };
  }, []);

  // Don't render if page isn't scrollable
  if (!isScrollable) return null;

  return (
    <div
      className="md:hidden sticky left-0 right-0 z-40 bg-[var(--bg-primary)] border-t border-[var(--border)]"
      style={{
        bottom: "env(safe-area-inset-bottom, 0px)",
        marginBottom: "env(safe-area-inset-bottom, 0px)"
      }}
    >
      {/* Progress bar */}
      <div className="relative h-[3px]">
        <div className="absolute inset-0 bg-[var(--text-muted)]/20" />
        <div
          className="absolute left-0 top-0 h-full bg-[var(--text-primary)]"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${progress}%` }}
        >
          <div className="w-2.5 h-2.5 -translate-x-1/2 rounded-full bg-[var(--text-primary)]" />
        </div>
      </div>
    </div>
  );
}

// Mobile footer - normal flow
function MobileFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg-primary)]">
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
      >
        <span className="text-[10px] text-[var(--text-muted)]">
          &copy; {currentYear} EOA
        </span>

        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// Desktop: Simple inline footer
function DesktopFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hidden md:block border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">
            &copy; {currentYear} EOA
          </span>

          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Export scroll indicator separately so it can be placed inside main content
export function ScrollIndicator() {
  return <MobileScrollIndicator />;
}

export default function Footer() {
  return (
    <>
      <MobileFooter />
      <DesktopFooter />
    </>
  );
}
