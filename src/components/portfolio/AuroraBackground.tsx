"use client";

import { useEffect, useRef } from "react";

type Orb = {
  x: number;
  y: number;
  r: number;
  hue: { r: number; g: number; b: number };
  a: number;
  phase: number;
  speed: number;
  ampX: number;
  ampY: number;
  baseX: number;
  baseY: number;
};

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  emerald: boolean;
  phase: number;
};

/**
 * AuroraBackground — a light, luxurious animated canvas for the white theme.
 * - Large soft aurora orbs (navy / emerald / mint tints) drifting slowly,
 *   gently parallaxed by the mouse
 * - Fine floating dust motes with barely-visible constellation lines
 * - Subtle scroll reactivity (brightness & drift energy)
 * - GPU friendly: ~70 dots + 5 gradients per frame, DPR capped, reduced-motion aware
 */
export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let t = 0;

    const mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 };
    let scrollProgress = 0;
    let smoothedScroll = 0;

    const NAVY = { r: 10, g: 37, b: 64 };
    const EMERALD = { r: 11, g: 166, b: 120 };
    const MINT = { r: 52, g: 196, b: 137 };
    const DEEP = { r: 6, g: 106, b: 76 };

    let orbs: Orb[] = [];
    let dots: Dot[] = [];

    const build = () => {
      orbs = [
        { baseX: 0.16, baseY: 0.24, r: 0.34, hue: EMERALD, a: 0.085, phase: 0, speed: 0.00016, ampX: 70, ampY: 46 },
        { baseX: 0.85, baseY: 0.16, r: 0.30, hue: NAVY, a: 0.05, phase: 2.1, speed: 0.00013, ampX: 62, ampY: 52 },
        { baseX: 0.70, baseY: 0.78, r: 0.40, hue: MINT, a: 0.075, phase: 4.4, speed: 0.00011, ampX: 84, ampY: 40 },
        { baseX: 0.28, baseY: 0.86, r: 0.26, hue: NAVY, a: 0.045, phase: 1.2, speed: 0.00018, ampX: 56, ampY: 60 },
        { baseX: 0.52, baseY: 0.46, r: 0.22, hue: DEEP, a: 0.05, phase: 3.3, speed: 0.0002, ampX: 44, ampY: 36 },
      ];
      dots = Array.from({ length: Math.min(72, Math.floor((w * h) / 26000)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.14,
        vy: -0.05 - Math.random() * 0.12,
        r: Math.random() * 1.5 + 0.6,
        emerald: Math.random() > 0.68,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX / w;
      mouse.y = e.clientY / h;
    };
    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      scrollProgress = window.scrollY / max;
    };

    const drawOrb = (o: Orb, energy: number) => {
      const px = o.baseX * w + Math.sin(t * o.speed * 1000 + o.phase) * o.ampX;
      const py = o.baseY * h + Math.cos(t * o.speed * 800 + o.phase) * o.ampY;
      const parX = (mouse.sx - 0.5) * 46;
      const parY = (mouse.sy - 0.5) * 34;
      const radius = o.r * Math.min(w, h * 1.2) * (1 + energy * 0.06);
      const alpha = o.a * (0.75 + energy * 0.35);

      const grad = ctx.createRadialGradient(
        px + parX,
        py + parY,
        0,
        px + parX,
        py + parY,
        radius
      );
      grad.addColorStop(0, `rgba(${o.hue.r},${o.hue.g},${o.hue.b},${alpha})`);
      grad.addColorStop(0.55, `rgba(${o.hue.r},${o.hue.g},${o.hue.b},${alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${o.hue.r},${o.hue.g},${o.hue.b},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px + parX, py + parY, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = () => {
      t = performance.now();
      ctx.clearRect(0, 0, w, h);
      smoothedScroll += (scrollProgress - smoothedScroll) * 0.04;
      const energy = 0.3 + smoothedScroll * 0.7;
      mouse.sx += (mouse.x - mouse.sx) * 0.03;
      mouse.sy += (mouse.y - mouse.sy) * 0.03;

      // Aurora orbs (back layer)
      for (const o of orbs) drawOrb(o, energy);

      // Dust motes
      for (const p of dots) {
        p.x += p.vx * (1 + energy * 0.5) + Math.sin(t * 0.0012 + p.phase) * 0.08;
        p.y += p.vy * (1 + energy * 0.6);
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      // Faint constellation lines
      const link = 104;
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < link * link) {
            const strength = (1 - Math.sqrt(d2) / link) * 0.045;
            ctx.strokeStyle =
              a.emerald || b.emerald
                ? `rgba(11,166,120,${strength * 1.4})`
                : `rgba(10,37,64,${strength})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of dots) {
        ctx.fillStyle = p.emerald
          ? `rgba(11,166,120,${0.32 + energy * 0.18})`
          : `rgba(10,37,64,${0.16 + energy * 0.08})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    onScroll();
    if (reduced) {
      // Single static frame — calm gradient wash, no motion
      draw();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
