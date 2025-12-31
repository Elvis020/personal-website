"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function TerminalLoader() {
  const lines = ["> initializing...", "> loading assets...", "> ready_"];
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) return;
    const line = lines[currentLine];
    if (currentChar < line.length) {
      const timer = setTimeout(() => setCurrentChar((c) => c + 1), 25);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar]);

  return (
    <div className="font-mono text-sm text-[var(--text-primary)] space-y-1">
      {lines.slice(0, currentLine + 1).map((line, i) => (
        <div key={i} className="flex">
          <span>{i < currentLine ? line : line.slice(0, currentChar)}</span>
          {i === currentLine && currentLine < lines.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="ml-0.5"
            >
              |
            </motion.span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Shortened loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[var(--bg-primary)] flex items-center justify-center"
        >
          <TerminalLoader />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
