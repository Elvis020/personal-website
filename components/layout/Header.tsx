"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/reads", label: "Reads" },
];

// Desktop Pills Sidebar
function PillsSidebar({ pathname }: { pathname: string }) {
  const icons: Record<string, string> = {
    "/": "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    "/about":
      "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    "/projects":
      "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
    "/blog":
      "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    "/reads":
      "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  };

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 flex-col items-center gap-2 z-50"
    >
      {navItems.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
          >
            <Link href={item.href}>
              <motion.div
                className={`relative px-4 py-3 rounded-full border transition-all ${
                  isActive
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent"
                    : "bg-[var(--bg-secondary)]/80 backdrop-blur-sm text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]"
                }`}
                whileHover={{ scale: 1.1, x: 4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={icons[item.href]}
                  />
                </svg>
              </motion.div>
            </Link>
          </motion.div>
        );
      })}

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-4"
      >
        <ThemeSwitcher />
      </motion.div>
    </motion.aside>
  );
}

// Floating Controls Pill (top-right) - Theme + Hamburger grouped
function FloatingControls({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="md:hidden fixed z-50"
      style={{
        top: "calc(env(safe-area-inset-top) + 12px)",
        right: "16px",
      }}
    >
      <div className="flex items-center gap-[2px] p-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full">
        {/* Theme Switcher Container */}
        <div className="px-1">
          <ThemeSwitcher />
        </div>

        {/* Subtle Divider */}
        <div className="w-[1px] h-5 bg-[var(--border)]" />

        {/* Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <div className="relative w-4 h-3 flex flex-col justify-between">
            <motion.span
              animate={{
                rotate: menuOpen ? 45 : 0,
                y: menuOpen ? 5 : 0,
                width: menuOpen ? 16 : 16,
              }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="block h-[2px] bg-[var(--text-primary)] rounded-full origin-center"
            />
            <motion.span
              animate={{
                opacity: menuOpen ? 0 : 1,
                scaleX: menuOpen ? 0 : 1,
              }}
              transition={{ duration: 0.15 }}
              className="block h-[2px] w-3 bg-[var(--text-primary)] rounded-full self-end"
            />
            <motion.span
              animate={{
                rotate: menuOpen ? -45 : 0,
                y: menuOpen ? -5 : 0,
                width: menuOpen ? 16 : 10,
              }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="block h-[2px] bg-[var(--text-primary)] rounded-full origin-center"
            />
          </div>
        </button>
      </div>
    </motion.div>
  );
}

// Full-screen menu overlay
function MenuOverlay({
  isOpen,
  onClose,
  pathname,
}: {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="md:hidden fixed inset-0 z-40"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--bg-primary)]/98 backdrop-blur-xl"
          />

          {/* Navigation content */}
          <nav
            className="relative h-full flex flex-col justify-center px-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Page indicator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.1 }}
              className="absolute top-32 left-8 text-[10px] tracking-[0.3em] uppercase text-[var(--text-muted)]"
            >
              Navigation
            </motion.div>

            {/* Nav items */}
            <div className="space-y-2">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      delay: 0.05 + index * 0.05,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-center gap-4 py-3"
                    >
                      {/* Active indicator */}
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: isActive ? 1 : 0 }}
                        className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]"
                      />
                      <span
                        className={`text-4xl font-serif tracking-tight transition-colors duration-300 ${
                          isActive
                            ? "text-[var(--text-primary)]"
                            : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Desktop Pills Sidebar */}
      <PillsSidebar pathname={pathname} />

      {/* Desktop sidebar padding */}
      <style jsx global>{`
        @media (min-width: 768px) {
          main,
          footer {
            padding-left: 6rem !important;
          }
        }
      `}</style>

      {/* Mobile: Floating controls */}
      <FloatingControls menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Mobile Menu Overlay */}
      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
