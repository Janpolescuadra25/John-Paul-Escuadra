"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useState } from "react";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * ScrollProgress — one straight, continuous line. A soft full-width
 * hairline track carries an emerald→gold fill that travels edge-to-edge
 * with the page journey, led by a single small gold diamond. No
 * segments, no dashes, no words — just the line.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // aria only — the visuals stay wordless
  const [pct, setPct] = useState(0);
  useMotionValueEvent(smooth, "change", (v) => {
    setPct(Math.round(clamp01(v) * 100));
  });

  // the diamond rides the leading edge of the fill
  const tipLeft = useTransform(
    smooth,
    (v) => `calc(${(clamp01(v) * 100).toFixed(3)}% - 2.5px)`
  );

  return (
    <motion.div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.6, duration: 0.7 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[7px]"
    >
      {/* continuous soft track — one unbroken hairline */}
      <div className="absolute inset-x-0 top-[2px] h-[3px] rounded-full bg-ink/[0.07]" />

      {/* continuous fill — smooth gradient, edge to edge */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 top-[2px] h-[3px] w-full origin-left bg-gradient-to-r from-emerald-deep via-emerald to-gold"
        style={{ scaleX: smooth }}
      />

      {/* single leading gold diamond */}
      <motion.span
        aria-hidden="true"
        style={{ left: tipLeft }}
        className="absolute top-[1px] block h-[5px] w-[5px] rotate-45 bg-gold shadow-[0_0_8px_rgba(184,147,62,0.85)]"
      />
    </motion.div>
  );
}
