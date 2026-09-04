"use client";

const WORDS = [
  "FULLSTACK DEVELOPER",
  "FOUNDER",
  "ACCOUNTING EXPERT",
  "VIDEO EDITOR",
  "3D ARTIST",
  "GAME BUILDER",
  "PROBLEM SOLVER",
];

/** Marquee — two opposing scrolling strips of roles. */
export default function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div
      className="relative z-10 -rotate-[0.6deg] border-y border-[#c9f73a]/15 bg-[#0c0c0e]/80 py-4 backdrop-blur-sm"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee-left items-center gap-10 whitespace-nowrap">
        {row.map((w, i) => (
          <span
            key={`l-${i}`}
            className="flex items-center gap-10 font-display text-sm font-semibold tracking-[0.3em] text-zinc-400"
          >
            {w}
            <span className="text-[#c9f73a]">✦</span>
          </span>
        ))}
      </div>
      <div className="mt-3 flex w-max animate-marquee-right items-center gap-10 whitespace-nowrap opacity-50">
        {row.map((w, i) => (
          <span
            key={`r-${i}`}
            className="flex items-center gap-10 font-body text-xs tracking-[0.3em] text-zinc-600"
          >
            {w}
            <span className="text-zinc-700">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
