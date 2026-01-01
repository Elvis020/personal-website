"use client";

import { useState, useEffect } from "react";

interface DeviceCapability {
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  hardwareConcurrency: number;
  deviceMemory: number | null;
  isSlowConnection: boolean;
}

/**
 * Detects device capability to conditionally render animations
 *
 * Low-end criteria:
 * - prefers-reduced-motion is enabled
 * - Less than 4 CPU cores
 * - Less than 4GB device memory
 * - Slow network connection (2g, slow-2g)
 */
export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>({
    isLowEnd: false,
    prefersReducedMotion: false,
    hardwareConcurrency: 4,
    deviceMemory: null,
    isSlowConnection: false,
  });

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Hardware concurrency (CPU cores)
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;

    // Device memory (in GB) - not supported in all browsers
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory ?? null;

    // Network connection type
    const connection = (
      navigator as Navigator & {
        connection?: { effectiveType?: string; saveData?: boolean };
      }
    ).connection;
    const isSlowConnection =
      connection?.saveData ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g";

    // Determine if low-end device
    const isLowEnd =
      prefersReducedMotion ||
      hardwareConcurrency < 4 ||
      (deviceMemory !== null && deviceMemory < 4) ||
      isSlowConnection;

    setCapability({
      isLowEnd,
      prefersReducedMotion,
      hardwareConcurrency,
      deviceMemory,
      isSlowConnection: !!isSlowConnection,
    });

    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      setCapability((prev) => ({
        ...prev,
        prefersReducedMotion: e.matches,
        isLowEnd: e.matches || prev.hardwareConcurrency < 4 ||
          (prev.deviceMemory !== null && prev.deviceMemory < 4) ||
          prev.isSlowConnection,
      }));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return capability;
}
