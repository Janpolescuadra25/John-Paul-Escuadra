"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

/**
 * DepthSection — wraps a section in gentle scroll-linked 3D depth.
 * As the section travels through the viewport it eases through a subtle
 * rotateX tilt, scale and fade — a cinematic "settle into place" motion
 * on every scroll, both directions. Transform + opacity only (GPU friendly).
 */
export default function DepthSection({
  id,
  children,
  className = "",
  innerClassName = "",
  ariaLabel,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  ariaLabel?: string;
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
    [0.5, 1, 1, 0.5]
  );
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [48, 0, -36]);

  return (
    <section
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      className={`relative z-10 ${className}`}
    >
      <motion.div
        style={{ rotateX, scale, opacity, y, transformPerspective: 1600 }}
        className={innerClassName}
      >
        {children}
      </motion.div>
    </section>
  );
}
