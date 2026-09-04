"use client";

import { motion } from "framer-motion";

/** SectionHeading — numbered chapter heading with masked reveal. */
export function SectionHeading({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        <span className="font-display text-sm font-bold tracking-[0.3em] text-[#c9f73a]">
          {index}
        </span>
        <span className="h-px w-12 bg-gradient-to-r from-[#c9f73a]/60 to-transparent" />
        <span className="font-body text-[10px] tracking-[0.35em] text-zinc-500 md:text-xs">
          {subtitle.toUpperCase()}
        </span>
      </div>

      <div className="mt-4 overflow-hidden">
        <motion.h2
          initial={{ y: "110%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl font-bold tracking-tight text-zinc-100 md:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h2>
      </div>

      {/* Giant ghost number */}
      <span
        aria-hidden="true"
        className="text-outline-white pointer-events-none absolute -top-8 right-0 select-none font-display text-[7rem] font-bold leading-none opacity-35 md:text-[9rem]"
      >
        {index}
      </span>
    </div>
  );
}
