"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import {
  AppWindow,
  Code2,
  Cpu,
  Gamepad2,
  Landmark,
  Orbit,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const CAPTIONS = [
  {
    title: "Fullstack Developer",
    desc: "Interfaces people love, engines that don't break, data that stays honest. One builder across the whole stack — front, back, and everything in between.",
  },
  {
    title: "HaypBooks · Founder",
    desc: "A modern business & practice management suite — founded, designed, and shipped end-to-end by one builder. Live at haypbooks.com, running real businesses.",
  },
  {
    title: "V.Studio · Software Hub",
    desc: "The home of all my software — every app I've shipped, plus upcoming updates and new releases as they happen. One place to watch it all land.",
  },
  {
    title: "Software Architect",
    desc: "Systems that stay upright under real load: clean data flows, honest boundaries, and structure built to outlast the demo.",
  },
];

const FACES: {
  cls: string;
  icon: LucideIcon;
  top: string;
  bottom: string;
  no: string;
}[] = [
  { cls: "cube-front", icon: Code2, top: "FULLSTACK", bottom: "DEVELOPER", no: "01" },
  { cls: "cube-right", icon: Landmark, top: "HAYPBOOKS", bottom: "FOUNDER", no: "02" },
  { cls: "cube-back", icon: AppWindow, top: "V.STUDIO", bottom: "SOFTWARE HUB", no: "03" },
  { cls: "cube-left", icon: Cpu, top: "SOFTWARE", bottom: "ARCHITECT", no: "04" },
  { cls: "cube-top", icon: Gamepad2, top: "GAME", bottom: "BUILDER", no: "05" },
  { cls: "cube-bottom", icon: Rocket, top: "ALWAYS", bottom: "SHIPPING", no: "06" },
];

/**
 * Cube3D — "The Craft": a pinned section where a porcelain 3D cube tumbles
 * as you scroll. Six faces = six disciplines. Emerald & navy satellite
 * rings orbit continuously. The caption crossfades to the face in view.
 */
export default function Cube3D() {
  const wrapRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [16, -12, 16]);

  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const rot = v * 720;
    const idx =
      Math.floor(((((rot % 360) + 360) % 360) + 45) / 90) % 4;
    setActive(idx);
  });

  return (
    <section
      ref={wrapRef}
      id="craft"
      className="relative z-10 h-[300vh]"
      aria-label="The craft — rotating cube of disciplines"
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        {/* soft mint glow floor */}
        <div
          aria-hidden="true"
          className="absolute bottom-[8%] left-1/2 h-64 w-[min(700px,90vw)] -translate-x-1/2 rounded-full bg-emerald/10 blur-[110px]"
        />

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:px-10 lg:grid-cols-2 lg:gap-6">
          {/* ============ LEFT: heading + live caption ============ */}
          <div>
            <SectionHeading
              index="03"
              title="The Craft"
              subtitle="One builder, six disciplines"
            />

            <div className="mt-10 min-h-[190px] md:min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  className="max-w-md"
                >
                  <p className="font-display text-4xl font-bold italic text-emerald-deep md:text-5xl">
                    {CAPTIONS[active].title}
                  </p>
                  <p className="mt-4 font-body text-base leading-relaxed text-ink-soft md:text-[17px]">
                    {CAPTIONS[active].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* rotation progress */}
            <div className="mt-3 h-[3px] w-44 max-w-full overflow-hidden rounded-full bg-ink/10">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-full w-full origin-left bg-gradient-to-r from-emerald-deep to-emerald"
              />
            </div>

            <div className="mt-6 flex items-center gap-2.5 font-body text-xs font-medium tracking-[0.3em] text-ink-soft">
              <Orbit
                className="h-3.5 w-3.5 text-emerald/70"
                aria-hidden="true"
              />
              SCROLL TO TURN THE CUBE
            </div>
          </div>

          {/* ============ RIGHT: the 3D cube ============ */}
          <div
            className="flex items-center justify-center"
            style={{ perspective: 1500 }}
          >
            <div className="preserve-3d relative h-[var(--cube)] w-[var(--cube)] [--cube:9.5rem] sm:[--cube:11.5rem] md:[--cube:13.5rem] lg:[--cube:15rem] [--orbit:7.5rem] sm:[--orbit:9.25rem] md:[--orbit:10.75rem] lg:[--orbit:12rem]">
              {/* Soft stage plate behind the cube */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -z-20 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/[0.06] blur-2xl"
              />
              {/* Grounding elliptical shadow beneath the cube */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-[105%] h-12 w-[72%] -translate-x-1/2 rounded-[50%] bg-navy/20 blur-xl"
              />

              {/* Orbit ring 1 — emerald, equatorial */}
              <div
                aria-hidden="true"
                className="preserve-3d absolute left-1/2 top-1/2"
                style={{ transform: "translate(-50%, -50%)" }}
              >
                <div className="orbit-ring">
                  {[0, 120, 240].map((a) => (
                    <span
                      key={a}
                      className="orbit-dot"
                      style={{
                        transform: `rotateY(${a}deg) translateZ(var(--orbit))`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Orbit ring 2 — navy, tilted */}
              <div
                aria-hidden="true"
                className="preserve-3d absolute left-1/2 top-1/2"
                style={{ transform: "translate(-50%, -50%) rotateX(66deg)" }}
              >
                <div className="orbit-ring orbit-ring-rev">
                  {[60, 180, 300].map((a) => (
                    <span
                      key={a}
                      className="orbit-dot orbit-dot-navy"
                      style={{
                        transform: `rotateY(${a}deg) translateZ(var(--orbit))`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* The cube — rotation driven by scroll */}
              <motion.div
                data-cube
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative h-full w-full"
              >
                {FACES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.cls} className={`cube-face ${f.cls}`}>
                      <span
                        aria-hidden="true"
                        className="absolute left-3 top-2.5 font-display text-[10px] font-semibold text-emerald-deep/40"
                      >
                        {f.no}
                      </span>
                      <Icon
                        className="h-7 w-7 text-emerald-deep md:h-9 md:w-9"
                        aria-hidden="true"
                      />
                      <span className="font-display text-sm font-semibold tracking-tight text-ink sm:text-base md:text-lg">
                        {f.top}
                      </span>
                      <span className="font-body text-[10px] font-semibold tracking-[0.26em] text-ink-soft sm:text-[11px] md:text-xs">
                        {f.bottom}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
