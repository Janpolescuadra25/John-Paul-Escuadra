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
  Boxes,
  Clapperboard,
  Code2,
  Gamepad2,
  Landmark,
  Orbit,
  Scissors,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const CAPTIONS = [
  {
    title: "FULLSTACK DEVELOPER",
    desc: "Interfaces people love, engines that don't break, data that stays honest. One builder across the whole stack — front, back, and everything in between.",
  },
  {
    title: "HAYPBOOKS · FOUNDER",
    desc: "A modern accounting and practice management suite — founded, designed, and shipped end-to-end. Four years in the field, turned into the software that runs the field.",
  },
  {
    title: "V.STUDIO · CREATIVE",
    desc: "My creative studio for video editing, 3D visuals, and motion work. Nearly a year of professional cuts, plus years of Blender-crafted worlds.",
  },
  {
    title: "BLENDER · 3D ARTIST",
    desc: "Models, materials, lighting, full scenes. From product mockups to entire worlds — if it can be imagined, it can be rendered.",
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
  { cls: "cube-back", icon: Clapperboard, top: "V.STUDIO", bottom: "CREATIVE", no: "03" },
  { cls: "cube-left", icon: Boxes, top: "BLENDER", bottom: "3D ARTIST", no: "04" },
  { cls: "cube-top", icon: Scissors, top: "VIDEO", bottom: "EDITOR", no: "05" },
  { cls: "cube-bottom", icon: Gamepad2, top: "GAME", bottom: "BUILDER", no: "06" },
];

/**
 * Cube3D — "THE CORE": a sticky, pinned section where a glowing 3D cube
 * tumbles as you scroll. Six faces = six identities. Orbiting satellite
 * rings spin continuously. Side caption crossfades to the face in view.
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
      id="core"
      className="relative z-10 h-[300vh]"
      aria-label="The core — rotating cube of identities"
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 md:px-10 lg:grid-cols-2 lg:gap-6">
          {/* ============ LEFT: heading + live caption ============ */}
          <div>
            <SectionHeading
              index="03"
              title="THE CORE"
              subtitle="One builder, six faces"
            />

            <div className="mt-8 min-h-[170px] md:min-h-[190px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="max-w-md"
                >
                  <p className="font-display text-xl font-bold text-[#c9f73a] md:text-3xl">
                    {CAPTIONS[active].title}
                  </p>
                  <p className="mt-3 font-body text-sm leading-relaxed text-zinc-400 md:text-base">
                    {CAPTIONS[active].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* rotation progress */}
            <div className="mt-2 h-[3px] w-40 max-w-full overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-full w-full origin-left bg-gradient-to-r from-[#7ba312] to-[#c9f73a]"
              />
            </div>

            <div className="mt-5 flex items-center gap-2 font-body text-[10px] tracking-[0.3em] text-zinc-600">
              <Orbit
                className="h-3.5 w-3.5 text-[#c9f73a]/60"
                aria-hidden="true"
              />
              SCROLL TO ROTATE THE CORE
            </div>
          </div>

          {/* ============ RIGHT: the 3D cube ============ */}
          <div
            className="flex items-center justify-center"
            style={{ perspective: 1500 }}
          >
            {/* glow floor */}
            <div
              aria-hidden="true"
              className="absolute bottom-[6%] left-1/2 h-16 w-56 -translate-x-1/2 rounded-full bg-[#c9f73a]/15 blur-2xl"
            />

            <div className="preserve-3d relative h-[var(--cube)] w-[var(--cube)] [--cube:9.5rem] sm:[--cube:11.5rem] md:[--cube:13.5rem] lg:[--cube:15rem] [--orbit:7.5rem] sm:[--orbit:9.25rem] md:[--orbit:10.75rem] lg:[--orbit:12rem]">
              {/* Orbit ring 1 — lime, equatorial */}
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

              {/* Orbit ring 2 — gold, tilted */}
              <div
                aria-hidden="true"
                className="preserve-3d absolute left-1/2 top-1/2"
                style={{ transform: "translate(-50%, -50%) rotateX(66deg)" }}
              >
                <div className="orbit-ring orbit-ring-rev">
                  {[60, 180, 300].map((a) => (
                    <span
                      key={a}
                      className="orbit-dot orbit-dot-gold"
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
                        className="absolute left-2.5 top-2 font-display text-[9px] font-bold text-[#c9f73a]/40"
                      >
                        {f.no}
                      </span>
                      <Icon
                        className="h-7 w-7 text-[#c9f73a] md:h-9 md:w-9"
                        aria-hidden="true"
                      />
                      <span className="font-display text-xs font-bold tracking-tight text-zinc-100 sm:text-sm md:text-base">
                        {f.top}
                      </span>
                      <span className="font-body text-[8px] tracking-[0.3em] text-zinc-500 sm:text-[9px] md:text-[10px]">
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
