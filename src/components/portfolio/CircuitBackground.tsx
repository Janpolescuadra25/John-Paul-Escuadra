"use client";

import { useEffect, useRef } from "react";

/** Deterministic PRNG — the same viewport always gets the same circuit. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GRID = 84; // must match --circuit-cell in globals.css
const NAVY = "10,37,64";
const EMERALD = "11,166,120";

type NodeT = {
  x: number;
  y: number;
  phase: number;
  hub: boolean;
  hot: number;
};
type EdgeT = { a: number; b: number };
type PulseT = {
  edge: number;
  t: number;
  speed: number;
  forward: boolean;
  trail: { x: number; y: number }[];
};

/**
 * CircuitBackground — gamer × luxury ambient layer.
 *
 * Concept: a fine engineering grid with a living circuit on top. Nodes sit on
 * grid intersections, orthogonal traces connect them, and emerald data pulses
 * walk the traces node-to-node like packets on a motherboard. Nodes near the
 * cursor heat up, the whole field parallaxes gently with the mouse.
 *
 * Flicker-proofing (the previous canvas had both bugs):
 * - No scroll-linked opacity — the background never pulses while scrolling.
 * - Height-only resizes (mobile URL bar) never rebuild — node positions are
 *   absolute viewport pixels, so nothing teleports; width resizes rebuild
 *   deterministically (seeded) after a debounce, with an instant repaint so
 *   the backing-store swap can never flash a blank frame.
 */
