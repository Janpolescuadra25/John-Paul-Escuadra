"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * ScrollProgress — the Animus synchronization bar. A segmented hairline
 * track fills with emerald as you travel the page, led by a small gold
 * diamond riding the wavefront — the sync meter of the creed's HUD.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // the diamond rides the leading edge of the fill
  const tipLeft = useTransform(
    scaleX,
    (v) =>
      `calc(${(Math.min(1, Math.max(0, v)) * 100).toFixed(3)}% - 3px)`
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[6px]"
    >
      {/* segmented track */}
      <div className="sync-track absolute inset-x-0 top-[1px] h-[3px]" />
      {/* emerald sync fill, clipped to the same segments */}
      <motion.div
        className="sync-fill absolute inset-x-0 top-[1px] h-[3px] origin-left bg-gradient-to-r from-emerald-deep via-emerald to-gold"
        style={{ scaleX }}
      />
      {/* leading gold diamond */}
      <motion.span
        style={{ left: tipLeft }}
        className="absolute top-0 block h-[5px] w-[5px] rotate-45 bg-gold shadow-[0_0_6px_rgba(184,147,62,0.9)]"
      />
    </div>
  );
}
