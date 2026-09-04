"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CursorGlow — glowing dot + trailing ring custom cursor (desktop only).
 * Ring scales up over interactive elements. Uses direct DOM updates
 * (no re-renders on mouse move).
 */
export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const rafEnable = requestAnimationFrame(() => setEnabled(true));

    const mouse = { x: -100, y: -100 };
    const ring = { x: -100, y: -100, scale: 1 };
    let targetScale = 1;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const target = e.target as HTMLElement | null;
      targetScale = target?.closest("a, button, [role='button'], [data-cursor]")
        ? 1.6
        : 1;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.x - 4}px, ${mouse.y - 4}px)`;
      }
    };

    const loop = () => {
      ring.x += (mouse.x - ring.x) * 0.16;
      ring.y += (mouse.y - ring.y) * 0.16;
      ring.scale += (targetScale - ring.scale) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x - 14}px, ${
          ring.y - 14
        }px) scale(${ring.scale})`;
        ringRef.current.style.borderColor =
          ring.scale > 1.25
            ? "rgba(201,247,58,0.9)"
            : "rgba(255,255,255,0.35)";
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafEnable);
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[80] h-2 w-2 rounded-full bg-[#c9f73a] will-change-transform"
        style={{ boxShadow: "0 0 12px 2px rgba(201,247,58,0.65)" }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[80] h-7 w-7 rounded-full border will-change-transform"
      />
    </>
  );
}
