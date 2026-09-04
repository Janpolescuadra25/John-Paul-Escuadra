"use client";

import { motion } from "framer-motion";
import { Boxes, Flame, Gamepad2, Globe, Heart, Lock } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import DepthSection from "./DepthSection";

const ENGINES = [
  {
    name: "Unity",
    tag: "FAST PROTOTYPES",
    desc: "Where quick ideas become playable in days. My sandbox for mechanics and experiments.",
    icon: Gamepad2,
  },
  {
    name: "Unreal Engine",
    tag: "CINEMATIC WORLDS",
    desc: "For the builds that deserve atmosphere, lighting, and that next-gen feel.",
    icon: Globe,
  },
  {
    name: "Godot",
    tag: "OPEN & LIGHT",
    desc: "The engine I reach for when I just want to make something pure, from scratch, my way.",
    icon: Flame,
  },
];

const BADGES = [
  { icon: Lock, label: "BUILT FOR MYSELF" },
  { icon: Heart, label: "ZERO PUBLICITY" },
  { icon: Boxes, label: "100% FOR FUN" },
];

export default function Playground() {
  return (
    <DepthSection
      id="playground"
      className="overflow-hidden py-24 md:py-36"
      innerClassName="relative mx-auto max-w-7xl px-6 md:px-10"
      ariaLabel="Personal game development"
    >
      {/* Ambient mint wash */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/[0.07] blur-[130px]"
      />

      <SectionHeading
        index="05"
        title="After Hours"
        subtitle="What I build when nobody's watching"
      />

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-lg"
        >
          <p className="font-body text-base leading-relaxed text-ink-soft md:text-lg">
            After the workday ends, a different screen turns on. I build my
            own games — worlds, systems, characters — purely for the fun of
            it. No launch dates, no audience, no pressure.
          </p>
          <p className="mt-5 font-body text-base leading-relaxed text-ink-soft md:text-lg">
            Some things you make just because making them feels good. These
            games will never be sold or shown — and honestly, that freedom
            is exactly what makes them the best projects I&apos;ve ever
            worked on.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {BADGES.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-2 rounded-full border border-emerald/25 bg-white px-4 py-2 font-body text-[10px] tracking-[0.25em] text-emerald-deep lux-shadow"
              >
                <b.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {b.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Engine cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {ENGINES.map((e, i) => (
            <motion.article
              key={e.name}
              initial={{ opacity: 0, y: 52 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -8 }}
              className="group lux-shadow relative overflow-hidden rounded-2xl border border-ink/5 bg-white p-7"
              data-cursor
            >
              <div
                aria-hidden="true"
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald/[0.06] blur-2xl transition-all duration-700 group-hover:bg-emerald/[0.16]"
              />
              <div className="flex items-center justify-between">
                <e.icon
                  className="h-8 w-8 text-emerald-deep transition-transform duration-500 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="font-display text-5xl font-semibold italic leading-none text-ink/[0.08]">
                  {String(i + 1)}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink">
                {e.name}
              </h3>
              <p className="mt-2 font-body text-[10px] font-semibold tracking-[0.3em] text-emerald-deep/80">
                {e.tag}
              </p>
              <p className="mt-4 font-body text-[13px] leading-relaxed text-ink-soft">
                {e.desc}
              </p>
              <div className="mt-6 h-[2px] w-full bg-ink/[0.06]">
                <div className="h-full w-0 bg-gradient-to-r from-emerald-deep to-emerald transition-all duration-700 group-hover:w-full" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </DepthSection>
  );
}
