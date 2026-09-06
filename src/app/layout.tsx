import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "John Paul Escuadra — Fullstack Developer & Founder",
  description:
    "Portfolio of John Paul Escuadra — Software Developer and Founder of HaypBooks & V.Studio, the software hub where all his apps, upcoming updates, and new releases live.",
  keywords: [
    "John Paul Escuadra",
    "Software Developer",
    "Fullstack Developer",
    "HaypBooks",
    "V.Studio",
    "Software Hub",
    "Product Builder",
    "Game Development",
  ],
  authors: [{ name: "John Paul Escuadra" }],
  openGraph: {
    title: "John Paul Escuadra — Fullstack Developer & Founder",
    description:
      "Fullstack Developer • Founder of HaypBooks & V.Studio • Creator, Builder, Player.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${manrope.variable} antialiased bg-background text-foreground portfolio-body`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
