"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const BOOT_LINES = [
  "INITIALIZING PORTFOLIO...",
  "LOADING PROFILE: JOHN PAUL ESCUADRA",
  "FULLSTACK MODULE........OK",
  "ACCOUNTING SUITE........OK",
  "CREATIVE STUDIO.........OK",
  "READY.",
];

/**
 * BootScreen — a short cinematic "system boot" intro, plays once.
 */
export default function BootScreen() {
  const [visible, setVisible] = useState(true);
  const [lines, setLines] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const raf = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(raf);
    }

    // Reveal lines quickly
    const lineTimer = setInterval(() => {
      setLines((l) => (l >= BOOT_LINES.length ? l : l + 1));
    }, 230);

    // Progress bar
    const progTimer = setInterval(() => {
      setProgress((p) => Math.min(100, p + Math.random() * 14 + 6));
    }, 90);

    const done = setTimeout(() => setVisible(false), 1750);

    return () => {
      clearInterval(lineTimer);
      clearInterval(progTimer);
      clearTimeout(done);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#050506]"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <div className="w-[min(420px,86vw)] px-6">
            <div className="mb-4 flex items-center gap-2 font-body text-xs tracking-[0.3em] text-[#c9f73a]">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#c9f73a]" />
              JPE.SYS
            </div>

            <div className="min-h-[120px] font-body text-[13px] leading-6 text-zinc-400">
              {BOOT_LINES.slice(0, lines).map((l, i) => (
                <motion.div
                  key={l}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={
                    i === BOOT_LINES.length - 1 ? "text-[#c9f73a]" : undefined
                  }
                >
                  {l}
                </motion.div>
              ))}
            </div>

            <div className="mt-4 h-[3px] w-full overflow-hidden bg-zinc-800">
              <div
                className="h-full bg-[#c9f73a] transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
