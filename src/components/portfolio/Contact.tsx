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
      className="flex min-h-[90vh] flex-col overflow-hidden pt-24 md:pt-32"
      innerClassName="flex flex-1 flex-col"
      ariaLabel="Contact"
    >
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 py-16 text-center md:px-10">
        {/* Glow */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/3 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#c9f73a]/[0.05] blur-[110px]"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-body text-[11px] tracking-[0.4em] text-[#c9f73a] md:text-xs"
        >
          CO-OP MODE · PLAYER 2 WANTED
        </motion.p>

        <div className="mt-6 overflow-hidden">
          <motion.h2
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[11vw] font-bold leading-[0.95] tracking-tight text-zinc-100 sm:text-6xl md:text-7xl lg:text-8xl"
          >
            LET&apos;S BUILD
          </motion.h2>
        </div>
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="glitch font-display text-[11vw] font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            data-text="SOMETHING GREAT."
          >
            SOMETHING GREAT.
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 max-w-lg font-body text-base leading-relaxed text-zinc-400 md:text-lg"
        >
          Got a product to launch, books to fix, or a world to build? I
          answer fast — especially for interesting problems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-12 flex flex-col items-center gap-5 sm:flex-row"
        >
          <Magnetic>
            <a
              href="mailto:paulescuadra25@gmail.com"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-sm bg-[#c9f73a] px-9 py-4.5 font-display text-sm font-semibold tracking-[0.2em] text-[#09090b] transition-shadow duration-300 hover:shadow-[0_12px_50px_-10px_rgba(201,247,58,0.65)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              <Mail className="h-4.5 w-4.5" aria-hidden="true" />
              SEND AN EMAIL
              <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="https://www.facebook.com/paul.escuadra.1/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-sm border border-zinc-700 px-9 py-4.5 font-display text-sm font-semibold tracking-[0.2em] text-zinc-300 transition-all duration-300 hover:border-[#c9f73a]/60 hover:text-[#c9f73a]"
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
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-body text-xs tracking-wider text-zinc-600"
        >
          <span>paulescuadra25@gmail.com</span>
          <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:inline-block" />
          <span>facebook.com/paul.escuadra.1</span>
        </motion.div>
      </div>

      {/* ============ FOOTER ============ */}
      <footer className="relative mt-auto border-t border-zinc-800/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:flex-row md:px-10">
          <p className="font-body text-xs tracking-[0.25em] text-zinc-600">
            © {new Date().getFullYear()} JOHN PAUL ESCUADRA
          </p>
          <p className="flex items-center gap-2 font-body text-[10px] tracking-[0.3em] text-zinc-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c9f73a]" />
            BUILT FROM SCRATCH · NO TEMPLATES
          </p>
        </div>
      </footer>
    </DepthSection>
  );
}
