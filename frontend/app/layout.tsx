import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GSoC 2025 Projects",
  description:
    "a list of all GSoC 2025 projects web scraped from the GSoC website",
  keywords: [
    "GSoC",
    "Google Summer of Code",
    "2025",
    "Projects",
    "GSoC scraped projects",
  ],
  applicationName: "GSoC 2025 Projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Analytics />
    </html>
  );
}
