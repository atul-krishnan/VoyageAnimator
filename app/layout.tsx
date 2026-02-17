import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import "mapbox-gl/dist/mapbox-gl.css";

import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { runtimeEnv } from "@/lib/env";

import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = runtimeEnv.siteUrl || "https://voyagraph.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Voyagraph | Turn Every Journey Into a Story",
    template: "%s | Voyagraph",
  },
  description:
    "Voyagraph helps travel creators build cinematic route animations with map styles, 3D markers, and timeline-ready playback.",
  openGraph: {
    title: "Voyagraph",
    description:
      "Build cinematic travel route stories with style-first map animation workflows.",
    url: baseUrl,
    siteName: "Voyagraph",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voyagraph",
    description:
      "Turn every journey into a story with route animation and creator-focused map controls.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="bg-[#030b14]" lang="en">
      <body className={`${syne.variable} ${manrope.variable} font-body antialiased`}>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
