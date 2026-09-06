"use client";

import { motion } from "framer-motion";

/**
 * SectionHeading — Animus chapter heading, Assassin's Creed menu format:
 * a chamfered "SEQ." sequence tag, a gold diamond on a hairline divider,
 * spaced-caps subtitle, then the serif title with masked rise reveal and
 * the ghost numeral floating behind.
 */
export function SectionHeading({
  index,
  title,
  subtitle,
  dark = false,
}: {
  index: string;
  title: string;
  subtitle: string;
  dark?: boolean;
}) {
  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <span
          className={`chamfer-tag px-3.5 py-1.5 font-body text-[11px] font-semibold tracking-[0.3em] text-white ${
            dark ? "bg-emerald" : "bg-navy"
          }`}
        >
          SEQ. {index}
        </span>
        <span className="flex items-center gap-2" aria-hidden="true">
          <span
            className={`h-px w-8 ${dark ? "bg-white/25" : "bg-ink/25"}`}
          />
          <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
          <span
            className={`h-px w-8 ${dark ? "bg-white/25" : "bg-ink/25"}`}
          />
        </span>
        <span
          className={`font-body text-[13px] font-semibold tracking-[0.35em] md:text-sm ${
            dark ? "text-white/70" : "text-ink-soft"
          }`}
        >
          {subtitle.toUpperCase()}
        </span>
      </div>

      <div className="mt-4 overflow-hidden">
        <motion.h2
          initial={{ y: "110%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className={`font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </motion.h2>
      </div>

      {/* Giant ghost numeral — kept faint so it never fights the title */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-10 right-0 select-none font-display text-[7rem] font-semibold leading-none opacity-25 md:text-[9rem] ${
          dark ? "text-outline-white" : "text-outline-navy"
        }`}
      >
        {index}
      </span>
    </div>
  );
}
