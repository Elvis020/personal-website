"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function AdaptiveFavicon() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isDark = resolvedTheme === "dark";

    // Update favicon based on theme
    const updateFavicon = () => {
      // Remove existing favicon links
      const existingLinks = document.querySelectorAll('link[rel*="icon"]');
      existingLinks.forEach(link => link.remove());

      // Create new favicon links based on theme
      const favicon16 = document.createElement("link");
      favicon16.rel = "icon";
      favicon16.type = "image/png";
      favicon16.sizes = "16x16";
      favicon16.href = isDark ? "/favicon-dark-circular-16.png" : "/favicon-light-circular-16.png";

      const favicon32 = document.createElement("link");
      favicon32.rel = "icon";
      favicon32.type = "image/png";
      favicon32.sizes = "32x32";
      favicon32.href = isDark ? "/favicon-dark-circular-32.png" : "/favicon-light-circular-32.png";

      const appleIcon = document.createElement("link");
      appleIcon.rel = "apple-touch-icon";
      appleIcon.sizes = "180x180";
      appleIcon.href = isDark ? "/favicon-dark-circular-180.png" : "/favicon-light-circular-180.png";

      // Append to head
      document.head.appendChild(favicon16);
      document.head.appendChild(favicon32);
      document.head.appendChild(appleIcon);
    };

    updateFavicon();
  }, [resolvedTheme]);

  return null;
}
