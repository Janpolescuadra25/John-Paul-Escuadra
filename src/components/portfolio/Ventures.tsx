"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import {
  ArrowUpRight,
  Banknote,
  Boxes,
  Building2,
  Clapperboard,
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

/** 3D tilt-on-hover wrapper — gentle, premium */
function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [4, -4]), { stiffness: 160, damping: 24 });
  const ry = useSpring(useTransform(mx, [0, 1], [-4, 4]), { stiffness: 160, damping: 24 });

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
        transformPerspective: 1200,
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
      className="border-y border-white/10 bg-navy py-24 md:py-36"
      innerClassName="relative mx-auto max-w-7xl px-6 md:px-10"
      ariaLabel="Ventures — HaypBooks and V.Studio"
    >
      {/* Ambient emerald glows on navy */}
      <div
        aria-hidden="true"
        className="absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-emerald/10 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-40 bottom-1/4 h-[480px] w-[480px] rounded-full bg-emerald/[0.07] blur-[140px]"
      />

      <SectionHeading
        index="02"
        title="The Ventures"
        subtitle="Two companies, built from zero"
        dark
      />

      {/* ============ HAYPBOOKS — flagship, white on navy ============ */}
      <motion.div
        initial={{ opacity: 0, y: 64 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        className="mt-16"
      >
        <TiltCard className="group relative rounded-3xl bg-white p-7 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.55)] md:p-12">
          {/* thin emerald corner ticks */}
          <span aria-hidden="true" className="absolute left-4 top-4 h-9 w-9 border-l border-t border-emerald" />
          <span aria-hidden="true" className="absolute right-4 top-4 h-9 w-9 border-r border-t border-emerald" />
          <span aria-hidden="true" className="absolute bottom-4 left-4 h-9 w-9 border-b border-l border-emerald" />
          <span aria-hidden="true" className="absolute bottom-4 right-4 h-9 w-9 border-b border-r border-emerald" />

          <div className="preserve-3d grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="preserve-3d">
              <div className="pop-3d-sm flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-navy px-4 py-1.5 font-body text-[9px] font-semibold tracking-[0.3em] text-white">
                  FLAGSHIP · FOUNDER
                </span>
                <span className="font-body text-[10px] tracking-[0.3em] text-ink-soft">
                  ACCOUNTING SYSTEM
                </span>
              </div>

              <h3 className="pop-3d mt-7 font-display text-5xl font-semibold tracking-tight text-ink md:text-7xl">
                HAYP
                <span className="italic font-light text-emerald-deep">Books</span>
              </h3>

              <p className="mt-7 max-w-xl font-body text-base leading-relaxed text-ink-soft md:text-lg">
                A modern accounting &amp; practice management suite — built by
                someone who actually lived inside the books. HaypBooks gives
                businesses and accounting practices one place to run their
                finances: clean books, live reporting, and workspaces that
                scale across companies.
              </p>
              <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-ink-soft/85">
                I founded it, designed it, and shipped it end-to-end — from
                the first login screen to the dashboards teams rely on.
              </p>

              <div className="pop-3d mt-10 inline-block">
                <a
                  href="https://haypbooks.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sheen group relative inline-flex items-center gap-3 rounded-full bg-emerald px-8 py-4 font-body text-xs font-semibold tracking-[0.25em] text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-emerald-deep hover:lux-shadow-emerald"
                >
                  VISIT HAYPBOOKS.COM
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>

            {/* feature grid */}
            <div className="grid grid-cols-1 gap-3 self-center sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {HAYP_FEATURES.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: 0.35 + i * 0.08 }}
                  className="flex items-center gap-3 rounded-xl border border-ink/5 bg-[#f7faf8] px-4 py-3.5 transition-all duration-500 hover:border-emerald/30 hover:bg-[#eff8f3]"
                >
                  <f.icon
                    className="h-4.5 w-4.5 shrink-0 text-emerald-deep"
                    aria-hidden="true"
                  />
                  <span className="font-body text-[13px] font-medium leading-snug text-ink">
                    {f.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </TiltCard>
      </motion.div>

      {/* ============ V.STUDIO — glass navy ============ */}
      <motion.div
        initial={{ opacity: 0, y: 64 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10"
      >
        <TiltCard className="group relative rounded-3xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-sm md:p-12">
          <div className="preserve-3d grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="preserve-3d">
              <div className="pop-3d-sm flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-emerald/40 px-4 py-1.5 font-body text-[9px] font-semibold tracking-[0.3em] text-emerald">
                  FOUNDER · CREATIVE
                </span>
                <span className="font-body text-[10px] tracking-[0.3em] text-white/50">
                  CREATIVE STUDIO
                </span>
              </div>

              <h3 className="pop-3d mt-7 font-display text-5xl font-semibold tracking-tight text-white md:text-7xl">
                V.<span className="italic font-light text-emerald">Studio</span>
              </h3>

              <p className="mt-7 max-w-xl font-body text-base leading-relaxed text-white/70 md:text-lg">
                Where the other half of my brain lives. V.Studio is my
                creative studio for video editing, 3D visuals, and motion
                work — the place where precision meets play. Nearly a year of
                professional editing, plus years of Blender-crafted 3D, all
                folded into one house style: sharp, cinematic, deliberate.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 self-center sm:grid-cols-2">
              {VSTUDIO_FEATURES.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: 0.35 + i * 0.08 }}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition-colors duration-500 hover:border-emerald/40"
                >
                  <f.icon
                    className="h-4.5 w-4.5 shrink-0 text-emerald"
                    aria-hidden="true"
                  />
                  <span className="font-body text-[13px] font-medium leading-snug text-white/80">
                    {f.label}
                  </span>
                </motion.div>
              ))}
              <div className="flex items-center gap-3 rounded-xl border border-emerald/25 bg-gradient-to-r from-emerald/10 to-transparent px-4 py-3.5 sm:col-span-2">
                <Play className="h-4 w-4 shrink-0 text-emerald" aria-hidden="true" />
                <span className="font-body text-[13px] font-medium italic text-white/80">
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
        transition={{ duration: 0.9, delay: 0.2 }}
        className="mt-14 flex items-center justify-center gap-4 text-center font-body text-[10px] tracking-[0.35em] text-white/40"
      >
        <Layers className="h-3.5 w-3.5 text-emerald/50" aria-hidden="true" />
        ONE FOUNDER · TWO WORLDS · ZERO SHORTCUTS
      </motion.p>
    </DepthSection>
  );
}
