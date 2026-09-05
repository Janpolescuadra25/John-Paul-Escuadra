"use client";

import { motion } from "framer-motion";

/**
 * SectionHeading — editorial chapter heading.
 * Numbered like a magazine feature, serif title with masked rise reveal,
 * ghost outline numeral floating behind.
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
      <div className="flex items-center gap-4">
        <span
          className={`font-display text-sm font-semibold tracking-[0.3em] ${
            dark ? "text-emerald" : "text-emerald-deep"
          }`}
        >
          {index}
        </span>
        <span
          className={`h-px w-14 ${
            dark
              ? "bg-gradient-to-r from-emerald/60 to-transparent"
              : "bg-gradient-to-r from-ink/25 to-transparent"
          }`}
        />
        <span
          className={`font-body text-xs font-semibold tracking-[0.35em] md:text-[13px] ${
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
          className={`font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl ${
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
