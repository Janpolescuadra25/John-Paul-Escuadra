"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Boxes,
  Code2,
  Gamepad2,
  Landmark,
  Rocket,
  Scissors,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const SKILLS = [
  {
    icon: Code2,
    title: "FULLSTACK DEVELOPMENT",
    level: "CORE STACK",
    desc: "End-to-end product building. Interfaces people love, engines that don't break, data that stays honest. Front to back, one owner: me.",
    accent: "#c9f73a",
  },
  {
    icon: Landmark,
    title: "ACCOUNTING & FINANCE",
    level: "LVL 04 · 4 YEARS",
    desc: "Four years inside the accounting field — ledgers, reconciliation, closings, reports. I don't just build finance software, I've done the job it replaces.",
    accent: "#c9f73a",
  },
  {
    icon: Scissors,
    title: "VIDEO EDITING",
    level: "1 YR · PRO CUTS",
    desc: "Nearly a year of professional editing — pacing, rhythm, color, and sound. If a frame doesn't earn its place, it's gone.",
    accent: "#f5c542",
  },
  {
    icon: Boxes,
    title: "3D MODELING · BLENDER",
    level: "EXPERT",
    desc: "Blender is my second workshop. Models, materials, lighting, full scenes — from product mockups to entire worlds.",
    accent: "#f5c542",
  },
  {
    icon: Gamepad2,
    title: "GAME DEVELOPMENT",
    level: "UNITY · UNREAL · GODOT",
    desc: "Three engines, zero rules. I build my own games in my own time — not for release, not for show. Just for the pure fun of making a world that runs.",
    accent: "#c9f73a",
  },
  {
    icon: Rocket,
    title: "PRODUCT BUILDING",
    level: "FOUNDER MODE",
    desc: "Blank page to launched company — twice. HaypBooks and V.Studio weren't assignments. They were decisions.",
    accent: "#f5c542",
  },
];

function SkillCard({
  skill,
  i,
}: {
  skill: (typeof SKILLS)[number];
  i: number;
}) {
  const Icon = skill.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? 1.5 : -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative w-[300px] shrink-0 rounded-lg border border-zinc-800 bg-[#101013] p-7 transition-colors duration-300 hover:border-[#c9f73a]/40 sm:w-[340px] md:p-8"
      data-cursor
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] rounded-t-lg opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${skill.accent}, transparent)` }}
      />
      <div className="flex items-start justify-between">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-md border transition-colors duration-300"
          style={{
            borderColor: `${skill.accent}44`,
            background: `${skill.accent}0d`,
          }}
        >
          <Icon className="h-7 w-7" style={{ color: skill.accent }} aria-hidden="true" />
        </div>
        <span
          className="font-display text-6xl font-bold leading-none text-zinc-800/70 transition-colors duration-300"
        >
          {String(i + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-7 font-display text-xl font-bold tracking-tight text-zinc-100 md:text-2xl">
        {skill.title}
      </h3>
      <p
        className="mt-2 font-body text-[10px] font-semibold tracking-[0.25em]"
        style={{ color: skill.accent }}
      >
        {skill.level}
      </p>
      <p className="mt-5 font-body text-sm leading-relaxed text-zinc-400">
        {skill.desc}
      </p>
    </motion.article>
  );
}

export default function Arsenal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -range]);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const overflow = track.scrollWidth - window.innerWidth;
      setRange(Math.max(0, overflow + 48));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section
      id="skills"
      className="relative z-10 py-24 md:py-32"
      aria-label="Skills and capabilities"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          index="03"
          title="THE ARSENAL"
          subtitle="Skills earned, not claimed"
        />
        <p className="mt-5 max-w-xl font-body text-sm leading-relaxed text-zinc-500 md:text-base">
          {`Everything here has receipts — years, shipped products, or rendered
          scenes. Keep scrolling; the shelf slides sideways.`}
        </p>
      </div>

      {/* MOBILE: vertical stack */}
      <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:px-10 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SKILLS.map((s, i) => (
          <div key={s.title} className="snap-start">
            <SkillCard skill={s} i={i} />
          </div>
        ))}
      </div>

      {/* DESKTOP: pinned horizontal scroll */}
      <div ref={sectionRef} className="relative hidden lg:block lg:h-[320vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex w-max items-stretch gap-6 pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]"
          >
            {SKILLS.map((s, i) => (
              <SkillCard key={s.title} skill={s} i={i} />
            ))}
            {/* end card */}
            <div className="flex w-[300px] shrink-0 items-center justify-center rounded-lg border border-dashed border-[#c9f73a]/30 sm:w-[340px]">
              <p className="rotate-0 px-8 text-center font-display text-lg font-bold tracking-[0.15em] text-zinc-500">
                MORE LOADING<span className="animate-blink text-[#c9f73a]">_</span>
              </p>
            </div>
          </motion.div>

          {/* progress hint */}
          <div className="absolute inset-x-0 bottom-16 mx-auto flex w-max items-center gap-3 font-body text-[10px] tracking-[0.3em] text-zinc-600">
            <span className="h-px w-10 bg-zinc-700" />
            SCROLL TO EXPLORE
            <span className="h-px w-10 bg-zinc-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
