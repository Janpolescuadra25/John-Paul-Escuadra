"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { Facebook, Mail, Send } from "lucide-react";
import { useRef } from "react";
import DepthSection from "./DepthSection";

/** Magnetic hover wrapper */
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 16 });
  const sy = useSpring(y, { stiffness: 200, damping: 16 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.25);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

export default function Contact() {
  return (
    <DepthSection
      id="contact"
      fill
      className="flex min-h-[92vh] flex-col overflow-hidden border-t border-white/10 bg-navy-deep pt-24 md:pt-32"
      innerClassName="flex flex-1 flex-col"
      ariaLabel="Contact"
    >
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 py-20 text-center md:px-10">
        {/* Ambient emerald aura */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/3 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-emerald/10 blur-[130px]"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-body text-xs font-semibold tracking-[0.45em] text-emerald md:text-sm"
        >
          AVAILABLE FOR SELECT COLLABORATIONS
        </motion.p>

        <div className="mt-8 overflow-hidden">
          <motion.h2
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[12vw] font-bold leading-[1.02] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-[7rem]"
          >
            Let&apos;s build
          </motion.h2>
        </div>
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.95, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[12vw] font-semibold italic leading-[1.02] tracking-tight text-emerald sm:text-7xl md:text-8xl lg:text-[7rem]"
          >
            something great.
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="mt-9 max-w-lg font-body text-lg leading-relaxed text-white/80 md:text-xl"
        >
          Got a product to launch, books to fix, or a world to build? I
          answer fast — especially for interesting problems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 flex flex-col items-center gap-5 sm:flex-row"
        >
          <Magnetic>
            <a
              href="mailto:paulescuadra25@gmail.com"
              className="btn-sheen group relative inline-flex items-center gap-3 rounded-full bg-emerald px-9 py-4.5 font-body text-sm font-semibold tracking-[0.22em] text-white transition-all duration-500 hover:lux-shadow-emerald"
            >
              <Mail className="h-4.5 w-4.5" aria-hidden="true" />
              SEND AN EMAIL
              <Send
                className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="https://www.facebook.com/paul.escuadra.1/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-9 py-4.5 font-body text-sm font-semibold tracking-[0.22em] text-white/90 transition-all duration-500 hover:border-emerald/60 hover:text-white"
            >
              <Facebook className="h-4.5 w-4.5" aria-hidden="true" />
              FACEBOOK
            </a>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-body text-sm font-medium tracking-wider text-white/65"
        >
          <span>paulescuadra25@gmail.com</span>
          <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:inline-block" />
          <span>facebook.com/paul.escuadra.1</span>
        </motion.div>
      </div>

      {/* ============ FOOTER ============ */}
      <footer className="relative mt-auto border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:flex-row md:px-10">
          <p className="font-body text-[13px] tracking-[0.3em] text-white/55">
            © {new Date().getFullYear()} JOHN PAUL ESCUADRA
          </p>
          <p className="flex items-center gap-2 font-body text-[11px] font-semibold tracking-[0.35em] text-white/55">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald" />
            BUILT FROM SCRATCH · NO TEMPLATES
          </p>
        </div>
      </footer>
    </DepthSection>
  );
}
