"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const socialLinks = [
  { href: "https://github.com", label: "GitHub", icon: "GH" },
  { href: "https://twitter.com", label: "Twitter", icon: "X" },
  { href: "https://linkedin.com", label: "LinkedIn", icon: "LI" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-[var(--border)] mt-16"
    >
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side */}
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span>&copy; {currentYear}</span>
            <span className="text-[var(--text-muted)]">/</span>
            <span>Elvis O. Amoako</span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-mono transition-colors duration-200"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
