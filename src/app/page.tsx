"use client";

import CircuitBackground from "@/components/portfolio/CircuitBackground";
import IntroCurtain from "@/components/portfolio/IntroCurtain";
import CursorGlow from "@/components/portfolio/CursorGlow";
import ScrollProgress from "@/components/portfolio/ScrollProgress";
import Hero from "@/components/portfolio/Hero";
import Marquee from "@/components/portfolio/Marquee";
import About from "@/components/portfolio/About";
import Ventures from "@/components/portfolio/Ventures";
import Cube3D from "@/components/portfolio/Cube3D";
import Arsenal from "@/components/portfolio/Arsenal";
import Playground from "@/components/portfolio/Playground";
import Contact from "@/components/portfolio/Contact";

export default function PortfolioHome() {
  return (
    <main className="relative min-h-screen bg-white font-body text-ink">
      {/* Fixed ambient layers */}
      <IntroCurtain />
      <div className="grain-overlay" aria-hidden="true" />
      <ScrollProgress />
      <CursorGlow />
      <CircuitBackground />

      {/* Content flows above the fixed canvas */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Hero />
        <Marquee />
        <About />
        <Ventures />
        <Cube3D />
        <Arsenal />
        <Playground />
        <Contact />
      </div>
    </main>
  );
}
