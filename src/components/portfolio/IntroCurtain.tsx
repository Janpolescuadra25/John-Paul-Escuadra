"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const NAME_1 = "John Paul";
const NAME_2 = "Escuadra";
const VIDEO_RUNTIME_S = 4.27; // cropped intro clip length

/**
 * IntroCurtain — video-driven Animus opening.
 * The subject turns to face the camera inside an arched frame (echoing
 * the hero portrait) while a sync hairline fills beneath it — the
 * memory synchronizing. The serif name rises, the creed line completes,
 * and when the video ends the white screen splits like theatre curtains
 * to reveal the site. Click/tap anywhere to skip. Scroll is locked
 * while visible. Reduced-motion users skip straight to the site.
 */
export default function IntroCurtain() {
  const [visible, setVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const raf = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(raf);
    }

    document.body.style.overflow = "hidden";
    const done = setTimeout(() => setVisible(false), 4450);
    videoRef.current?.play().catch(() => {});

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
          className="fixed inset-0 z-[95] cursor-pointer select-none"
          exit={{ transition: { duration: 0.95, ease: [0.65, 0, 0.35, 1] } }}
          onClick={() => setVisible(false)}
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
          {/* Seam hairline — the coming split line, tucked behind the video */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-px w-[min(320px,70vw)] -translate-x-1/2 -translate-y-1/2 bg-ink/15"
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* ============ CENTER: VIDEO + TITLE ============ */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 md:gap-5"
            exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
            transition={{ duration: 0.55, ease: "easeIn" }}
          >
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-body text-xs font-semibold tracking-[0.5em] text-ink-soft md:text-sm"
            >
              ANIMUS · SYNCHRONIZING
              <span className="animate-blink ml-1 inline-block h-[0.9em] w-[0.35em] translate-y-[0.12em] bg-emerald/80" />
            </motion.p>

            {/* Arched video frame — the memory materializes */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="lux-shadow relative overflow-hidden rounded-t-full border-[5px] border-white bg-white"
            >
              <video
                ref={videoRef}
                src="/videos/jp-intro.mp4"
                poster="/videos/jp-intro-poster.jpg"
                muted
                autoPlay
                playsInline
                preload="auto"
                className="block h-[30vh] w-auto md:h-[38vh]"
              />
              {/* Luminous sheen sweep across the frame */}
              <div
                aria-hidden="true"
                className="animate-sheen absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent"
              />
            </motion.div>

            {/* Sync hairline — fills with the video runtime */}
            <div className="h-[2px] w-[min(220px,50vw)] overflow-hidden rounded-full bg-ink/10">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: VIDEO_RUNTIME_S, ease: "linear" }}
                className="h-full origin-left bg-gradient-to-r from-emerald-deep via-emerald to-gold"
              />
            </div>

            {/* Serif name */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "112%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[12vw] font-bold leading-[0.98] tracking-tight text-ink sm:text-7xl md:text-8xl"
              >
                {NAME_1}{" "}
                <span className="italic font-semibold text-emerald-deep">
                  {NAME_2}
                </span>
              </motion.h1>
            </div>

            {/* Emerald rule draws outward between gold diamonds */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.15, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="h-[2px] w-[min(180px,42vw)] origin-center bg-emerald"
              />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.45, duration: 0.6 }}
              className="font-body text-[13px] font-semibold tracking-[0.35em] text-ink-soft md:text-sm"
            >
              SOFTWARE DEVELOPER · FOUNDER
            </motion.p>
          </motion.div>

          {/* Skip hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-[10px] font-semibold tracking-[0.4em] text-ink-soft/70"
          >
            TAP TO SKIP
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
