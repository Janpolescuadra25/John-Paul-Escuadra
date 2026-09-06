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
  { value: 0, suffix: "", label: "Handoffs — one owner, whole stack" },
  { value: 2, suffix: "", label: "Companies founded from zero" },
  { value: 3, suffix: "", label: "Game engines he builds worlds in" },
  { value: 100, suffix: "%", label: "Self-driven, idea to shipped" },
];

const SKILL_BARS = [
  { name: "Fullstack Development", level: 95, tag: "CORE" },
  { name: "Software Architecture", level: 90, tag: "SYSTEMS" },
  { name: "Interface & Product Design", level: 88, tag: "CRAFT" },
  { name: "APIs, Data & Integrations", level: 87, tag: "ENGINE" },
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
              <p className="font-body text-xs font-semibold tracking-[0.35em] text-ink-soft">
                PROFILE
              </p>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
                John Paul Escuadra
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="chamfer-tag bg-navy px-3.5 py-1.5 font-body text-[11px] font-semibold tracking-[0.25em] text-white">
                FOUNDER
              </span>
              <span className="font-body text-xs font-medium tracking-[0.28em] text-ink-soft">
                Nº JPE-001
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-7 sm:flex-row sm:items-start">
            <div className="relative h-44 w-36 shrink-0 overflow-hidden rounded-t-full border border-ink/10 md:h-52 md:w-40">
              <Image
                src="/images/profile-card.jpg"
                alt="John Paul Escuadra portrait"
                fill
                sizes="160px"
                className="object-cover object-top"
              />
              <div
                aria-hidden="true"
                className="animate-sheen absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </div>

            <p className="min-w-0 font-body text-[17px] leading-relaxed text-ink-soft md:text-lg">
              Software developer, through and through. I build products the
              whole way — the architecture underneath, the interface on top,
              and every deploy in between. Two companies founded from zero,
              one flagship suite live in production. I&apos;m also a certified
              bookkeeper — I passed the Bookkeeping NC III, with years of
              experience working in an accounting firm — so the numbers
              behind a business are as familiar to me as the code in front
              of it. The discipline is simple: treat every screen like it
              matters, and every line like it lasts.
            </p>
          </div>
        </motion.div>

        {/* ============ STATS + BARS ============ */}
        <div className="flex flex-col gap-10">
          {/* Counter stats */}
          <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group chamfer min-w-0 border border-ink/5 bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:border-emerald/30 hover:lux-shadow"
              >
                <div className="font-display text-4xl font-bold text-ink transition-colors duration-500 group-hover:text-emerald-deep md:text-5xl">
                  <Counter to={s.value} />
                  {s.suffix && (
                    <span className="text-2xl text-emerald-deep md:text-3xl">
                      {s.suffix}
                    </span>
                  )}
                </div>
                <div className="mt-2.5 font-body text-sm font-semibold leading-snug text-ink-soft">
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
            <p className="mb-8 font-body text-xs font-semibold tracking-[0.35em] text-ink-soft">
              THE CAPABILITIES
            </p>
            <div className="space-y-7">
              {SKILL_BARS.map((bar, i) => (
                <div key={bar.name}>
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="font-body text-base font-semibold text-ink">
                      {bar.name}
                    </span>
                    <span className="font-body text-xs font-semibold tracking-[0.22em] text-emerald-deep">
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
            <p className="mt-8 font-body text-[15px] leading-relaxed text-ink-soft">
              Earned the long way — real users, real deadlines, real products
              in production.
            </p>
          </motion.div>
        </div>
      </div>
    </DepthSection>
  );
}
