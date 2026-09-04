"use client";

import { useEffect, useRef } from "react";

/** Deterministic PRNG — the same viewport always gets the same field. */
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

type ParticleT = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  driftX: number;
  driftY: number;
  r: number;
  phase: number;
  emerald: boolean;
};

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

/**
 * ArcadeBackground — interactive gamer × luxury ambient layer.
 *
 * Concept: an arcade energy field. A seeded constellation of soft navy &
 * emerald nodes drifts behind the page. The cursor acts as a "player
 * entity" — nodes gravitate toward it and link to it with emerald energy
 * lines. Clicking or tapping ANYWHERE fires the signature move: shockwave
 * rings ripple outward, nodes blast away with real momentum, and emerald
 * sparks scatter from the impact point.
 *
 * Flicker-proofing (learned the hard way):
 * - No scroll-linked opacity — the background never pulses while scrolling.
 * - Height-only resizes (mobile URL bar) never rebuild; node positions are
 *   absolute viewport pixels, so nothing teleports. Width resizes rebuild
 *   deterministically (seeded) after a debounce, repainting in the same
 *   task so the backing-store swap can never flash a blank frame.
 */
export default function ArcadeBackground() {
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
    let particles: ParticleT[] = [];
    let sparks: SparkT[] = [];
    let ripples: RippleT[] = [];
    let rebuildTimer: ReturnType<typeof setTimeout> | undefined;
    let hintTimer: ReturnType<typeof setTimeout> | undefined;
    let last = performance.now();

    const mouse = { x: -9999, y: -9999, sx: 0, sy: 0, seen: false };

    const build = () => {
      const rand = mulberry32(20260905);
      const count = Math.max(46, Math.min(120, Math.round((w * h) / 15000)));
      particles = Array.from({ length: count }, () => {
        const ang = rand() * Math.PI * 2;
        const speed = 6 + rand() * 10;
        return {
          x: rand() * w,
          y: rand() * h,
          vx: 0,
          vy: 0,
          driftX: Math.cos(ang) * speed,
          driftY: Math.sin(ang) * speed,
          r: 1.6 + rand() * 1.5,
          phase: rand() * Math.PI * 2,
          emerald: rand() > 0.86,
        };
      });
      sparks = [];
      ripples = [];
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

    /** The signature move: shockwave + sparks at a point. */
    const firePulse = (x: number, y: number) => {
      ripples.push({ x, y, t: 0 });
      for (let i = 0; i < 16; i++) {
        const ang = Math.random() * Math.PI * 2;
        const speed = 150 + Math.random() * 190;
        sparks.push({
          x,
          y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          t: 0,
          life: 0.45 + Math.random() * 0.4,
          r: 1.4 + Math.random() * 1.4,
          emerald: Math.random() > 0.28,
        });
      }
      // radial impulse — real momentum on every nearby node
      for (const p of particles) {
        const dx = p.x - x;
        const dy = p.y - y;
        const d = Math.hypot(dx, dy);
        if (d > 380) continue;
        const k = 300 * (1 - d / 380);
        if (d < 1) {
          const ang = Math.random() * Math.PI * 2;
          p.vx += Math.cos(ang) * k;
          p.vy += Math.sin(ang) * k;
        } else {
          p.vx += (dx / d) * k;
          p.vy += (dy / d) * k;
        }
      }
      if (sparks.length > 90) sparks.splice(0, sparks.length - 90);
    };

    const renderScene = (now: number, dt: number, animate: boolean) => {
      ctx.clearRect(0, 0, w, h);

      // smoothed cursor + gentle parallax (± ~8px, transform only)
      if (mouse.seen) {
        mouse.sx += (mouse.x - mouse.sx) * 0.07;
        mouse.sy += (mouse.y - mouse.sy) * 0.07;
      }
      const px = mouse.seen ? (mouse.sx - w / 2) * 0.012 : 0;
      const py = mouse.seen ? (mouse.sy - h / 2) * 0.01 : 0;

      ctx.save();
      ctx.translate(px, py);

      // ---- physics: drift + impulse damping + cursor gravity ----
      const damp = Math.exp(-1.7 * dt);
      for (const p of particles) {
        if (!animate) continue;
        p.vx *= damp;
        p.vy *= damp;
        if (mouse.seen) {
          const ax = mouse.sx - p.x;
          const ay = mouse.sy - p.y;
          const d = Math.hypot(ax, ay);
          if (d < 190 && d > 26) {
            const a = 62 * (1 - d / 190);
            p.vx += (ax / d) * a * dt;
            p.vy += (ay / d) * a * dt;
          }
        }
        p.x += (p.driftX + p.vx) * dt;
        p.y += (p.driftY + p.vy) * dt;
        if (p.x < -20) p.x += w + 40;
        else if (p.x > w + 20) p.x -= w + 40;
        if (p.y < -20) p.y += h + 40;
        else if (p.y > h + 20) p.y -= h + 40;
      }

      // ---- constellation links between nodes ----
      ctx.lineWidth = 1;
      const LINK = 132;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          if (dx > LINK || dx < -LINK) continue;
          const dy = a.y - b.y;
          if (dy > LINK || dy < -LINK) continue;
          const d = Math.hypot(dx, dy);
          if (d > LINK) continue;
          ctx.strokeStyle = `rgba(${NAVY},${0.045 + 0.06 * (1 - d / LINK)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // ---- cursor energy links (the player entity) ----
      if (mouse.seen) {
        ctx.lineWidth = 1.2;
        for (const p of particles) {
          const dx = p.x - mouse.sx;
          const dy = p.y - mouse.sy;
          const d = Math.hypot(dx, dy);
          if (d > 180) continue;
          const k = 1 - d / 180;
          ctx.strokeStyle = `rgba(${EMERALD},${0.32 * k})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.sx, mouse.sy);
          ctx.stroke();
        }
      }

      // ---- nodes ----
      for (const p of particles) {
        const tw = 0.5 + 0.5 * Math.sin(now * 0.0011 + p.phase);
        let heat = 0;
        if (mouse.seen) {
          const d = Math.hypot(p.x - mouse.sx, p.y - mouse.sy);
          heat = d < 180 ? 1 - d / 180 : 0;
        }
        if (heat > 0.05) {
          ctx.fillStyle = `rgba(${EMERALD},${0.16 * heat})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + 5 * heat, 0, Math.PI * 2);
          ctx.fill();
        }
        if (p.emerald) {
          ctx.fillStyle = `rgba(${EMERALD},${0.22 * tw})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${EMERALD},${0.55 + 0.3 * tw})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${NAVY},${0.3 + 0.2 * tw + heat * 0.35})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ---- sparks (click shrapnel) ----
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
        ctx.fillStyle = `rgba(${col},${0.1 * k})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${col},${0.85 * k})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ---- shockwave rings ----
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        if (animate) {
          rp.t += dt / 0.9;
          if (rp.t >= 1) {
            ripples.splice(i, 1);
            continue;
          }
        }
        const e = 1 - Math.pow(1 - Math.min(rp.t, 1), 3); // easeOutCubic
        const R = 380 * e;
        // impact flash
        if (rp.t < 0.22) {
          const fk = 1 - rp.t / 0.22;
          ctx.fillStyle = `rgba(${EMERALD},${0.1 * fk})`;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, 26 + 80 * e, 0, Math.PI * 2);
          ctx.fill();
        }
        // outer emerald ring
        ctx.strokeStyle = `rgba(${EMERALD},${0.5 * (1 - rp.t)})`;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, R, 0, Math.PI * 2);
        ctx.stroke();
        // inner navy echo
        ctx.strokeStyle = `rgba(${NAVY},${0.3 * (1 - rp.t)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, R * 0.62, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    };

    const draw = (now: number) => {
      const dt = Math.min(0.032, Math.max(0, (now - last) / 1000));
      last = now;
      renderScene(now, dt, true);
      raf = requestAnimationFrame(draw);
    };

    const renderStatic = () => renderScene(performance.now(), 0, false);

    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!mouse.seen) {
        mouse.sx = e.clientX;
        mouse.sy = e.clientY;
      }
      mouse.seen = true;
    };

    const onPointerDown = (e: PointerEvent) => {
      firePulse(e.clientX, e.clientY);
      showHint(false);
    };

    const onResize = () => {
      const prevW = w;
      applySize();
      if (w !== prevW || particles.length === 0) {
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
        {/* Static hairline engineering grid — pure CSS, zero repaint cost */}
        <div className="arcade-grid" />
        {/* Slow ambient tint washes — transform-only GPU animations */}
        <div className="arcade-glow arcade-glow-a" />
        <div className="arcade-glow arcade-glow-b" />
        {/* The living arcade field: nodes, energy links, shockwaves */}
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
