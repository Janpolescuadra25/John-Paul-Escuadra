"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { type MouseEvent, useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { INTRO_DONE_S } from "./intro-timing";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: INTRO_DONE_S - 0.8 } },
};
const item = {
  hidden: { y: 44, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const nameY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -56]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  // Mouse-driven 3D tilt for the portrait (desktop)
  const tiltRX = useMotionValue(0);
  const tiltRY = useMotionValue(0);
  const portraitRX = useSpring(tiltRX, { stiffness: 120, damping: 20 });
  const portraitRY = useSpring(tiltRY, { stiffness: 120, damping: 20 });

  const handlePortraitTilt = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltRY.set(px * 8);
    tiltRX.set(-py * 8);
  };
  const resetPortraitTilt = () => {
    tiltRX.set(0);
    tiltRY.set(0);
  };

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
      aria-label="Introduction"
    >
      {/* Vertical editorial sidebar note */}
      <div
        aria-hidden="true"
        className="absolute left-7 top-1/2 hidden -translate-y-1/2 items-center gap-4 xl:flex"
      >
        <span className="font-body text-[11px] font-semibold tracking-[0.45em] text-ink-soft [writing-mode:vertical-rl]">
          PORTFOLIO — MMXXVI
        </span>
        <span className="h-16 w-px bg-ink/15" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-24 pt-28 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6 lg:pb-16 lg:pt-16">
        {/* ============ LEFT: editorial text ============ */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ y: nameY, opacity: nameOpacity }}
          className="order-2 lg:order-1"
        >
          <motion.div
            variants={item}
            className="mb-7 inline-flex items-center gap-3 font-body text-sm font-semibold tracking-[0.42em] text-ink-soft md:text-base"
          >
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            FULLSTACK DEVELOPER · FOUNDER
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-[13vw] font-bold leading-[0.98] tracking-tight text-ink sm:text-7xl md:text-8xl xl:text-[6.2rem]"
          >
            John Paul
            <span className="block font-semibold italic text-emerald-deep">
              Escuadra
            </span>
          </motion.h1>

          <motion.div
            variants={item}
            className="mt-7 flex items-center gap-4"
            aria-label="Founder, developer, creator"
          >
            <span className="h-px w-10 bg-emerald" />
            <p className="font-body text-base font-semibold tracking-[0.3em] text-ink-soft md:text-lg">
              FOUNDER × DEVELOPER × CREATOR
            </p>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl font-body text-xl leading-relaxed text-ink-soft md:text-[22px]"
          >
            I turn ideas into running products — the kind with real users,
            real data, and real deadlines. I&apos;m a software developer at
            the core: founder of{" "}
            <a
              href="https://haypbooks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-semibold text-ink"
            >
              HaypBooks
            </a>{" "}
            and <span className="font-semibold text-ink">V.Studio</span> —
            the home of all my software: every app I ship, every update,
            and every new release as it lands.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#ventures"
              className="btn-sheen group inline-flex items-center gap-3 rounded-full bg-navy px-8 py-4 font-body text-sm font-semibold tracking-[0.22em] text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-navy-deep hover:lux-shadow-emerald"
            >
              VIEW THE WORK
              <ArrowDown
                className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href="https://haypbooks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-white/60 px-8 py-4 font-body text-sm font-semibold tracking-[0.22em] text-ink backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-emerald/50 hover:text-emerald-deep hover:lux-shadow"
            >
              HAYPBOOKS.COM
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </motion.div>

          {/* Stats strip — hairline, serif numerals */}
          <motion.div
            variants={item}
            className="mt-14 grid max-w-xl grid-cols-3 divide-x divide-ink/10 border-y border-ink/10"
          >
            {[
              { v: "100%", l: "SELF-BUILT" },
              { v: "02", l: "VENTURES FOUNDED" },
              { v: "03", l: "GAME ENGINES" },
            ].map((s) => (
              <div key={s.l} className="px-5 py-5 first:pl-0">
                <div className="font-display text-4xl font-bold text-emerald-deep md:text-5xl">
                  {s.v}
                </div>
                <div className="mt-1.5 font-body text-[13px] font-semibold tracking-[0.18em] text-ink-soft md:text-sm">
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ============ RIGHT: arched portrait ============ */}
        <motion.div
          style={{
            y: photoY,
            scale: photoScale,
            rotateX: portraitRX,
            rotateY: portraitRY,
            transformPerspective: 1000,
          }}
          onMouseMove={handlePortraitTilt}
          onMouseLeave={resetPortraitTilt}
          className="relative order-1 mx-auto w-[min(76vw,400px)] lg:order-2"
          aria-label="Portrait of John Paul Escuadra"
        >
          {/* Orbit rings */}
          <div
            aria-hidden="true"
            className="animate-spin-slow absolute left-1/2 top-1/2 -z-10 h-[108%] w-[108%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald/25"
          />
          <div
            aria-hidden="true"
            className="animate-spin-slower absolute left-1/2 top-1/2 -z-10 h-[122%] w-[122%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/10"
          />

          {/* Emerald aura behind the arch */}
          <div
            aria-hidden="true"
            className="absolute inset-x-8 bottom-0 -z-10 h-2/3 rounded-full bg-emerald/20 blur-3xl"
          />

          {/* Arched portrait card */}
          <motion.div
            initial={{ opacity: 0, y: 56, filter: "blur(8px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { delay: INTRO_DONE_S - 0.7, duration: 1.05, ease: [0.22, 1, 0.36, 1] },
            }}
            className="animate-float-soft relative overflow-hidden rounded-t-full border-[6px] border-white bg-white lux-shadow"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-full">
              <Image
                src="/images/profile-cutout.png"
                alt="John Paul Escuadra — formal portrait"
                fill
                priority
                sizes="(max-width: 1024px) 76vw, 400px"
                className="object-cover object-top"
              />
              {/* Luminous ad-style sheen */}
              <div
                aria-hidden="true"
                className="animate-sheen absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent"
              />
              {/* Bottom fade into card */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy/25 to-transparent"
              />
              {/* Nameplate */}
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-gradient-to-t from-navy/70 to-transparent px-5 pb-4 pt-10">
                <span className="font-body text-xs font-semibold tracking-[0.4em] text-white">
                  JPE — 001
                </span>
                <span className="flex items-center gap-1.5 font-body text-xs font-semibold tracking-[0.3em] text-white">
                  <span className="h-1 w-1 animate-pulse-soft rounded-full bg-emerald" />
                  AVAILABLE
                </span>
              </div>
            </div>
          </motion.div>

          {/* Floating credential tags — compact Animus chips, chamfered */}
          <motion.div
            initial={{ opacity: 0, x: -26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: INTRO_DONE_S, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -left-4 top-[22%] hidden rounded-full bg-white/95 px-2.5 py-1 font-body text-[9px] font-semibold tracking-[0.2em] text-ink-soft shadow-[0_6px_18px_-12px_rgba(10,37,64,0.4)] backdrop-blur md:block lg:-left-10"
          >
            <span className="mr-1 inline-block h-1 w-1 rotate-45 bg-gold" />
            SOFTWARE <span className="text-emerald-deep">DEVELOPER</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: INTRO_DONE_S + 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -right-3 top-[52%] hidden rounded-full bg-white/95 px-2.5 py-1 font-body text-[9px] font-semibold tracking-[0.2em] text-ink-soft shadow-[0_6px_18px_-12px_rgba(10,37,64,0.4)] backdrop-blur md:block lg:-right-8"
          >
            <span className="mr-1 inline-block h-1 w-1 rotate-45 bg-gold" />
            FULLSTACK <span className="text-emerald-deep">BUILDER</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: INTRO_DONE_S + 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -left-3 bottom-[16%] hidden rounded-full bg-white/95 px-2.5 py-1 font-body text-[9px] font-semibold tracking-[0.2em] text-ink-soft shadow-[0_6px_18px_-12px_rgba(10,37,64,0.4)] backdrop-blur md:block lg:-left-8"
          >
            <span className="mr-1 inline-block h-1 w-1 rotate-45 bg-gold" />
            ALWAYS <span className="text-emerald-deep">SHIPPING</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator — hairline with travelling dot */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: INTRO_DONE_S + 0.8, duration: 0.8 }}
        style={{ opacity: nameOpacity }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="font-body text-xs font-semibold tracking-[0.5em] text-ink-soft">
          SCROLL
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-ink/10">
          <span className="animate-scroll-dot absolute left-[-1.5px] top-0 h-1.5 w-1 rounded-full bg-emerald" />
        </span>
        <ArrowDown className="h-3.5 w-3.5 text-ink-soft/50" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
