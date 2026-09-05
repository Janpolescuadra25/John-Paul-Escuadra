"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const WORDS = [
  "Software Developer",
  "Fullstack Builder",
  "Founder",
  "Product Maker",
  "Game Builder",
  "Problem Solver",
  "System Thinker",
];

/**
 * Marquee — a navy brand-ticker band. Serif titles glide past emerald
 * diamonds; the strip skews subtly with scroll velocity.
 */
export default function Marquee() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const skewX = useTransform(smooth, [-1600, 0, 1600], [-2.5, 0, 2.5]);

  const row = [...WORDS, ...WORDS];
  return (
    <div
      className="relative z-10 border-y border-white/10 bg-navy py-6"
      aria-hidden="true"
    >
      <motion.div style={{ skewX }}>
        <div className="flex w-max animate-marquee-left items-center gap-12 whitespace-nowrap">
          {row.map((w, i) => (
            <span
              key={`l-${i}`}
              className="flex items-center gap-12 font-display text-2xl font-semibold italic tracking-wide text-white"
            >
              {w}
              <span className="not-italic text-sm text-gold">✦</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
