"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — neon progress bar pinned to top, like a level meter.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[#c9f73a] via-[#e8ff8a] to-[#f5c542]"
      style={{ scaleX, boxShadow: "0 0 12px rgba(201,247,58,0.55)" }}
    />
  );
}
