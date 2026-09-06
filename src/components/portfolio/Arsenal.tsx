"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Code2,
  Cpu,
  Database,
  Gamepad2,
  PenTool,
  Rocket,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const SKILLS = [
  {
    icon: Code2,
    title: "Fullstack Development",
    level: "CORE STACK",
    desc: "End-to-end product building. Interfaces people love, engines that don't break, data that stays honest. Front to back, one owner: me.",
    accent: "#0ba678",
  },
  {
    icon: Cpu,
    title: "Software Architecture",
    level: "SYSTEMS THAT LAST",
    desc: "Clean data flows, honest boundaries, decisions that survive the second version. The best architecture is the kind you never have to think about.",
    accent: "#0a2540",
  },
  {
    icon: PenTool,
    title: "Interface Design",
    level: "PIXELS WITH INTENT",
    desc: "Typography, spacing, motion — tuned until the interface feels inevitable. The kind of polish users can't point at, but always feel.",
    accent: "#0ba678",
  },
  {
    icon: Database,
    title: "APIs & Data",
    level: "THE ENGINE ROOM",
    desc: "Where products live or die: clean schemas, honest data, integrations that don't break at 2 AM. The invisible work that makes everything else possible.",
    accent: "#0a2540",
  },
  {
    icon: Gamepad2,
    title: "Game Development",
    level: "UNITY · UNREAL · GODOT",
    desc: "Three engines, zero rules. I build my own games in my own time — not for release, not for show. Just for the pure fun of making a world that runs.",
    accent: "#0ba678",
  },
  {
    icon: Rocket,
    title: "Product Building",
    level: "FOUNDER MODE",
    desc: "Blank page to launched company — twice. HaypBooks and V.Studio weren't assignments. They were decisions.",
    accent: "#0a2540",
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
      initial={{ opacity: 0, y: 44, rotate: i % 2 === 0 ? 1 : -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10 }}
      className="group lux-shadow relative w-[300px] shrink-0 overflow-hidden rounded-2xl border border-ink/5 bg-white p-7 transition-shadow duration-500 hover:lux-shadow-hover sm:w-[340px] md:p-8"
      data-cursor
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, transparent, ${skill.accent}, transparent)` }}
      />
      {/* Soft accent wash on hover */}
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: `${skill.accent}1f` }}
      />

      <div className="flex items-start justify-between">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-500 group-hover:scale-105"
          style={{
            borderColor: `${skill.accent}33`,
            background: `${skill.accent}0d`,
          }}
        >
          <Icon className="h-6.5 w-6.5" style={{ color: skill.accent }} aria-hidden="true" />
        </div>
        <span
          aria-hidden="true"
          className="font-display text-6xl font-semibold leading-none text-ink/[0.08] transition-colors duration-500 group-hover:text-ink/[0.14]"
        >
          {String(i + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-7 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
        {skill.title}
      </h3>
      <p
        className="mt-2.5 font-body text-xs font-semibold tracking-[0.26em]"
        style={{ color: skill.accent }}
      >
        {skill.level}
      </p>
      <p className="mt-5 font-body text-base leading-relaxed text-ink-soft">
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
      className="relative z-10 bg-[#f8fbf9] py-24 md:py-36"
      aria-label="Skills and capabilities"
    >
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1000 }}
        className="mx-auto max-w-7xl px-6 md:px-10"
      >
        <SectionHeading
          index="04"
          title="The Collection"
          subtitle="Skills earned, not claimed"
        />
        <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-ink-soft md:text-[17px]">
          Everything here has receipts — shipped products, live systems, or
          worlds that run. Keep scrolling; the gallery slides sideways.
        </p>
      </motion.div>

      {/* MOBILE: snap-scroll row */}
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
            <div className="flex w-[300px] shrink-0 items-center justify-center rounded-2xl border border-dashed border-ink/15 sm:w-[340px]">
              <p className="px-8 text-center font-display text-2xl font-medium italic text-ink-soft">
                More in the works<span className="animate-blink text-emerald">.</span>
              </p>
            </div>
          </motion.div>

          {/* progress hint */}
          <div className="absolute inset-x-0 bottom-16 mx-auto flex w-max items-center gap-4 font-body text-xs font-medium tracking-[0.3em] text-ink-soft">
            <span className="h-px w-10 bg-ink/15" />
            SCROLL TO EXPLORE
            <span className="h-px w-10 bg-ink/15" />
          </div>
        </div>
      </div>
    </section>
  );
}
