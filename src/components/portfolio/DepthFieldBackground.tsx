"use client";

import { useEffect, useRef } from "react";

/** Deterministic PRNG — the same world is built every time. */
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
const GOLD = "184,147,62";

/* ---- world constants ---- */
const CAM_Y = 170; // camera height above the floor
const Z_FAR = 2600;
const Z_NEAR = 80;
const GRID = 150; // floor cell size
const SEG_Z = [80, 140, 230, 380, 620, 1000, 1600, 2600]; // fade segments
const Z_BASE = 90; // nearest depth of the scroll stream
const Z_SPAN = 2550; // 17 × GRID — wrap length of the scroll dolly

type BeaconT = {
  x: number;
  y: number;
  z: number;
  glyph: number; // 0 diamond · 1 cross · 2 chevron
  bobAmp: number;
  bobPhase: number;
  heat: number;
  flash: number;
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

type RippleT = { gx: number; gz: number; t: number };
type SkyRippleT = { x: number; y: number; t: number };
type TrailT = { x: number; y: number; age: number };

/**
 * DepthFieldBackground — a quiet 3D space, readable-first.
 *
 * Concept: the page stands inside a faint holographic game floor. A
 * perspective-projected grid recedes to a horizon, sparse beacons float at
 * different depths, and the whole scene sits on a virtual camera:
 *
 * - MOVING THE MOUSE turns the camera (yaw + pitch) with easing — near
 *   objects shift more than far ones, so the parallax reads as genuine 3D
 *   depth. A very slow idle sway keeps the depth alive on touch devices.
 * - CLICK / TAP ray-casts into the floor and fires a synchronization
 *   wave that travels across the ground plane in perspective (an
 *   elliptical ring), flashing every beacon it passes through.
 * - SCROLLING glides the camera forward — the floor grid and beacons
 *   stream toward you (position only, never opacity, so no flicker).
 *   Beacons render as Animus glyphs: diamonds, crosses, chevrons.
 *
 * Readability rules (learned from the arcade field): nothing bright lives
 * behind the text band. The floor fades to almost nothing near the
 * horizon where paragraphs sit, and only gathers presence toward the
 * bottom edge of the screen.
 *
 * Flicker-proofing: no scroll-linked opacity; beacons live in world
 * coordinates so resizes never teleport anything (no rebuild at all —
 * just resize + repaint); DPR capped at 2; passive listeners only.
 */
export default function DepthFieldBackground() {
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

    const showHint = (show: boolean) => {
      if (hintRef.current) hintRef.current.style.opacity = show ? "1" : "0";
    };
    showHint(!reduced);

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let F = 900; // focal length
    let cx = 0;
    let cy = 0;

    let sparks: SparkT[] = [];
    let ripples: RippleT[] = [];
    let skyRipples: SkyRippleT[] = [];
    let trail: TrailT[] = [];
    let hintTimer: ReturnType<typeof setTimeout> | undefined;
    let last = performance.now();

    // virtual camera: eased targets from the mouse + slow idle sway
    const cam = { tYaw: 0, tPitch: 0, yaw: 0, pitch: 0.03 };
    const mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999, seen: false };

    // scroll dolly — the camera glides forward as the page travels, so
    // the whole 3D world streams past. Pure position change, never opacity.
    let scrollZ = 0;
    let scrollN = 0;

    // ---- build the seeded world (viewport-independent) ----
    const rand = mulberry32(20260906);
    const beacons: BeaconT[] = [];
    for (let i = 0; i < 64; i++) {
      const z = 340 + 2060 * Math.pow(rand(), 1.7); // biased near
      const floating = rand() > 0.74;
      beacons.push({
        x: (rand() * 2 - 1) * 1150,
        y: floating ? 40 + rand() * 170 : 4,
        z,
        glyph: Math.floor(rand() * 3),
        bobAmp: floating ? 8 + rand() * 10 : 0,
        bobPhase: rand() * Math.PI * 2,
        heat: 0,
        flash: 0,
      });
    }
    beacons.sort((a, b) => b.z - a.z); // paint far first

    /** wrap a world z into the visible depth stream [Z_BASE, Z_BASE+Z_SPAN) */
    const wrapZ = (z: number) => {
      let d = z - scrollZ - Z_BASE;
      d = ((d % Z_SPAN) + Z_SPAN) % Z_SPAN;
      return Z_BASE + d;
    };

    /** Animus glyphs — 0 diamond · 1 cross · 2 chevron */
    const drawGlyph = (
      glyph: number,
      sx: number,
      sy: number,
      arm: number,
      rot: number
    ) => {
      if (glyph === 0) {
        const r = arm * 0.62;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(Math.PI / 4 + rot);
        ctx.strokeRect(-r, -r, r * 2, r * 2);
        ctx.restore();
      } else if (glyph === 1) {
        ctx.beginPath();
        ctx.moveTo(sx - arm, sy);
        ctx.lineTo(sx + arm, sy);
        ctx.moveTo(sx, sy - arm);
        ctx.lineTo(sx, sy + arm);
        ctx.stroke();
      } else {
        const wd = arm * 0.95;
        ctx.beginPath();
        ctx.moveTo(sx - wd, sy + arm * 0.42);
        ctx.lineTo(sx, sy - arm * 0.55);
        ctx.lineTo(sx + wd, sy + arm * 0.42);
        ctx.stroke();
      }
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
      F = h * 1.05;
      cx = w / 2;
      cy = h * 0.4;
    };

    /** The signature move: a shockwave on the floor + sparks at the point. */
    const firePulse = (sx: number, sy: number) => {
      // ray → floor intersection
      let hit: { gx: number; gz: number } | null = null;
      {
        const rdx = (sx - cx) / F;
        const rdy = -(sy - cy) / F;
        const cp = Math.cos(cam.pitch);
        const sp = Math.sin(cam.pitch);
        const cyy = Math.cos(cam.yaw);
        const syw = Math.sin(cam.yaw);
        const y1 = rdy * cp + sp;
        const z1 = -rdy * sp + cp;
        const x2 = rdx * cyy - z1 * syw;
        const z2 = rdx * syw + z1 * cyy;
        if (y1 < -0.02) {
          const t = -CAM_Y / y1;
          if (t > 0 && t * z2 < Z_FAR * 1.6) hit = { gx: t * x2, gz: t * z2 };
        }
      }
      if (hit) {
        // anchor the wave in world space (camera sits at z = scrollZ)
        ripples.push({ gx: hit.gx, gz: hit.gz + scrollZ, t: 0 });
      } else {
        skyRipples.push({ x: sx, y: sy, t: 0 }); // clicked above the horizon
      }
      for (let i = 0; i < 8; i++) {
        const ang = Math.random() * Math.PI * 2;
        const speed = 130 + Math.random() * 170;
        sparks.push({
          x: sx,
          y: sy,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          t: 0,
          life: 0.45 + Math.random() * 0.35,
          r: 1.5 + Math.random() * 1.1,
          emerald: Math.random() > 0.3,
        });
      }
      if (sparks.length > 48) sparks.splice(0, sparks.length - 48);
    };

    const renderScene = (now: number, dt: number, animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";

      // ---- camera: ease toward mouse target + slow idle sway ----
      if (animate) {
        const k = Math.min(1, dt * 6);
        cam.tYaw += ((mouse.seen ? (mouse.x / w - 0.5) * 0.18 : 0) - cam.tYaw) * k;
        cam.tPitch +=
          ((mouse.seen ? (mouse.y / h - 0.5) * 0.09 : 0) - cam.tPitch) * k;
        if (mouse.seen) {
          mouse.sx += (mouse.x - mouse.sx) * Math.min(1, dt * 10);
          mouse.sy += (mouse.y - mouse.sy) * Math.min(1, dt * 10);
        }
        const sway = 0.03 * Math.sin(now * 0.0003);
        const swayP = 0.01 * Math.sin(now * 0.00023 + 1.7);
        cam.yaw = cam.tYaw + sway;
        // the gaze lifts slightly as the page travels — cinematic dolly feel
        cam.pitch = 0.03 + cam.tPitch + swayP + scrollN * 0.022;
      }
      const cyy = Math.cos(cam.yaw);
      const syw = Math.sin(cam.yaw);
      const cp = Math.cos(cam.pitch);
      const sp = Math.sin(cam.pitch);

      /** world (x, y, z) → screen [sx, sy, depth] (null when behind) */
      const project = (
        x: number,
        y: number,
        z: number
      ): [number, number, number] | null => {
        const dy = y - CAM_Y;
        const rx = x * cyy + z * syw;
        const rz = -x * syw + z * cyy;
        const ry = dy * cp - rz * sp;
        const rz2 = dy * sp + rz * cp;
        if (rz2 < Z_NEAR) return null;
        return [cx + (F * rx) / rz2, cy - (F * ry) / rz2, rz2];
      };

      // ---- floor: perspective grid, fading toward the horizon ----
      // Longitudinal lines are infinite, so the dolly never moves them;
      // lateral lines live in world space and stream toward the viewer.
      ctx.lineWidth = 1;
      for (let kk = -8; kk <= 8; kk++) {
        const x = kk * GRID;
        for (let s = 0; s < SEG_Z.length - 1; s++) {
          const z0 = SEG_Z[s];
          const z1 = SEG_Z[s + 1];
          const a = project(x, 0, z0);
          const b = project(x, 0, z1);
          if (!a || !b) continue;
          ctx.strokeStyle = `rgba(${NAVY},${0.115 * (1 - (z0 + z1) / (2 * Z_FAR))})`;
          ctx.beginPath();
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
          ctx.stroke();
        }
      }
      for (let m = 1; m <= 17; m++) {
        const z = wrapZ(m * GRID);
        const a = project(-1200, 0, z);
        const b = project(1200, 0, z);
        if (!a || !b) continue;
        const alpha = Math.max(0, 0.09 * (1 - z / Z_FAR) + 0.012);
        ctx.strokeStyle = `rgba(${NAVY},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }

      // ---- horizon hairline + vanishing-point reticle ----
      {
        const vp = project(0, 0, Z_FAR * 4);
        if (vp) {
          ctx.strokeStyle = `rgba(${NAVY},0.05)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, vp[1]);
          ctx.lineTo(w, vp[1]);
          ctx.stroke();
          // Animus mark at the vanishing point — gold diamond + reticle
          ctx.strokeStyle = `rgba(${GOLD},0.55)`;
          ctx.lineWidth = 1.2;
          ctx.save();
          ctx.translate(vp[0], vp[1]);
          ctx.rotate(Math.PI / 4);
          ctx.strokeRect(-4, -4, 8, 8);
          ctx.restore();
          ctx.strokeStyle = `rgba(${NAVY},0.3)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(vp[0] - 8, vp[1]);
          ctx.lineTo(vp[0] + 8, vp[1]);
          ctx.moveTo(vp[0], vp[1] - 8);
          ctx.lineTo(vp[0], vp[1] + 8);
          ctx.stroke();
        }
      }

      // ---- floor shockwaves (3D circles on the ground plane) ----
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        if (animate) {
          rp.t += dt / 0.95;
          if (rp.t >= 1) {
            ripples.splice(i, 1);
            continue;
          }
        }
        const e = 1 - Math.pow(1 - Math.min(rp.t, 1), 3); // easeOutCubic
        const R = 80 + 720 * e;
        for (const [rad, alpha, width, color] of [
          [1, 0.55, 1.8, EMERALD],
          [0.62, 0.28, 1, GOLD],
        ] as const) {
          ctx.strokeStyle = `rgba(${color},${alpha * (1 - rp.t)})`;
          ctx.lineWidth = width;
          ctx.beginPath();
          let open = false;
          for (let a = 0; a <= 40; a++) {
            const ang = (a / 40) * Math.PI * 2;
            const p = project(
              rp.gx + R * rad * Math.cos(ang),
              4,
              rp.gz + R * rad * Math.sin(ang) - scrollZ
            );
            if (!p) {
              open = false;
              continue;
            }
            if (open) ctx.lineTo(p[0], p[1]);
            else {
              ctx.moveTo(p[0], p[1]);
              open = true;
            }
          }
          ctx.stroke();
        }
        // beacons flash as the wavefront passes through them
        if (animate) {
          for (const bcn of beacons) {
            const bz = wrapZ(bcn.z);
            const rz = rp.gz - scrollZ;
            const d = Math.hypot(bcn.x - rp.gx, bz - rz);
            const near = Math.abs(d - R);
            if (near < 90) bcn.flash = Math.max(bcn.flash, 1 - near / 90);
          }
        }
      }

      // ---- sky ripples (clicks above the horizon — flat screen rings) ----
      for (let i = skyRipples.length - 1; i >= 0; i--) {
        const rp = skyRipples[i];
        if (animate) {
          rp.t += dt / 0.8;
          if (rp.t >= 1) {
            skyRipples.splice(i, 1);
            continue;
          }
        }
        const e = 1 - Math.pow(1 - Math.min(rp.t, 1), 3);
        const R = 26 + 210 * e;
        // a rotating diamond ring — the Animus synchronize mark
        ctx.strokeStyle = `rgba(${EMERALD},${0.5 * (1 - rp.t)})`;
        ctx.lineWidth = 1.6;
        ctx.save();
        ctx.translate(rp.x, rp.y);
        ctx.rotate(Math.PI / 4);
        ctx.strokeRect(-R, -R, R * 2, R * 2);
        ctx.restore();
      }

      // ---- beacons: Animus glyphs with depth, heat and flash ----
      for (const bcn of beacons) {
        const bob = animate
          ? bcn.bobAmp * Math.sin(now * 0.0006 + bcn.bobPhase)
          : 0;
        const p = project(bcn.x, bcn.y + bob, wrapZ(bcn.z));
        if (!p) continue;
        const [sx, sy, depth] = p;

        if (animate) {
          let target = 0;
          if (mouse.seen) {
            const d = Math.hypot(sx - mouse.sx, sy - mouse.sy);
            if (d < 160) target = 1 - d / 160;
          }
          bcn.heat += (target - bcn.heat) * Math.min(1, dt * 7);
          if (bcn.flash > 0) bcn.flash = Math.max(0, bcn.flash - dt * 2.4);
        }

        const depthFade = Math.pow(1 - Math.min(1, depth / Z_FAR), 0.8);
        const glow = Math.min(1, bcn.heat * 0.85 + bcn.flash);
        const arm =
          Math.max(1.6, Math.min(5.5, (F * 1.45) / depth)) *
          (1 + 0.55 * bcn.heat + 0.4 * bcn.flash);
        const spin = bcn.flash * 0.7; // diamonds snap-rotate when synchronized

        // quiet navy base
        ctx.strokeStyle = `rgba(${NAVY},${0.16 * depthFade + 0.05})`;
        ctx.lineWidth = 1.3;
        drawGlyph(bcn.glyph, sx, sy, arm, spin);
        // ignited emerald overlay
        if (glow > 0.02) {
          ctx.strokeStyle = `rgba(${EMERALD},${0.9 * glow})`;
          ctx.lineWidth = 1.5;
          drawGlyph(bcn.glyph, sx, sy, arm, spin);
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
        cam.tYaw = (mouse.x / w - 0.5) * 0.18;
        cam.tPitch = (mouse.y / h - 0.5) * 0.09;
      }
      mouse.seen = true;
      if (Math.hypot(mouse.x - prevX, mouse.y - prevY) > 14) {
        trail.push({ x: e.clientX, y: e.clientY, age: 0 });
        if (trail.length > 14) trail.shift();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      firePulse(e.clientX, e.clientY);
      showHint(false);
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      scrollN = Math.min(1, window.scrollY / max);
      scrollZ = window.scrollY * 0.5;
    };

    const onResize = () => {
      // beacons live in world space — a resize just rescales the lens.
      // No rebuild, no teleporting, no blank frame.
      applySize();
      if (reduced) renderStatic();
    };

    applySize();
    if (reduced) {
      renderStatic();
    } else {
      onScroll(); // pick up mid-page loads (anchors, refreshes)
      raf = requestAnimationFrame(draw);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      hintTimer = setTimeout(() => showHint(false), 16000);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hintTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        {/* The 3D depth field: perspective floor grid, beacons, shockwaves */}
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>
      {/* Discoverability hint — its own fixed layer so it floats above
          section content; fades after the first pulse or 16s */}
      <div
        ref={hintRef}
        style={{ opacity: 0 }}
        className="chamfer-tag pointer-events-none fixed bottom-6 right-5 z-[60] flex items-center gap-2.5 border border-ink/15 bg-white/95 px-4 py-2.5 shadow-[0_10px_36px_-14px_rgba(10,37,64,0.4)] backdrop-blur-sm transition-opacity duration-1000 md:right-7"
      >
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
        <span className="font-body text-xs font-semibold tracking-[0.22em] text-ink-soft">
          CLICK / TAP — SYNCHRONIZE
        </span>
      </div>
    </>
  );
}
