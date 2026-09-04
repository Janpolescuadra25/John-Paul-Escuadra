"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import {
  ArrowUpRight,
  Banknote,
  Boxes,
  Building2,
  Clapperboard,
  Cpu,
  FileBarChart,
  HeartPulse,
  Layers,
  ListChecks,
  Play,
  Sparkles,
  Video,
  Workflow,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import DepthSection from "./DepthSection";

/** 3D tilt-on-hover wrapper */
function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 180, damping: 22 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 180, damping: 22 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width);
        my.set((e.clientY - rect.top) / rect.height);
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const HAYP_FEATURES = [
  { icon: Banknote, label: "Banking & cashflow tracking" },
  { icon: FileBarChart, label: "Financial reports" },
  { icon: Building2, label: "Multi-company workspaces" },
  { icon: HeartPulse, label: "Business health insights" },
  { icon: Workflow, label: "Automated workflows" },
  { icon: ListChecks, label: "Practice management" },
];

const VSTUDIO_FEATURES = [
  { icon: Video, label: "Video editing & cuts" },
  { icon: Boxes, label: "3D modeling & renders" },
  { icon: Clapperboard, label: "Motion & visual stories" },
  { icon: Sparkles, label: "Brand-grade polish" },
];

export default function Ventures() {
  return (
    <DepthSection
      id="ventures"
      className="py-24 md:py-32"
      innerClassName="mx-auto max-w-7xl px-6 md:px-10"
      ariaLabel="Ventures — HaypBooks and V.Studio"
    >
      <SectionHeading
        index="02"
        title="THE VENTURES"
        subtitle="Two companies, built from zero"
      />

      {/* ============ HAYPBOOKS — flagship ============ */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="mt-14"
      >
        <TiltCard className="group relative rounded-lg border border-[#c9f73a]/20 bg-[#101013] p-6 shadow-[0_0_80px_-30px_rgba(201,247,58,0.25)] md:p-10">
          {/* corner ticks */}
          <span aria-hidden="true" className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-[#c9f73a]" />
          <span aria-hidden="true" className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-[#c9f73a]" />
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-[#c9f73a]" />
          <span aria-hidden="true" className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-[#c9f73a]" />

          <div className="preserve-3d grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="preserve-3d">
              <div className="pop-3d-sm flex flex-wrap items-center gap-3">
                <span className="rounded-sm bg-[#c9f73a] px-3 py-1 font-display text-[10px] font-bold tracking-[0.25em] text-[#09090b]">
                  FLAGSHIP · FOUNDER
                </span>
                <span className="font-body text-[11px] tracking-[0.25em] text-zinc-500">
                  ACCOUNTING SYSTEM
                </span>
              </div>

              <h3 className="pop-3d mt-6 font-display text-4xl font-bold tracking-tight text-zinc-100 md:text-6xl">
                HAYP
                <span className="text-[#c9f73a]">BOOKS</span>
              </h3>

              <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-zinc-400 md:text-lg">
                A modern accounting &amp; practice management suite — built by
                someone who actually lived inside the books. HaypBooks gives
                businesses and accounting practices one place to run their
                finances: clean books, live reporting, and workspaces that
                scale across companies.
              </p>
              <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-zinc-500">
                I founded it, designed it, and shipped it end-to-end — from
                the first login screen to the dashboards teams rely on.
              </p>

              <div className="pop-3d mt-8 inline-block">
                <a
                  href="https://haypbooks.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-sm bg-[#c9f73a] px-7 py-3.5 font-display text-sm font-semibold tracking-[0.2em] text-[#09090b] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(201,247,58,0.6)]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  VISIT HAYPBOOKS.COM
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* feature grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {HAYP_FEATURES.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 rounded-sm border border-zinc-800 bg-[#0c0c0e] px-4 py-3.5 transition-colors duration-300 hover:border-[#c9f73a]/40"
                >
                  <f.icon
                    className="h-4.5 w-4.5 shrink-0 text-[#c9f73a]"
                    aria-hidden="true"
                  />
                  <span className="font-body text-[13px] leading-snug text-zinc-300">
                    {f.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </TiltCard>
      </motion.div>

      {/* ============ V.STUDIO ============ */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10"
      >
        <TiltCard className="group relative rounded-lg border border-[#f5c542]/20 bg-[#101013] p-6 shadow-[0_0_80px_-30px_rgba(245,197,66,0.22)] md:p-10">
          <div className="preserve-3d grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="preserve-3d">
              <div className="pop-3d-sm flex flex-wrap items-center gap-3">
                <span className="rounded-sm bg-[#f5c542] px-3 py-1 font-display text-[10px] font-bold tracking-[0.25em] text-[#09090b]">
                  FOUNDER · CREATIVE
                </span>
                <span className="font-body text-[11px] tracking-[0.25em] text-zinc-500">
                  CREATIVE STUDIO
                </span>
              </div>

              <h3 className="pop-3d mt-6 font-display text-4xl font-bold tracking-tight text-zinc-100 md:text-6xl">
                V.<span className="text-[#f5c542]">STUDIO</span>
              </h3>

              <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-zinc-400 md:text-lg">
                Where the other half of my brain lives. V.Studio is my
                creative studio for video editing, 3D visuals, and motion
                work — the place where precision meets play. Nearly a year of
                professional editing, plus years of Blender-crafted 3D, all
                folded into one house style: sharp, cinematic, deliberate.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {VSTUDIO_FEATURES.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 rounded-sm border border-zinc-800 bg-[#0c0c0e] px-4 py-3.5 transition-colors duration-300 hover:border-[#f5c542]/40"
                >
                  <f.icon
                    className="h-4.5 w-4.5 shrink-0 text-[#f5c542]"
                    aria-hidden="true"
                  />
                  <span className="font-body text-[13px] leading-snug text-zinc-300">
                    {f.label}
                  </span>
                </motion.div>
              ))}
              <div className="flex items-center gap-3 rounded-sm border border-zinc-800 bg-gradient-to-r from-[#f5c542]/10 to-transparent px-4 py-3.5 sm:col-span-2">
                <Play className="h-4 w-4 shrink-0 text-[#f5c542]" aria-hidden="true" />
                <span className="font-body text-[13px] text-zinc-300">
                  Every frame earns its place
                </span>
              </div>
            </div>
          </div>
        </TiltCard>
      </motion.div>

      {/* small note strip */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-10 flex items-center justify-center gap-3 text-center font-body text-xs tracking-[0.2em] text-zinc-600"
      >
        <Cpu className="h-3.5 w-3.5 text-[#c9f73a]/50" aria-hidden="true" />
        ONE FOUNDER · TWO WORLDS · ZERO SHORTCUTS
        <Layers className="h-3.5 w-3.5 text-[#c9f73a]/50" aria-hidden="true" />
      </motion.p>
    </DepthSection>
  );
}
