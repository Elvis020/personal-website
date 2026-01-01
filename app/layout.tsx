import type { Metadata } from "next";
import { Fredoka, Quicksand, Victor_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer, { ScrollIndicator } from "@/components/layout/Footer";
import LoadingScreen from "@/components/animations/LoadingScreen";
import ParticleWrapper from "@/components/three/ParticleWrapper";
import ThemeProvider from "@/components/providers/ThemeProvider";
import RotatingCursor from "@/components/ui/RotatingCursor";
import MobileShapes from "@/components/ui/MobileShapes";

// Playful font combination - Friendly & Rounded (optimized weights)
const fredoka = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const quicksand = Quicksand({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const victorMono = Victor_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Elvis O. Amoako | Developer & Creator",
  description: "Personal website of EOA - Developer, creator, and lifelong learner building things for the web.",
  keywords: ["developer", "portfolio", "blog", "projects"],
  authors: [{ name: "EOA" }],
  openGraph: {
    title: "Elvis O. Amoako | Developer & Creator",
    description: "Personal website of Elvis O. Amoako - Developer, creator, and lifelong learner.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elvis O. Amoako | Developer & Creator",
    description: "Personal website of EOA - Developer, creator, and lifelong learner.",
  },
};

// Enable safe area insets for notched devices
export const viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fredoka.variable} ${quicksand.variable} ${victorMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LoadingScreen />
          <ParticleWrapper />
          <RotatingCursor />
          <MobileShapes />
          <Header />
          <main className="min-h-screen">
            {children}
            <ScrollIndicator />
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
