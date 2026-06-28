'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

// ─── Variant definitions ────────────────────────────────────────────────────

export type ScratchCardVariant =
  | 'default' // dark zinc — neutral workhorse
  | 'gold' // amber/yellow — prize / premium feel
  | 'success' // emerald green — winner confirmation
  | 'brand' // indigo → violet gradient — on-brand celebration
  | 'mystery'; // deep space dark with subtle star noise — curiosity

const VARIANT_CLASSES: Record<ScratchCardVariant, string> = {
  default: 'bg-zinc-900 text-zinc-100',
  gold: 'bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 text-amber-950',
  success: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
  brand: 'bg-gradient-to-br from-orange-500 via-red-600 to-orange-400 text-white',
  mystery: 'bg-gradient-to-br from-neutral-950 via-blue-950 to-neutral-900 text-blue-200',
};

// ─── Confetti engine (canvas-based, scoped to the card) ─────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  life: number; // 0–1 countdown
  decay: number;
}

const CONFETTI_COLORS = [
  '#fbbf24',
  '#f87171',
  '#34d399',
  '#60a5fa',
  '#a78bfa',
  '#f472b6',
  '#facc15',
  '#4ade80',
];

function spawnConfetti(canvas: HTMLCanvasElement, count = 80): Particle[] {
  const { width, height } = canvas;
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 4;
    return {
      x: width / 2 + (Math.random() - 0.5) * width * 0.6,
      y: height / 2 + (Math.random() - 0.5) * height * 0.4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3, // slight upward bias
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 4 + Math.random() * 6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      life: 1,
      decay: 0.012 + Math.random() * 0.01,
    };
  });
}

function useConfettiCanvas(
  enabled: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  triggered: boolean
) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const particlesRef = React.useRef<Particle[]>([]);
  const rafRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (!enabled || !triggered) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const { width, height } = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    particlesRef.current = spawnConfetti(canvas, 90);

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      if (particlesRef.current.length === 0) return;

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // gravity
        p.vx *= 0.99; // air resistance
        p.rotation += p.rotationSpeed;
        p.life -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled, triggered, containerRef]);

  return canvasRef;
}

// ─── shadeColor helper ───────────────────────────────────────────────────────

