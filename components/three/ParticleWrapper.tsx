"use client";

import dynamic from "next/dynamic";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

const ParticleBackground = dynamic(
  () => import("./ParticleBackground"),
  { ssr: false }
);

export default function ParticleWrapper() {
  const { isLowEnd } = useDeviceCapability();

  // Skip Three.js entirely on low-end devices
  if (isLowEnd) {
    return null;
  }

  return <ParticleBackground />;
}
