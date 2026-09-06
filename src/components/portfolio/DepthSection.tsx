"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

/**
 * DepthSection — wraps a section in the Animus scroll experience.
 *
 * 1. ENTER (once per session): the section materializes like a memory
 *    syncing — a top-down clip-path wipe with a rise — while a gold
 *    hairline with a diamond head draws itself across the section's top
 *    edge, the Assassin's Creed menu-divider signature.
 * 2. TRAVEL (every scroll, both directions): the section eases through a
 *    subtle rotateX tilt, scale and fade — a cinematic "settle into
 *    place" motion. Transform + opacity only (GPU friendly).
 */
export default function DepthSection({
  id,
  children,
  className = "",
  innerClassName = "",
  ariaLabel,
  fill = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  ariaLabel?: string;
  fill?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.45, 1], [5, 0, -4]);
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.965, 1, 0.98]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [0.55, 1, 1, 0.55]
  );
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [48, 0, -36]);

  return (
    <section
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      className={`relative z-10 ${className}`}
    >
      {/* Animus hairline — gilds the section's top edge as it materializes */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-16% 0px" }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 top-0 z-20 origin-left"
      >
        <div className="flex items-center">
          <span className="ml-6 h-[5px] w-[5px] shrink-0 rotate-45 bg-gold" />
          <span className="h-px flex-1 bg-gradient-to-r from-gold/60 via-gold/25 to-transparent" />
        </div>
      </motion.div>

      {/* the memory materializes: top-down clip wipe + rise */}
      <motion.div
        initial={{ opacity: 0, y: 42, clipPath: "inset(0% 0% 90% 0%)" }}
        whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        className={`flex flex-col ${fill ? "flex-1" : ""}`}
      >
        <motion.div
          style={{ rotateX, scale, opacity, y, transformPerspective: 1600 }}
          className={innerClassName}
        >
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}