export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window
      .matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: NodeT[] = [];
    let edges: EdgeT[] = [];
    let pulses: PulseT[] = [];
    let nodeEdges: number[][] = [];
    let rebuildTimer: ReturnType<typeof setTimeout> | undefined;
    let last = performance.now();

    const mouse = { x: -9999, y: -9999, sx: 0, sy: 0, seen: false };

    const build = () => {
      const rand = mulberry32(20260904);
      const cols = Math.ceil(w / GRID) + 1;
      const rows = Math.ceil(h / GRID) + 1;
      const key = (gx: number, gy: number) => gy * 10000 + gx;
      const at = new Map<number, number>();

      nodes = [];
      for (let gy = 1; gy < rows; gy++) {
        for (let gx = 1; gx < cols; gx++) {
          if (rand() < 0.4) continue; // sparse — a circuit, not a lattice
          at.set(key(gx, gy), nodes.length);
          nodes.push({
            x: gx * GRID,
            y: gy * GRID,
            phase: rand() * Math.PI * 2,
            hub: rand() > 0.82,
            hot: 0,
          });
        }
      }

      edges = [];
      for (let i = 0; i < nodes.length; i++) {
        const gx = Math.round(nodes[i].x / GRID);
        const gy = Math.round(nodes[i].y / GRID);
        // orthogonal traces: 1-cell and occasional 2-cell runs, right & down
        for (const [dx, dy, p] of [
          [1, 0, 0.62],
          [2, 0, 0.3],
          [0, 1, 0.62],
          [0, 2, 0.3],
        ] as const) {
          if (rand() > p) continue;
          const j = at.get(key(gx + dx, gy + dy));
          if (j === undefined || j <= i) continue;
          edges.push({ a: i, b: j });
        }
      }

      nodeEdges = nodes.map(() => []);
      edges.forEach((e, i) => {
        nodeEdges[e.a].push(i);
        nodeEdges[e.b].push(i);
      });

      const count = edges.length
        ? Math.max(7, Math.min(15, Math.round(nodes.length / 9)))
        : 0;
      pulses = Array.from({ length: count }, () => {
        const edge = Math.floor(rand() * Math.max(1, edges.length));
        return {
          edge,
          t: rand(),
          speed: 55 + rand() * 75, // px per second
          forward: rand() > 0.5,
          trail: [],
        };
      });
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

    const pointOnEdge = (e: EdgeT, t: number) => {
      const a = nodes[e.a];
      const b = nodes[e.b];
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    };

    /** Advance one pulse to its next edge (packet routing). */
    const hop = (p: PulseT, arriveNode: number) => {
      const options = nodeEdges[arriveNode].filter((i) => i !== p.edge);
      const pool = options.length ? options : nodeEdges[arriveNode];
      if (!pool.length) {
        p.edge = Math.floor(Math.random() * Math.max(1, edges.length));
        p.t = 0;
        p.forward = edges[p.edge]?.a === arriveNode;
        p.trail = [];
        return;
      }
      p.edge = pool[Math.floor(Math.random() * pool.length)];
      p.forward = edges[p.edge].a === arriveNode;
      p.t = 0;
      p.trail = p.trail.slice(-4); // short continuity of the trail
    };

    const renderScene = (now: number, dt: number, animate: boolean) => {
      ctx.clearRect(0, 0, w, h);

      // smoothed mouse + gentle parallax (± ~9px)
      if (mouse.seen) {
        mouse.sx += (mouse.x - mouse.sx) * 0.04;
        mouse.sy += (mouse.y - mouse.sy) * 0.04;
      }
      const px = mouse.seen ? (mouse.sx - w / 2) * 0.014 : 0;
      const py = mouse.seen ? (mouse.sy - h / 2) * 0.011 : 0;

      ctx.save();
      ctx.translate(px, py);

      // ---- traces (constant base alpha + cursor heat) ----
      ctx.lineWidth = 1;
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const heat = Math.min(a.hot, b.hot);
        ctx.strokeStyle = `rgba(${NAVY},${0.055 + heat * 0.16})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // ---- nodes (slow deterministic breathing + cursor heat) ----
      for (const n of nodes) {
        if (animate) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const target = dist < 170 ? 1 - dist / 170 : 0;
          n.hot += (target - n.hot) * 0.08;
        }
        const breathe = 0.5 + 0.5 * Math.sin(now * 0.0009 + n.phase);

        if (n.hot > 0.04) {
          ctx.fillStyle = `rgba(${EMERALD},${0.12 * n.hot})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 5 + n.hot * 9, 0, Math.PI * 2);
          ctx.fill();
        }

        if (n.hub) {
          ctx.fillStyle = `rgba(${EMERALD},${0.4 + 0.3 * breathe + n.hot * 0.3})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2.2 + n.hot * 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${NAVY},${0.2 + 0.14 * breathe + n.hot * 0.4})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.7 + n.hot * 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ---- data pulses ----
      for (const p of pulses) {
        const e = edges[p.edge];
        if (!e) continue;
        const a = nodes[e.a];
        const b = nodes[e.b];
        const len = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
        if (animate) {
          p.t += (p.speed * dt) / len;
          if (p.t >= 1) {
            const arrive = p.forward ? e.b : e.a;
            hop(p, arrive);
          }
        }
        const cur = edges[p.edge]
          ? pointOnEdge(edges[p.edge], Math.min(p.t, 1))
          : { x: a.x, y: a.y };

        if (animate) {
          p.trail.push(cur);
          if (p.trail.length > 16) p.trail.shift();
        }

        // fading trail
        for (let i = 0; i < p.trail.length; i++) {
          const k = i / p.trail.length;
          ctx.fillStyle = `rgba(${EMERALD},${0.03 + k * 0.3})`;
          ctx.beginPath();
          ctx.arc(p.trail[i].x, p.trail[i].y, 0.7 + k * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // glow + head
        ctx.fillStyle = `rgba(${EMERALD},0.07)`;
        ctx.beginPath();
        ctx.arc(cur.x, cur.y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${EMERALD},0.2)`;
        ctx.beginPath();
        ctx.arc(cur.x, cur.y, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${EMERALD},0.85)`;
        ctx.beginPath();
        ctx.arc(cur.x, cur.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
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

    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.sx = mouse.seen ? mouse.sx : e.clientX;
      mouse.sy = mouse.seen ? mouse.sy : e.clientY;
      mouse.seen = true;
    };

    const onResize = () => {
      const prevW = w;
      applySize();
      if (w !== prevW || nodes.length === 0) {
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
    }

    window.addEventListener("resize", onResize);
    if (!reduced) {
      window.addEventListener("mousemove", onMouse, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rebuildTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      {/* Static hairline engineering grid — pure CSS, zero repaint cost */}
      <div className="circuit-grid" />
      {/* Slow ambient tint washes — transform-only GPU animations */}
      <div className="circuit-glow circuit-glow-a" />
      <div className="circuit-glow circuit-glow-b" />
      {/* Living circuit: nodes, traces, traveling data pulses */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
