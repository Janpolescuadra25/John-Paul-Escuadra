"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — an emerald hairline that fills as you travel the page.
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
      className="fixed inset-x-0 top-0 z-[60] h-[2.5px] origin-left bg-gradient-to-r from-emerald-deep via-emerald to-[#35d69a]"
      style={{ scaleX }}
    />
  );
}
