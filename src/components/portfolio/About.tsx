"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "./SectionHeading";
import DepthSection from "./DepthSection";

/** Count-up number when in view */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

const STATS = [
  { value: 4, suffix: "+", label: "Years in the accounting field" },
  { value: 2, suffix: "", label: "Companies founded from zero" },
  { value: 3, suffix: "", label: "Game engines he builds worlds in" },
  { value: 100, suffix: "%", label: "Self-driven, idea to shipped" },
];

const SKILL_BARS = [
  { name: "Fullstack Development", level: 95, tag: "CORE" },
  { name: "Accounting & Finance", level: 92, tag: "LVL 04" },
  { name: "3D Modeling — Blender", level: 88, tag: "EXPERT" },
  { name: "Video Editing", level: 82, tag: "1 YR+" },
  { name: "Game Development", level: 85, tag: "PASSION" },
];

export default function About() {
  return (
    <DepthSection
      id="about"
      className="py-24 md:py-32"
      innerClassName="mx-auto max-w-7xl px-6 md:px-10"
      ariaLabel="About John Paul Escuadra"
    >
      <SectionHeading
        index="01"
        title="PLAYER PROFILE"
        subtitle="The human behind the commits"
      />

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* ============ ID CARD ============ */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="gradient-border relative overflow-hidden rounded-md bg-[#101013] p-6 md:p-8"
        >
          <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-5">
            <div>
              <p className="font-body text-[10px] tracking-[0.35em] text-zinc-500">
                PROFILE CARD
              </p>
              <p className="mt-1 font-display text-xl font-bold text-zinc-100">
                JOHN PAUL ESCUADRA
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="rounded-sm bg-[#c9f73a] px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.2em] text-[#09090b]">
                FOUNDER CLASS
              </span>
              <span className="font-body text-[10px] tracking-[0.25em] text-zinc-500">
                ID · JPE-001
              </span>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="hud-frame relative h-36 w-28 shrink-0 overflow-hidden rounded-sm border border-zinc-800 sm:h-44 sm:w-32">
              <Image
                src="/images/profile-card.jpg"
                alt="John Paul Escuadra portrait"
                fill
                sizes="140px"
                className="object-cover object-top"
              />
              <div
                aria-hidden="true"
                className="absolute left-0 h-16 w-full bg-gradient-to-b from-transparent via-[#c9f73a]/12 to-transparent"
                style={{ animation: "scan-sweep 6s ease-in-out infinite" }}
              />
            </div>

            <div className="min-w-0 space-y-2.5 font-body text-[13px] leading-relaxed text-zinc-400">
              <p>
                <span className="text-zinc-600">ROLE /</span>{" "}
                <span className="text-zinc-200">Fullstack Developer</span>
              </p>
              <p>
                <span className="text-zinc-600">GUILDS /</span>{" "}
                <span className="text-zinc-200">
                  HaypBooks · V.Studio
                </span>
              </p>
              <p>
                <span className="text-zinc-600">FIELD /</span>{" "}
                <span className="text-zinc-200">
                  Accounting — 4 years on the front lines
                </span>
              </p>
              <p>
                <span className="text-zinc-600">SIDE QUESTS /</span>{" "}
                <span className="text-zinc-200">
                  3D worlds · video edits · personal games
                </span>
              </p>
              <p>
                <span className="text-zinc-600">STATUS /</span>{" "}
                <span className="inline-flex items-center gap-2 text-[#c9f73a]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c9f73a]" />
                  Building
                </span>
              </p>
            </div>
          </div>

          <p className="mt-7 border-t border-zinc-800 pt-6 font-body text-sm leading-relaxed text-zinc-400 md:text-[15px]">
            I started inside the numbers — four years deep in accounting,
            where one wrong cell ruins a whole week. That discipline now fuels
            everything I build: software that treats your business like it
            matters, and creative work that treats every frame like it counts.
          </p>
        </motion.div>

        {/* ============ STATS + BARS ============ */}
        <div className="flex flex-col gap-8">
          {/* Counter stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="group rounded-md border border-zinc-800 bg-[#101013] p-4 transition-colors duration-300 hover:border-[#c9f73a]/40"
              >
                <div className="font-display text-3xl font-bold text-zinc-100 transition-colors group-hover:text-[#c9f73a] md:text-4xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 font-body text-[11px] leading-snug tracking-wide text-zinc-500">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Skill bars */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 rounded-md border border-zinc-800 bg-[#101013] p-6 md:p-8"
          >
            <p className="mb-6 font-body text-[10px] tracking-[0.35em] text-zinc-500">
              ABILITY LOADOUT
            </p>
            <div className="space-y-6">
              {SKILL_BARS.map((bar, i) => (
                <div key={bar.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-body text-sm text-zinc-300">
                      {bar.name}
                    </span>
                    <span className="font-display text-[10px] font-semibold tracking-[0.2em] text-[#c9f73a]/80">
                      {bar.tag}
                    </span>
                  </div>
                  <div className="h-[7px] w-full overflow-hidden rounded-full bg-zinc-800/80">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.level}%` }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 1.3,
                        delay: 0.15 + i * 0.12,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="bar-shine h-full rounded-full bg-gradient-to-r from-[#7ba312] via-[#c9f73a] to-[#e8ff8a]"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-7 font-body text-xs leading-relaxed text-zinc-600">
              Levels earned the long way — real clients, real books, real
              deadlines.
            </p>
          </motion.div>
        </div>
      </div>
    </DepthSection>
  );
}
