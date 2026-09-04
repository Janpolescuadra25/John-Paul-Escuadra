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
    const duration = 1500;
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
  { name: "Accounting & Finance", level: 92, tag: "4 YEARS" },
  { name: "3D Modeling — Blender", level: 88, tag: "EXPERT" },
  { name: "Video Editing", level: 82, tag: "1 YR+" },
  { name: "Game Development", level: 85, tag: "PASSION" },
];

export default function About() {
  return (
    <DepthSection
      id="about"
      className="py-24 md:py-36"
      innerClassName="mx-auto max-w-7xl px-6 md:px-10"
      ariaLabel="About John Paul Escuadra"
    >
      <SectionHeading
        index="01"
        title="The Profile"
        subtitle="The human behind the work"
      />

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        {/* ============ PORTRAIT CARD ============ */}
        <motion.div
          initial={{ opacity: 0, x: -46 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="lux-shadow relative overflow-hidden rounded-2xl border border-ink/5 bg-white p-7 md:p-9"
        >
          <div className="flex items-start justify-between border-b border-ink/10 pb-6">
            <div>
              <p className="font-body text-[10px] tracking-[0.4em] text-ink-soft">
                PROFILE
              </p>
              <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                John Paul Escuadra
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="rounded-full bg-navy px-3.5 py-1.5 font-body text-[9px] font-semibold tracking-[0.25em] text-white">
                FOUNDER
              </span>
              <span className="font-body text-[10px] tracking-[0.3em] text-ink-soft">
                Nº JPE-001
              </span>
            </div>
          </div>

          <div className="mt-7 flex gap-6">
            <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-t-full border border-ink/10 md:h-48 md:w-36">
              <Image
                src="/images/profile-card.jpg"
                alt="John Paul Escuadra portrait"
                fill
                sizes="150px"
                className="object-cover object-top"
              />
              <div
                aria-hidden="true"
                className="animate-sheen absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </div>

            <div className="min-w-0 space-y-2.5 font-body text-[13px] leading-relaxed text-ink-soft">
              <p>
                <span className="text-ink/40">ROLE</span>{" "}
                <span className="font-medium text-ink">Fullstack Developer</span>
              </p>
              <p>
                <span className="text-ink/40">HOUSE</span>{" "}
                <span className="font-medium text-ink">
                  HaypBooks · V.Studio
                </span>
              </p>
              <p>
                <span className="text-ink/40">FIELD</span>{" "}
                <span className="font-medium text-ink">
                  Accounting — 4 years on the front lines
                </span>
              </p>
              <p>
                <span className="text-ink/40">CRAFT</span>{" "}
                <span className="font-medium text-ink">
                  3D worlds · video edits · personal games
                </span>
              </p>
              <p>
                <span className="text-ink/40">STATUS</span>{" "}
                <span className="inline-flex items-center gap-2 font-medium text-emerald-deep">
                  <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald" />
                  Building
                </span>
              </p>
            </div>
          </div>

          <p className="mt-8 border-t border-ink/10 pt-7 font-body text-sm leading-relaxed text-ink-soft md:text-[15px]">
            I started inside the numbers — four years deep in accounting,
            where one wrong cell ruins a whole week. That discipline now fuels
            everything I build: software that treats your business like it
            matters, and creative work that treats every frame like it counts.
          </p>
        </motion.div>

        {/* ============ STATS + BARS ============ */}
        <div className="flex flex-col gap-10">
          {/* Counter stats */}
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group rounded-2xl border border-ink/5 bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:border-emerald/30 hover:lux-shadow"
              >
                <div className="font-display text-4xl font-semibold text-ink transition-colors duration-500 group-hover:text-emerald-deep md:text-5xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2.5 font-body text-[11px] leading-snug tracking-wide text-ink-soft">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Skill bars */}
          <motion.div
            initial={{ opacity: 0, x: 46 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lux-shadow flex-1 rounded-2xl border border-ink/5 bg-white p-7 md:p-9"
          >
            <p className="mb-8 font-body text-[10px] tracking-[0.4em] text-ink-soft">
              THE CAPABILITIES
            </p>
            <div className="space-y-7">
              {SKILL_BARS.map((bar, i) => (
                <div key={bar.name}>
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="font-body text-sm font-medium text-ink">
                      {bar.name}
                    </span>
                    <span className="font-body text-[10px] font-semibold tracking-[0.25em] text-emerald-deep/80">
                      {bar.tag}
                    </span>
                  </div>
                  <div className="h-[6px] w-full overflow-hidden rounded-full bg-ink/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.level}%` }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 1.4,
                        delay: 0.15 + i * 0.12,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="bar-shine h-full rounded-full bg-gradient-to-r from-emerald-deep via-emerald to-[#35d69a]"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 font-body text-xs leading-relaxed text-ink-soft/80">
              Earned the long way — real clients, real books, real deadlines.
            </p>
          </motion.div>
        </div>
      </div>
    </DepthSection>
  );
}
