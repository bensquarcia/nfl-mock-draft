// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"; 
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- SEO & TAB METADATA PRESERVED ---
export const metadata: Metadata = {
  metadataBase: new URL("https://upnextdraft.com"),
  title: {
    default: "UpNext Draft Network | 2026 NFL Mock Drafts & Big Boards",
    template: "%s | UpNext Draft Network",
  },
  description: "The premier 2026 NFL Draft toolkit. Run full 7-round mock drafts with realistic trades and build your custom big board prospect rankings.",
  keywords: [
    "NFL Draft 2026", 
    "Mock Draft Simulator", 
    "Big Board Creator", 
    "NFL Prospect Rankings", 
    "2026 NFL Draft Class", 
    "NFL Scouting Toolkit",
    "UpNext Draft Network"
  ],
  authors: [{ name: "UpNext Draft Network Team" }],
  openGraph: {
    title: "UpNext Draft Network | 2026 NFL Mock Draft Simulator",
    description: "Build your big board and run mock drafts for the 2026 NFL Draft.",
    url: "https://upnextdraft.com",
    siteName: "UpNext Draft Network",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UpNext Draft Network | 2026 NFL Mock Draft Simulator",
    description: "The ultimate 2026 NFL scouting experience. Mock drafts and player rankings.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Vercel Analytics tracking script added back */}
        <Analytics />
      </body>
    </html>
  );
}