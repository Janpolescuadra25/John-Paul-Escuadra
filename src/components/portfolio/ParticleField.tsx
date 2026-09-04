"use client";

import { useEffect, useRef } from "react";

/**
 * ParticleField — full-screen animated canvas background.
 * - Drifting particles with connecting "energy lines"
 * - Reacts to mouse movement (particles gently repel)
 * - Reacts to scroll (intensity & drift shift as you scroll)
 * - Performance-capped particle count, DPR aware, reduced-motion aware
 */
export default function ParticleField() {
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
    const mouse = { x: -9999, y: -9999 };
    let scrollProgress = 0;
    let smoothedScroll = 0;

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      hue: number; // 0 = white, 1 = neon
    };
    let particles: P[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.min(90, Math.floor((w * h) / 22000));
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
        hue: Math.random() > 0.72 ? 1 : 0,
      }));
    };

    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      scrollProgress = window.scrollY / max;
    };

    const NEON = { r: 201, g: 247, b: 58 };
    const GOLD = { r: 245, g: 197, b: 66 };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      smoothedScroll += (scrollProgress - smoothedScroll) * 0.05;
      const energy = 0.35 + smoothedScroll * 0.65; // more intense as you scroll

      for (const p of particles) {
        // Mouse interaction — gentle push
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 16000 && dist2 > 0.01) {
          const d = Math.sqrt(dist2);
          const force = ((16000 - dist2) / 16000) * 0.06;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }

        p.x += p.vx * (1 + energy * 0.6);
        p.y += p.vy * (1 + energy * 0.6);

        // Friction
        p.vx *= 0.985;
        p.vy *= 0.985;
        // Keep minimum drift
        if (Math.abs(p.vx) < 0.12) p.vx += (Math.random() - 0.5) * 0.02;
        if (Math.abs(p.vy) < 0.12) p.vy += (Math.random() - 0.5) * 0.02;

        // Wrap
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      // Connecting lines
      const linkDist = 110 + smoothedScroll * 40;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            const t = 1 - Math.sqrt(d2) / linkDist;
            const alpha = t * 0.14 * (0.5 + energy * 0.5);
            ctx.strokeStyle =
              a.hue === 1 || b.hue === 1
                ? `rgba(${NEON.r},${NEON.g},${NEON.b},${alpha})`
                : `rgba(255,255,255,${alpha * 0.7})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Particles
      for (const p of particles) {
        if (p.hue === 1) {
          ctx.fillStyle = `rgba(${NEON.r},${NEON.g},${NEON.b},${0.55 + energy * 0.3})`;
          ctx.shadowColor = `rgba(${NEON.r},${NEON.g},${NEON.b},0.8)`;
          ctx.shadowBlur = 6 + energy * 6;
        } else {
          ctx.fillStyle = `rgba(228,228,231,${0.3 + energy * 0.2})`;
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Rare gold sparks that follow scroll energy
      if (smoothedScroll > 0.25) {
        const goldCount = Math.floor((smoothedScroll - 0.25) * 10);
        for (let i = 0; i < goldCount; i++) {
          const gx = (Math.sin(i * 12.9898 + Date.now() * 0.0004) * 0.5 + 0.5) * w;
          const gy = (Math.cos(i * 78.233 + Date.now() * 0.0005) * 0.5 + 0.5) * h;
          ctx.fillStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},0.5)`;
          ctx.shadowColor = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},0.9)`;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(gx, gy, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    onScroll();
    if (reduced) {
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
