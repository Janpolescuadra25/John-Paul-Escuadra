"use client";

import { useEffect, useRef } from "react";

/** Deterministic PRNG — the same viewport always gets the same HUD. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 429497296;
  };
}

const NAVY = "10,37,64";
const EMERALD = "11,166,120";
const CELL = 96; // must match .hud-grid background-size in globals.css

type MarkerT = { x: number; y: number; heat: number; flash: number };
type SparkT = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
  life: number;
  r: number;
  emerald: boolean;
};
type RippleT = { x: number; y: number; t: number };
type TrailT = { x: number; y: number; age: number };

/**
 * HudBackground — quiet gamer HUD, readable-first.
 *
 * The lesson from the arcade field: an always-on particle constellation
 * fights the typography. So this concept flips the priority — at rest the
 * page is almost pure white: an ultra-faint engineering grid plus a sparse
 * set of tiny "+" markers sitting on grid intersections, like a
 * strategy-game minimap printed on paper.
 *
 * The HUD *wakes up* around the person, never on its own:
 * - Sweeping the cursor ignites nearby markers emerald (heat) and leaves a
 *   short, subtle comet trail.
 * - Click / tap anywhere fires a clean pulse: one thin emerald ring, a navy
 *   echo ring, a small spark burst, and nearby markers flash.
 *
 * Nothing drifts behind the text. Every effect is anchored to the user, so
 * paragraphs always sit on clean white.
 *
 * Flicker-proofing (carried over and simplified):
 * - No scroll-linked opacity; no ambient animation at all at rest.
 * - Resizes only rebuild when the grid row/column count changes; the
 *   rebuild is seeded (positions identical) and repaints in the same task,
 *   so a backing-store swap can never flash a blank frame.
 */
