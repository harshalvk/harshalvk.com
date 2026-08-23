'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */

export interface AsciiDitherProps {
  /**
   * Character ramp from sparse → dense.
   * Any string works — shorter ramps produce a chunkier look,
   * longer ones give smoother gradients.
   * @default " .:-=+*#%@"
   */
  ramp?: string;

  /**
   * Size of each character cell in px.
   * Smaller = more detail, higher GPU cost.
   * @default 13
   */
  cellSize?: number;

  /**
   * Animation speed multiplier. 1 = default, 0 = frozen, 2 = double speed.
   * @default 1
   */
  speed?: number;

  /**
   * Radius (in px) of the cursor glow effect.
   * @default 180
   */
  glowRadius?: number;

  /**
   * How much the cursor boosts local brightness (0–1).
   * 0 disables the cursor effect entirely.
   * @default 0.55
   */
  glowStrength?: number;

  /**
   * Low-brightness character color — CSS color string.
   * @default "rgba(71,12,6,<alpha>)"   (dark ember)
   */
  colorLow?: string;

  /**
   * Mid-brightness character color.
   * @default "rgba(183,65,14,<alpha>)"  (ember)
   */
  colorMid?: string;

  /**
   * High-brightness character color.
   * @default "rgba(204,85,0,<alpha>)"   (orange)
   */
  colorHigh?: string;

  /**
   * Base opacity of characters at minimum brightness (0–1).
   * Raise this to make the field denser on dark backgrounds.
   * @default 0.08
   */
  alphaBase?: number;

  /**
   * Maximum opacity cap for any single character (0–1).
   * @default 0.85
   */
  alphaMax?: number;

  /**
   * Dithering spread — how far the Bayer threshold shifts brightness.
   * 0 = no dithering (smooth gradient), 1 = full dithering (high contrast).
   * @default 0.5
   */
  ditherSpread?: number;

  /**
   * Whether to listen for pointer events and show the cursor glow.
   * Set to false if this is purely decorative and you want zero interaction cost.
   * @default true
   */
  interactive?: boolean;

  className?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Bayer 4×4 ordered-dither matrix, normalised to 0..1
───────────────────────────────────────────────────────────────────────────── */

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16);

/* ─────────────────────────────────────────────────────────────────────────────
   Layered-sine scalar field
   Returns a value in −1..1 based on grid position and time.
   Four overlapping sine waves at different frequencies and phases give
   a smooth, non-repeating (over human-noticeable timescales) ripple.
───────────────────────────────────────────────────────────────────────────── */

