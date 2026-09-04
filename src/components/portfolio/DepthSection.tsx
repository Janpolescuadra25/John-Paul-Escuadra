"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

/**
 * DepthSection — wraps a section in scroll-linked 3D depth.
 * As the section travels through the viewport it tilts (rotateX),
 * scales and fades — creating a "flying through space" transition
 * on every scroll, both directions. Transform + opacity only
 * (GPU friendly).
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

  const rotateX = useTransform(scrollYProgress, [0, 0.45, 1], [9, 0, -7]);
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.95, 1, 0.965]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.35, 1, 1, 0.35]
  );
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -40]);

  return (
    <section
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      className={`relative z-10 ${className}`}
    >
      <motion.div
        style={{ rotateX, scale, opacity, y, transformPerspective: 1400 }}
        className={innerClassName}
      >
        {children}
      </motion.div>
    </section>
  );
}