function shadeColor(color: string, percent: number): string {
  const hexMatch = /^#([0-9a-f]{6})$/i.exec(color.trim());
  if (!hexMatch) return color;
  const num = parseInt(hexMatch[1], 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `rgb(${r}, ${g}, ${b})`;
}

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ScratchCardProps {
  /**
   * The reward to reveal. Can be a string (rendered with built-in
   * typography) or any ReactNode for full custom content.
   */
  reward?: React.ReactNode;

  /**
   * Visual variant for the built-in reward area.
   * Ignored when `reward` is a ReactNode rather than a string.
   * @default 'default'
   */
  variant?: ScratchCardVariant;

  /**
   * Optional sub-label shown beneath the reward string.
   * Only used when `reward` is a string.
   */
  rewardLabel?: string;

  /** Color of the scratch-off overlay. Any valid canvas fillStyle color. */
  overlayColor?: string;

  /** Label drawn on top of the overlay. Set to '' to omit. */
  overlayText?: string;

  /** Diameter of the "scratch brush" in CSS px. */
  brushSize?: number;

  /**
   * Fraction (0–1) of the overlay that must be cleared before the
   * reveal auto-completes.
   * @default 0.6
   */
  threshold?: number;

  /** Called once, the first time the threshold is crossed. */
  onComplete?: () => void;

  /**
   * Burst confetti from within the card on reveal.
   * Confetti is rendered on a canvas layered above the reward content
   * but below the scratch overlay, so it feels like it emerges from
   * behind the card when the overlay fades.
   * @default false
   */
  confetti?: boolean;

  /** Disables scratching entirely. */
  disabled?: boolean;

  className?: string;

  /** @deprecated use `reward` instead */
  children?: React.ReactNode;
}

export interface ScratchCardHandle {
  reveal: () => void;
  reset: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const ScratchCard = React.forwardRef<ScratchCardHandle, ScratchCardProps>(
  (
    {
      reward,
      variant = 'default',
      rewardLabel,
      overlayColor = '#a1a1aa',
      overlayText = 'Scratch to reveal',
      brushSize = 32,
      threshold = 0.6,
      onComplete,
      confetti: confettiEnabled = false,
      disabled = false,
      className,
      // legacy
      children,
    },
    forwardedRef
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const lastPointRef = React.useRef<{ x: number; y: number } | null>(null);
    const isScratchingRef = React.useRef(false);
    const completedRef = React.useRef(false);
    const checkScheduledRef = React.useRef(false);

    const [isCompleted, setIsCompleted] = React.useState(false);

    // Confetti fires once on reveal
    const confettiCanvasRef = useConfettiCanvas(confettiEnabled, containerRef, isCompleted);

    // ── Overlay draw ─────────────────────────────────────────────────────────

    const drawOverlay = React.useCallback(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';

      // Base fill
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, overlayColor);
      gradient.addColorStop(1, shadeColor(overlayColor, -14));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle diagonal shimmer stripe
      const shimmer = ctx.createLinearGradient(0, 0, width * 0.5, height);
      shimmer.addColorStop(0, 'rgba(255,255,255,0)');
      shimmer.addColorStop(0.4, 'rgba(255,255,255,0.07)');
      shimmer.addColorStop(0.5, 'rgba(255,255,255,0.13)');
      shimmer.addColorStop(0.6, 'rgba(255,255,255,0.07)');
      shimmer.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = shimmer;
      ctx.fillRect(0, 0, width, height);

      // Coin-texture dots
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      for (let row = 0; row < height; row += 10) {
        for (let col = 0; col < width; col += 10) {
          ctx.beginPath();
          ctx.arc(col, row, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (overlayText) {
        const fontSize = Math.max(14, Math.min(18, width / 14));
        ctx.font = `600 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillText(overlayText, width / 2 + 1, height / 2 + 1);
        // Text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(overlayText, width / 2, height / 2);
      }
    }, [overlayColor, overlayText]);

    // ── Lifecycle ────────────────────────────────────────────────────────────

    const completeReveal = React.useCallback(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      setIsCompleted(true);
      onComplete?.();
    }, [onComplete]);

    const reveal = React.useCallback(() => completeReveal(), [completeReveal]);

    const reset = React.useCallback(() => {
      completedRef.current = false;
      isScratchingRef.current = false;
      lastPointRef.current = null;
      setIsCompleted(false);
      drawOverlay();
    }, [drawOverlay]);

    React.useImperativeHandle(forwardedRef, () => ({ reveal, reset }), [reveal, reset]);

    React.useEffect(() => {
      drawOverlay();
      const container = containerRef.current;
      if (!container) return;
      const observer = new ResizeObserver(() => {
        if (!completedRef.current) drawOverlay();
      });
      observer.observe(container);
      return () => observer.disconnect();
    }, [drawOverlay]);

    // ── Scratch logic ────────────────────────────────────────────────────────

    const checkProgress = React.useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || completedRef.current) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const { width, height } = canvas;
      const data = ctx.getImageData(0, 0, width, height).data;
      let cleared = 0,
        sampled = 0;
      const step = 8 * 4;
      for (let i = 3; i < data.length; i += step) {
        sampled++;
        if (data[i] === 0) cleared++;
      }
      if (sampled > 0 && cleared / sampled >= threshold) completeReveal();
    }, [threshold, completeReveal]);

    const scheduleCheck = React.useCallback(() => {
      if (checkScheduledRef.current) return;
      checkScheduledRef.current = true;
      requestAnimationFrame(() => {
        checkScheduledRef.current = false;
        checkProgress();
      });
    }, [checkProgress]);

    const scratchTo = React.useCallback(
      (x: number, y: number) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = brushSize;
        const last = lastPointRef.current;
        ctx.beginPath();
        if (last) {
          ctx.moveTo(last.x, last.y);
          ctx.lineTo(x, y);
        } else {
          ctx.moveTo(x, y);
          ctx.lineTo(x + 0.01, y + 0.01);
        }
        ctx.stroke();
        lastPointRef.current = { x, y };
      },
      [brushSize]
    );

    const getRelativePoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handlePointerDown = React.useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (disabled || completedRef.current) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        isScratchingRef.current = true;
        lastPointRef.current = null;
        const { x, y } = getRelativePoint(e);
        scratchTo(x, y);
        scheduleCheck();
      },
      [disabled, scratchTo, scheduleCheck]
    );

    const handlePointerMove = React.useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isScratchingRef.current || completedRef.current) return;
        const { x, y } = getRelativePoint(e);
        scratchTo(x, y);
        scheduleCheck();
      },
      [scratchTo, scheduleCheck]
    );

    const stopScratching = React.useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      isScratchingRef.current = false;
      lastPointRef.current = null;
    }, []);

    // ── Reward content area ──────────────────────────────────────────────────

    const rewardContent =
      children ??
      (typeof reward === 'string' || (typeof reward !== 'object' && reward != null) ? (
        <div
          className={cn(
            'flex h-full w-full flex-col items-center justify-center gap-1 px-4 py-3',
            VARIANT_CLASSES[variant]
          )}
        >
          <span className="text-3xl leading-none font-black tracking-tight">{reward}</span>
          {rewardLabel && (
            <span className="text-xs font-medium tracking-widest uppercase opacity-70">
              {rewardLabel}
            </span>
          )}
        </div>
      ) : (
        <div
          className={cn('flex h-full w-full items-center justify-center', VARIANT_CLASSES[variant])}
        >
          {reward}
        </div>
      ));

    // ── Render ───────────────────────────────────────────────────────────────

    return (
      <div ref={containerRef} className={cn('relative overflow-hidden rounded-xl', className)}>
        {/* 1 — Reward content (bottommost) */}
        <div className="absolute inset-0">{rewardContent}</div>

        {/* 2 — Confetti canvas (above reward, below overlay) */}
        {confettiEnabled && (
          <canvas
            ref={confettiCanvasRef}
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
        )}

        {/* 3 — Scratch overlay */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: isCompleted ? 0 : 1 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          style={{ pointerEvents: isCompleted || disabled ? 'none' : 'auto' }}
          aria-hidden="true"
        >
          <canvas
            ref={canvasRef}
            className="touch-none select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopScratching}
            onPointerCancel={stopScratching}
            onPointerLeave={(e) => {
              if (isScratchingRef.current) stopScratching(e);
            }}
          />
        </motion.div>

        {/* 4 — Keyboard / a11y reveal button */}
        <AnimatePresence>
          {!isCompleted && !disabled && (
            <motion.button
              type="button"
              onClick={reveal}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="focus-visible:outline-ring absolute right-2 bottom-2 z-10 rounded-md bg-black/30 px-2 py-1 text-xs text-white/80 backdrop-blur-sm hover:bg-black/50 focus-visible:outline focus-visible:outline-2"
            >
              Reveal
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ScratchCard.displayName = 'ScratchCard';
