import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/animations/LoadingScreen";
import ParticleWrapper from "@/components/three/ParticleWrapper";
import ThemeProvider from "@/components/providers/ThemeProvider";
import RotatingCursor from "@/components/ui/RotatingCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LoadingScreen />
          <ParticleWrapper />
          <RotatingCursor />
          <Header />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