function fieldValue(col: number, row: number, t: number): number {
  const a = Math.sin(col * 0.09 + t * 0.5);
  const b = Math.sin(row * 0.11 - t * 0.35);
  const c = Math.sin((col + row) * 0.05 + t * 0.25);
  const d = Math.sin(Math.sqrt(col * col + row * row) * 0.09 - t * 0.6);
  return (a + b + c + d) / 4;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────────── */

/** Parse an "r,g,b" string out of a CSS rgba(...) value, or return the raw string */
function extractRGB(color: string): string {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? `${m[1]},${m[2]},${m[3]}` : color;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────────── */

export function AsciiDither({
  ramp = ' .:-=+*#%@',
  cellSize = 13,
  speed = 1,
  glowRadius = 180,
  glowStrength = 0.55,
  colorLow = 'rgba(71,12,6,1)',
  colorMid = 'rgba(183,65,14,1)',
  colorHigh = 'rgba(204,85,0,1)',
  alphaBase = 0.08,
  alphaMax = 0.85,
  ditherSpread = 0.5,
  interactive = true,
  className,
}: AsciiDitherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  // Pre-extract RGB triples once so the draw loop doesn't parse strings every frame
  const rgbLow = extractRGB(colorLow);
  const rgbMid = extractRGB(colorMid);
  const rgbHigh = extractRGB(colorHigh);

  // Stable refs for props that the draw loop captures, so changing them
  // causes the next frame to pick up the new value without restarting the loop.
  const propsRef = useRef({
    ramp,
    cellSize,
    speed,
    glowRadius,
    glowStrength,
    rgbLow,
    rgbMid,
    rgbHigh,
    alphaBase,
    alphaMax,
    ditherSpread,
    interactive,
  });
  useEffect(() => {
    propsRef.current = {
      ramp,
      cellSize,
      speed,
      glowRadius,
      glowStrength,
      rgbLow,
      rgbMid,
      rgbHigh,
      alphaBase,
      alphaMax,
      ditherSpread,
      interactive,
    };
  });

  useEffect(() => {
    // Assign to non-nullable locals right after the null guards.
    // Every nested fn (resize, draw, loop, handlers) closes over these,
    // so TypeScript sees them as non-null — fixes all TS18047 errors.
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    // These two are the non-nullable refs used everywhere below.
    const canvas: HTMLCanvasElement = canvasEl;
    const safeCtx: CanvasRenderingContext2D = ctx;

    // ── Reduced-motion: reactive via MediaQueryList, not one-shot ──────────
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = motionQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
      // If the user turns reduced motion OFF mid-session, restart the loop.
      if (!reduceMotion && !rafId) {
        rafId = requestAnimationFrame(loop);
      }
    };
    motionQuery.addEventListener('change', onMotionChange);

    // ── Geometry ────────────────────────────────────────────────────────────
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let running = true;
    let rafId = 0;

    function resize() {
      const p = propsRef.current;
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      safeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / p.cellSize) + 1;
      rows = Math.ceil(height / p.cellSize) + 1;
      safeCtx.font = `${p.cellSize - 2}px var(--font-mono, ui-monospace, monospace)`;
      safeCtx.textBaseline = 'top';
    }

    // ── Draw ────────────────────────────────────────────────────────────────
    function draw(tSeconds: number) {
      const p = propsRef.current;
      const cell = p.cellSize;

      // Re-apply font in case cellSize prop changed between frames
      safeCtx.font = `${cell - 2}px var(--font-mono, ui-monospace, monospace)`;
      safeCtx.textBaseline = 'top';

      // Recompute grid dimensions if cellSize changed
      const newCols = Math.ceil(width / cell) + 1;
      const newRows = Math.ceil(height / cell) + 1;
      if (newCols !== cols || newRows !== rows) {
        cols = newCols;
        rows = newRows;
      }

      safeCtx.clearRect(0, 0, width, height);

      const mx = p.interactive ? mouse.current.x : -9999;
      const my = p.interactive ? mouse.current.y : -9999;
      const rampLen = p.ramp.length;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * cell;
          const y = row * cell;

          const raw = fieldValue(col, row, tSeconds); // −1..1
          let brightness = (raw + 1) / 2; // 0..1

          // Cursor glow
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const glow = p.glowRadius > 0 ? Math.max(0, 1 - dist / p.glowRadius) * p.glowStrength : 0;
          brightness = Math.min(1, brightness + glow);

          // Bayer ordered dithering
          const threshold = BAYER4[(row % 4) * 4 + (col % 4)];
          const dithered = Math.min(
            0.999,
            Math.max(0, brightness + (threshold - 0.5) * p.ditherSpread)
          );

          const charIdx = Math.floor(dithered * rampLen);
          const char = p.ramp[charIdx];
          if (!char || char === ' ') continue;

          const alpha = Math.min(p.alphaMax, p.alphaBase + brightness * 0.4 + glow * 0.35);

          const rgb = brightness > 0.6 ? p.rgbHigh : brightness > 0.35 ? p.rgbMid : p.rgbLow;

          safeCtx.fillStyle = `rgba(${rgb},${alpha})`;
          safeCtx.fillText(char, x, y);
        }
      }
    }

    // ── Loop ────────────────────────────────────────────────────────────────
    function loop(ts: number) {
      if (!running) return;
      if (reduceMotion) {
        // Keep the raf alive but skip drawing — if the user turns motion back
        // on, we resume immediately on the next frame.
        rafId = requestAnimationFrame(loop);
        return;
      }
      const t = (ts / 1000) * propsRef.current.speed;
      draw(t);
      rafId = requestAnimationFrame(loop);
    }

    // ── Pointer — scoped to parent element, not window ───────────────────
    // Scoping to the parent means two instances on the same page each only
    // respond to their own cursor, and neither leaks a global listener.
    const container = canvas.parentElement!;

    function onPointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onPointerLeave() {
      mouse.current = { x: -9999, y: -9999 };
    }

    // ── ResizeObserver — catches container resizes, not just window ───────
    const ro = new ResizeObserver(() => {
      resize();
      // Redraw a static frame immediately so the resize doesn't flash blank.
      if (reduceMotion) draw(0);
    });
    ro.observe(container);

    // ── Boot ────────────────────────────────────────────────────────────────
    resize();

    if (interactive) {
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerleave', onPointerLeave);
    }

    if (reduceMotion) {
      draw(0); // single static frame
    } else {
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      motionQuery.removeEventListener('change', onMotionChange);
      if (interactive) {
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', onPointerLeave);
      }
    };
    // Props changes are handled via propsRef — intentionally not in dep array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className={cn('pointer-events-none', className)} aria-hidden />;
}

export default AsciiDither;
