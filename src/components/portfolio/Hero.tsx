"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowDown, ExternalLink, Sparkles } from "lucide-react";

/** Scramble-in text effect */
function useScramble(text: string, delay = 900, speed = 40) {
  const [out, setOut] = useState(text.replace(/[^\s]/g, " "));
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01#$%&*/<>";
    let frame = 0;
    let timer: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        frame++;
        const reveal = Math.floor(frame * 0.9);
        setOut(
          text
            .split("")
            .map((c, i) => {
              if (c === " ") return " ";
              if (i < reveal) return c;
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        if (reveal >= text.length) {
          setOut(text);
          clearInterval(timer);
        }
      }, speed);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [text, delay, speed]);
  return out;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 2.0 } },
};
const item = {
  hidden: { y: 40, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const nameY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const scramble = useScramble("FOUNDER × DEVELOPER × CREATOR");

  // Mouse-driven 3D tilt for the portrait (desktop)
  const tiltRX = useMotionValue(0);
  const tiltRY = useMotionValue(0);
  const portraitRX = useSpring(tiltRX, { stiffness: 130, damping: 18 });
  const portraitRY = useSpring(tiltRY, { stiffness: 130, damping: 18 });

  const handlePortraitTilt = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltRY.set(px * 12);
    tiltRX.set(-py * 12);
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
      {/* Parallax grid bg + vignette */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0" aria-hidden="true">
        <div className="bg-hud-grid absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,transparent_0%,#09090b_100%)]" />
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-24 pt-28 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-4 lg:pb-16 lg:pt-16">
        {/* ============ LEFT: text ============ */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ y: nameY, opacity: nameOpacity }}
          className="order-2 lg:order-1"
        >
          <motion.div
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c9f73a]/30 bg-[#c9f73a]/5 px-4 py-1.5 font-body text-xs tracking-[0.25em] text-[#c9f73a]"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            FULLSTACK DEVELOPER · FOUNDER
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-[13vw] font-bold leading-[0.95] tracking-tight text-zinc-100 sm:text-6xl md:text-7xl xl:text-[5.2rem]"
          >
            <span
              className="glitch block"
              data-text="JOHN PAUL"
            >
              JOHN PAUL
            </span>
            <span
              className="glitch block text-outline"
              data-text="ESCUADRA"
            >
              ESCUADRA
            </span>
          </motion.h1>

          <motion.div
            variants={item}
            className="mt-5 font-body text-sm tracking-[0.35em] text-zinc-400 md:text-base"
            aria-label="Founder, developer, creator"
          >
            {scramble}
            <span className="animate-blink ml-1 inline-block h-4 w-[2px] translate-y-[3px] bg-[#c9f73a]" />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl font-body text-base leading-relaxed text-zinc-400 md:text-lg"
          >
            I turn ideas into running products — the kind with logins, ledgers,
            and dashboards. Founder of{" "}
            <a
              href="https://haypbooks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#c9f73a] underline decoration-[#c9f73a]/40 underline-offset-4 transition-colors hover:decoration-[#c9f73a]"
            >
              HaypBooks
            </a>{" "}
            and <span className="text-zinc-200">V.Studio</span>. Four years in
            the accounting field taught me how business really works — now I
            build the software that runs it.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#ventures"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-sm bg-[#c9f73a] px-8 py-4 font-display text-sm font-semibold tracking-[0.2em] text-[#09090b] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              VIEW MY WORK
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
            <a
              href="https://haypbooks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-zinc-700 px-8 py-4 font-display text-sm font-semibold tracking-[0.2em] text-zinc-300 transition-all duration-300 hover:border-[#c9f73a]/60 hover:text-[#c9f73a]"
            >
              HAYPBOOKS
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>

          {/* Hero stats strip */}
          <motion.div
            variants={item}
            className="mt-14 grid max-w-xl grid-cols-3 divide-x divide-zinc-800 border-y border-zinc-800"
          >
            {[
              { v: "4+", l: "YRS ACCOUNTING" },
              { v: "02", l: "COMPANIES FOUNDED" },
              { v: "03", l: "GAME ENGINES" },
            ].map((s) => (
              <div key={s.l} className="px-4 py-4 first:pl-0">
                <div className="font-display text-2xl font-bold text-[#c9f73a] md:text-3xl">
                  {s.v}
                </div>
                <div className="mt-1 font-body text-[10px] tracking-[0.18em] text-zinc-500 md:text-[11px]">
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ============ RIGHT: portrait ============ */}
        <motion.div
          style={{
            y: photoY,
            scale: photoScale,
            rotateX: portraitRX,
            rotateY: portraitRY,
            transformPerspective: 900,
          }}
          onMouseMove={handlePortraitTilt}
          onMouseLeave={resetPortraitTilt}
          className="relative order-1 mx-auto w-[min(78vw,420px)] lg:order-2 lg:w-full lg:max-w-[400px]"
          aria-label="Portrait of John Paul Escuadra"
        >
          {/* Rotating rings */}
          <div
            aria-hidden="true"
            className="animate-spin-slow absolute left-1/2 top-1/2 -z-10 h-[105%] w-[105%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#c9f73a]/20"
          />
          <div
            aria-hidden="true"
            className="animate-spin-slower absolute left-1/2 top-1/2 -z-10 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-800/60"
          />

          {/* Glow behind portrait */}
          <div
            aria-hidden="true"
            className="absolute inset-x-6 bottom-0 -z-10 h-2/3 rounded-full bg-[#c9f73a]/15 blur-3xl"
          />

          {/* Portrait card with HUD frame */}
          <motion.div
            initial={{ opacity: 0, y: 60, filter: "blur(6px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { delay: 2.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            }}
            className="hud-frame animate-float-soft relative overflow-hidden rounded-sm border border-zinc-800 bg-gradient-to-b from-zinc-900/40 to-[#09090b]"
          >
            <div className="scanlines relative aspect-[9/11] w-full">
              <Image
                src="/images/profile-cutout.png"
                alt="John Paul Escuadra — formal portrait"
                fill
                priority
                sizes="(max-width: 1024px) 78vw, 400px"
                className="object-cover object-top"
              />
              {/* Sweep light */}
              <div
                aria-hidden="true"
                className="absolute left-0 h-24 w-full bg-gradient-to-b from-transparent via-[#c9f73a]/14 to-transparent"
                style={{ animation: "scan-sweep 5.5s ease-in-out infinite" }}
              />
              {/* Bottom fade into page */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#09090b] to-transparent"
              />
              {/* ID tag on photo */}
              <div className="absolute bottom-3 left-3 z-10 rounded-sm border border-[#c9f73a]/30 bg-black/60 px-3 py-1.5 font-body text-[10px] tracking-[0.25em] text-[#c9f73a] backdrop-blur-sm">
                ID: JPE-001 · FOUNDER
              </div>
              <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-sm border border-zinc-700/60 bg-black/60 px-3 py-1.5 font-body text-[10px] tracking-[0.2em] text-zinc-400 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c9f73a]" />
                ONLINE
              </div>
            </div>
          </motion.div>

          {/* Floating chips */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.9, duration: 0.6 }}
            className="animate-pulse-glow absolute -left-4 top-[22%] hidden rounded-sm border border-[#c9f73a]/40 bg-[#0c0c0e]/90 px-3 py-2 font-body text-[10px] tracking-[0.15em] text-zinc-300 backdrop-blur md:block lg:-left-10"
          >
            4 YRS <span className="text-[#c9f73a]">ACCOUNTING</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.1, duration: 0.6 }}
            className="absolute -right-3 top-[48%] hidden rounded-sm border border-zinc-700 bg-[#0c0c0e]/90 px-3 py-2 font-body text-[10px] tracking-[0.15em] text-zinc-300 backdrop-blur md:block lg:-right-8"
          >
            BLENDER <span className="text-[#f5c542]">3D ARTIST</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.3, duration: 0.6 }}
            className="absolute -left-3 bottom-[18%] hidden rounded-sm border border-zinc-700 bg-[#0c0c0e]/90 px-3 py-2 font-body text-[10px] tracking-[0.15em] text-zinc-300 backdrop-blur md:block lg:-left-8"
          >
            VIDEO <span className="text-[#c9f73a]">EDITOR</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.6, duration: 0.8 }}
        style={{ opacity: nameOpacity }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-zinc-500 transition-colors hover:text-[#c9f73a]"
      >
        <span className="font-body text-[10px] tracking-[0.4em]">SCROLL</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  );
}