export default function HudBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window
      .matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    // Hint visibility is driven by direct DOM updates (no cascading renders)
    const showHint = (show: boolean) => {
      if (hintRef.current) hintRef.current.style.opacity = show ? "1" : "0";
    };
    showHint(!reduced);

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let markers: MarkerT[] = [];
    let sparks: SparkT[] = [];
    let ripples: RippleT[] = [];
    let trail: TrailT[] = [];
    let rebuildTimer: ReturnType<typeof setTimeout> | undefined;
    let hintTimer: ReturnType<typeof setTimeout> | undefined;
    let last = performance.now();
    let lastCols = 0;
    let lastRows = 0;

    const mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999, seen: false };

    const build = () => {
      const rand = mulberry32(20260905);
      const cols = Math.max(1, Math.ceil(w / CELL));
      const rows = Math.max(1, Math.ceil(h / CELL));
      lastCols = cols;
      lastRows = rows;
      markers = [];
      // Sparse ticks on interior intersections (~38%), never on the edges.
      for (let gx = 1; gx < cols; gx++) {
        for (let gy = 1; gy < rows; gy++) {
          if (rand() < 0.38) {
            markers.push({ x: gx * CELL, y: gy * CELL, heat: 0, flash: 0 });
          }
        }
      }
      sparks = [];
      ripples = [];
      trail = [];
    };

    const applySize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /** The signature move: a clean pulse at a point. */
    const firePulse = (x: number, y: number) => {
      ripples.push({ x, y, t: 0 });
      for (let i = 0; i < 8; i++) {
        const ang = Math.random() * Math.PI * 2;
        const speed = 130 + Math.random() * 170;
        sparks.push({
          x,
          y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          t: 0,
          life: 0.45 + Math.random() * 0.35,
          r: 1.5 + Math.random() * 1.1,
          emerald: Math.random() > 0.3,
        });
      }
      // nearby markers flash bright emerald
      for (const m of markers) {
        const d = Math.hypot(m.x - x, m.y - y);
        if (d < 300) m.flash = Math.max(m.flash, 1 - d / 300);
      }
      if (sparks.length > 48) sparks.splice(0, sparks.length - 48);
    };

    const renderScene = (now: number, dt: number, animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";

      // smoothed cursor (for heat + trail sampling)
      if (mouse.seen) {
        mouse.sx += (mouse.x - mouse.sx) * 0.22;
        mouse.sy += (mouse.y - mouse.sy) * 0.22;
      }

      // ---- marker heat: ease toward proximity target ----
      if (animate) {
        for (const m of markers) {
          let target = 0;
          if (mouse.seen) {
            const d = Math.hypot(m.x - mouse.sx, m.y - mouse.sy);
            if (d < 170) target = 1 - d / 170;
          }
          m.heat += (target - m.heat) * Math.min(1, dt * 7);
          if (m.flash > 0) m.flash = Math.max(0, m.flash - dt * 2.4);
        }
      }

      // ---- HUD "+" markers ----
      for (const m of markers) {
        const glow = Math.min(1, m.heat * 0.85 + m.flash);
        const scale = 1 + 0.55 * m.heat + 0.4 * m.flash;
        const arm = 5 * scale;
        // quiet navy base tick
        ctx.strokeStyle = `rgba(${NAVY},${0.13 + 0.1 * glow})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(m.x - arm, m.y);
        ctx.lineTo(m.x + arm, m.y);
        ctx.moveTo(m.x, m.y - arm);
        ctx.lineTo(m.x, m.y + arm);
        ctx.stroke();
        // ignited emerald overlay
        if (glow > 0.02) {
          ctx.strokeStyle = `rgba(${EMERALD},${0.85 * glow})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(m.x - arm, m.y);
          ctx.lineTo(m.x + arm, m.y);
          ctx.moveTo(m.x, m.y - arm);
          ctx.lineTo(m.x, m.y + arm);
          ctx.stroke();
        }
      }

      // ---- comet trail behind the cursor ----
      if (animate && trail.length) {
        for (let i = trail.length - 1; i >= 0; i--) {
          const p = trail[i];
          p.age += dt;
          if (p.age >= 0.45) {
            trail.splice(i, 1);
            continue;
          }
          const k = 1 - p.age / 0.45;
          ctx.fillStyle = `rgba(${EMERALD},${0.22 * k})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.4 * k + 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ---- sparks (click shrapnel — small, clean) ----
      const damp = Math.exp(-1.7 * dt);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        if (animate) {
          s.t += dt;
          if (s.t >= s.life) {
            sparks.splice(i, 1);
            continue;
          }
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.vx *= damp;
          s.vy *= damp;
        }
        const k = 1 - s.t / s.life;
        const col = s.emerald ? EMERALD : NAVY;
        if (s.emerald) {
          ctx.fillStyle = `rgba(${col},${0.1 * k})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${col},${0.85 * k})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ---- pulse rings ----
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        if (animate) {
          rp.t += dt / 0.8;
          if (rp.t >= 1) {
            ripples.splice(i, 1);
            continue;
          }
        }
        const e = 1 - Math.pow(1 - Math.min(rp.t, 1), 3); // easeOutCubic
        const R = 300 * e;
        // outer emerald ring — thin, precise
        ctx.strokeStyle = `rgba(${EMERALD},${0.55 * (1 - rp.t)})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, R, 0, Math.PI * 2);
        ctx.stroke();
        // inner navy echo
        ctx.strokeStyle = `rgba(${NAVY},${0.26 * (1 - rp.t)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, R * 0.62, 0, Math.PI * 2);
        ctx.stroke();
      }

      // keep the time reference fresh even in static renders
      void now;
    };

    const draw = (now: number) => {
      const dt = Math.min(0.032, Math.max(0, (now - last) / 1000));
      last = now;
      renderScene(now, dt, true);
      raf = requestAnimationFrame(draw);
    };

    const renderStatic = () => renderScene(performance.now(), 0, false);

    const onPointerMove = (e: PointerEvent) => {
      const prevX = mouse.x;
      const prevY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!mouse.seen) {
        mouse.sx = e.clientX;
        mouse.sy = e.clientY;
      }
      mouse.seen = true;
      // sample the comet trail only when the pointer actually travelled
      if (Math.hypot(mouse.x - prevX, mouse.y - prevY) > 14) {
        trail.push({ x: e.clientX, y: e.clientY, age: 0 });
        if (trail.length > 14) trail.shift();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      firePulse(e.clientX, e.clientY);
      showHint(false);
    };

    const onResize = () => {
      applySize();
      const cols = Math.max(1, Math.ceil(w / CELL));
      const rows = Math.max(1, Math.ceil(h / CELL));
      // rebuild only when the grid itself changes; the seed keeps marker
      // positions identical, so nothing ever teleports
      if (cols !== lastCols || rows !== lastRows || markers.length === 0) {
        clearTimeout(rebuildTimer);
        rebuildTimer = setTimeout(() => {
          build();
          if (reduced) renderStatic();
        }, 180);
      }
      if (reduced) renderStatic(); // repaint in the same task — no blank flash
    };

    applySize();
    build();
    if (reduced) {
      renderStatic();
    } else {
      raf = requestAnimationFrame(draw);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      hintTimer = setTimeout(() => showHint(false), 16000);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rebuildTimer);
      clearTimeout(hintTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        {/* Ultra-faint engineering grid — pure CSS, zero repaint cost */}
        <div className="hud-grid" />
        {/* The reactive HUD: markers, comet trail, pulses */}
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>
      {/* Discoverability hint — its own fixed layer so it floats above
          section content; fades after the first pulse or 16s */}
      <div
        ref={hintRef}
        style={{ opacity: 0 }}
        className="pointer-events-none fixed bottom-6 right-5 z-[60] flex items-center gap-2.5 rounded-full border border-ink/15 bg-white/95 px-4 py-2.5 shadow-[0_10px_36px_-14px_rgba(10,37,64,0.4)] backdrop-blur-sm transition-opacity duration-1000 md:right-7"
      >
        <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald" />
        <span className="font-body text-[11px] font-semibold tracking-[0.22em] text-ink-soft">
          CLICK / TAP — FIRE A PULSE
        </span>
      </div>
    </>
  );
}
