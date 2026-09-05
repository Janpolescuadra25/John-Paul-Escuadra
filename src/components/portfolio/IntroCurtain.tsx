"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const NAME_1 = "John Paul";
const NAME_2 = "Escuadra";

/**
 * IntroCurtain — a cinematic, luxury-brand opening title.
 * 1. Serif name rises through a mask, emerald rule draws beneath it.
 * 2. The white screen splits like theatre curtains, revealing the site.
 * Plays once (~2.9s). Scroll is locked while visible.
 */
export default function IntroCurtain() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const raf = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(raf);
    }

    document.body.style.overflow = "hidden";
    const done = setTimeout(() => setVisible(false), 2150);

    return () => {
      document.body.style.overflow = "";
      clearTimeout(done);
    };
  }, []);

  useEffect(() => {
    if (!visible) document.body.style.overflow = "";
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[95]"
          exit={{ transition: { duration: 0.95, ease: [0.65, 0, 0.35, 1] } }}
          aria-hidden="true"
        >
          {/* ============ SPLIT PANELS ============ */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[50.5%] bg-white"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.95, ease: [0.65, 0, 0.35, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[50.5%] bg-white"
            exit={{ y: "100%" }}
            transition={{ duration: 0.95, ease: [0.65, 0, 0.35, 1] }}
          />
          {/* Hairline that stays at the seam until the split */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-px w-[min(420px,80vw)] -translate-x-1/2 -translate-y-1/2 bg-ink/15"
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* ============ CENTER TITLE ============ */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            exit={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
            transition={{ duration: 0.55, ease: "easeIn" }}
          >
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-body text-[11px] font-semibold tracking-[0.5em] text-ink-soft md:text-[13px]"
            >
              PORTFOLIO
            </motion.p>

            <div className="mt-5 overflow-hidden">
              <motion.h1
                initial={{ y: "112%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[11vw] font-bold leading-[0.98] tracking-tight text-ink sm:text-6xl md:text-7xl"
              >
                {NAME_1}{" "}
                <span className="italic font-semibold text-emerald-deep">
                  {NAME_2}
                </span>
              </motion.h1>
            </div>

            {/* Emerald rule draws outward */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.05, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 h-[2px] w-[min(180px,42vw)] origin-center bg-emerald"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.35, duration: 0.6 }}
              className="mt-5 font-body text-xs font-semibold tracking-[0.35em] text-ink-soft md:text-sm"
            >
              SOFTWARE DEVELOPER · FOUNDER
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
