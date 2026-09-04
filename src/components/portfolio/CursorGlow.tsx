"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CursorGlow — refined emerald dot + trailing navy ring cursor (desktop only).
 * Ring expands over interactive elements. Direct DOM updates only.
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
        dotRef.current.style.transform = `translate(${mouse.x - 3.5}px, ${mouse.y - 3.5}px)`;
      }
    };

    const loop = () => {
      ring.x += (mouse.x - ring.x) * 0.15;
      ring.y += (mouse.y - ring.y) * 0.15;
      ring.scale += (targetScale - ring.scale) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x - 16}px, ${
          ring.y - 16
        }px) scale(${ring.scale})`;
        ringRef.current.style.borderColor =
          ring.scale > 1.25
            ? "rgba(11,166,120,0.9)"
            : "rgba(10,37,64,0.35)";
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
        className="pointer-events-none fixed left-0 top-0 z-[80] h-[7px] w-[7px] rounded-full bg-emerald will-change-transform"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[80] h-8 w-8 rounded-full border will-change-transform"
      />
    </>
  );
}
