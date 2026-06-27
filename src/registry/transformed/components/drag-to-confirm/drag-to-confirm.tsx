'use client';

import * as React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

/* ----------------------------------------------------------------------- */
/*  Types                                                                   */
/* ----------------------------------------------------------------------- */

export type DragToConfirmStatus = 'idle' | 'dragging' | 'confirming' | 'confirmed' | 'error';

export interface DragToConfirmProps {
  label?: string;
  confirmedLabel?: string;
  threshold?: number;
  onConfirm?: () => void | boolean | Promise<void | boolean>;
  disabled?: boolean;
  confirmed?: boolean;
  resetKey?: string | number;
  dir?: 'ltr' | 'rtl';
  thumbContent?: React.ReactNode;
  confirmedThumbContent?: React.ReactNode;
  thumbSize?: number;
  height?: number;
  variant?: 'danger' | 'neutral' | 'success';
  className?: string;
  style?: React.CSSProperties;
  thumbClassName?: string;
  'aria-label'?: string;
  id?: string;
  name?: string;
}

export interface DragToConfirmRef {
  reset: () => void;
  confirm: () => void;
}

/* ----------------------------------------------------------------------- */
/*  Tokens                                                                  */
/* ----------------------------------------------------------------------- */

const VARIANT_CLASSES: Record<
  NonNullable<DragToConfirmProps['variant']>,
  { track: string; trackFill: string; thumb: string; thumbConfirmed: string; ring: string }
> = {
  danger: {
    track: 'bg-red-800 dark:bg-red-950',
    trackFill: 'bg-red-700 dark:bg-red-900/70',
    thumb: 'bg-red-600 dark:bg-red-500',
    thumbConfirmed: 'bg-green-600 dark:bg-green-500',
    ring: 'focus-visible:ring-red-600 dark:focus-visible:ring-red-500',
  },
  neutral: {
    track: 'bg-zinc-400 dark:bg-zinc-800',
    trackFill: 'bg-zinc-500 dark:bg-zinc-700',
    thumb: 'bg-zinc-900 dark:bg-muted-foreground',
    thumbConfirmed: 'bg-green-600 dark:bg-green-500',
    ring: 'focus-visible:ring-zinc-500 dark:focus-visible:ring-zinc-400',
  },
  success: {
    track: 'bg-green-100 dark:bg-green-950/60',
    trackFill: 'bg-green-200 dark:bg-green-900/70',
    thumb: 'bg-green-600 dark:bg-green-500',
    thumbConfirmed: 'bg-green-600 dark:bg-green-500',
    ring: 'focus-visible:ring-green-600 dark:focus-visible:ring-green-500',
  },
};

const SPRING = { type: 'spring' as const, stiffness: 500, damping: 40 };

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* ----------------------------------------------------------------------- */
/*  Component                                                               */
/* ----------------------------------------------------------------------- */

export const DragToConfirm = React.forwardRef<DragToConfirmRef, DragToConfirmProps>(
  function DragToConfirm(
    {
      label = 'Drag to confirm',
      confirmedLabel = 'Confirmed',
      threshold = 0.9,
      onConfirm,
      disabled = false,
      confirmed: confirmedProp,
      resetKey,
      dir = 'ltr',
      thumbContent,
      confirmedThumbContent,
      thumbSize = 56,
      height = 56,
      variant = 'neutral',
      className,
      style,
      thumbClassName,
      id,
      name,
      ...rest
    },
    ref
  ) {
    const isControlled = confirmedProp !== undefined;
    const reducedMotion = usePrefersReducedMotion();
    const clampedThreshold = Math.min(Math.max(threshold, 0), 1);

    const trackRef = React.useRef<HTMLDivElement>(null);
    const [trackWidth, setTrackWidth] = React.useState(0);
    const [status, setStatus] = React.useState<DragToConfirmStatus>(
      confirmedProp ? 'confirmed' : 'idle'
    );
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const isMountedRef = React.useRef(true);

    const maxDrag = Math.max(trackWidth - thumbSize, 0);
    const sign = dir === 'rtl' ? -1 : 1;
    const target = maxDrag * sign;

    const rawX = useMotionValue(0);
    const progress = useTransform(rawX, (v) => (maxDrag > 0 ? Math.abs(v) / maxDrag : 0));
    const fillWidth = useTransform(rawX, (v) => Math.abs(v) + thumbSize / 2);
    const labelOpacity = useTransform(progress, (p) => Math.max(1 - p * 1.6, 0));

    const statusRef = React.useRef(status);
    statusRef.current = status;

    const tokens = VARIANT_CLASSES[variant];

    /* ---- measure ---- */
    React.useEffect(() => {
      const el = trackRef.current;
      if (!el) return;
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setTrackWidth(entry.contentRect.width);
        }
      });
      ro.observe(el);
      setTrackWidth(el.getBoundingClientRect().width);
      return () => ro.disconnect();
    }, []);

    /* ---- pin on resize ---- */
    React.useEffect(() => {
      if (status === 'confirmed') {
        rawX.set(target);
      } else if (status === 'idle') {
        rawX.set(0);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target]);

    React.useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    /* ---- controlled sync ---- */
    const prevConfirmedProp = React.useRef(confirmedProp);
    React.useEffect(() => {
      if (!isControlled) return;
      if (confirmedProp === prevConfirmedProp.current) return;
      prevConfirmedProp.current = confirmedProp;
      if (confirmedProp) {
        setStatus('confirmed');
        if (reducedMotion) rawX.set(target);
        else animate(rawX, target, SPRING);
      } else {
        setStatus('idle');
        if (reducedMotion) rawX.set(0);
        else animate(rawX, 0, SPRING);
      }
    }, [confirmedProp, isControlled, reducedMotion, rawX, target]);

    /* ---- reset ---- */
    const resetTo = React.useCallback(
      (immediate = false) => {
        setStatus('idle');
        setErrorMessage(null);
        if (immediate || reducedMotion) rawX.set(0);
        else animate(rawX, 0, SPRING);
      },
      [reducedMotion, rawX]
    );

    const firstResetRef = React.useRef(true);
    React.useEffect(() => {
      if (resetKey === undefined) return;
      if (firstResetRef.current) {
        firstResetRef.current = false;
        return;
      }
      resetTo();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetKey]);

    const lockAtEnd = React.useCallback(() => {
      if (reducedMotion) rawX.set(target);
      else animate(rawX, target, SPRING);
    }, [reducedMotion, rawX, target]);

    const runConfirm = React.useCallback(async () => {
      lockAtEnd();
      setStatus('confirming');
      setErrorMessage(null);
      try {
        const result = await onConfirm?.();
        if (!isMountedRef.current) return;
        if (result === false) {
          setErrorMessage("Couldn't confirm. Try again.");
          setStatus('error');
          resetTo();
          return;
        }
        if (!isControlled) setStatus('confirmed');
      } catch {
        if (!isMountedRef.current) return;
        setErrorMessage('Something went wrong. Try again.');
        setStatus('error');
        resetTo();
      }
    }, [onConfirm, isControlled, lockAtEnd, resetTo]);

    /* ---- drag ---- */
    const handleDragStart = React.useCallback(() => {
      if (disabled || statusRef.current === 'confirmed' || statusRef.current === 'confirming')
        return;
      setStatus('dragging');
    }, [disabled]);

    const handleDragEnd = React.useCallback(() => {
      if (disabled || statusRef.current === 'confirmed' || statusRef.current === 'confirming')
        return;
      const current = Math.abs(rawX.get());
      const ratio = maxDrag > 0 ? current / maxDrag : 0;
      if (ratio >= clampedThreshold) {
        void runConfirm();
      } else {
        setStatus('idle');
        animate(rawX, 0, SPRING);
      }
    }, [disabled, maxDrag, clampedThreshold, runConfirm, rawX]);

    /* ---- keyboard ---- */
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled || status === 'confirmed' || status === 'confirming') return;
        if (maxDrag <= 0 && e.key !== 'Enter' && e.key !== ' ') return;

        const step = Math.max(maxDrag / 10, 1) * sign;
        const current = rawX.get();
        const clampForward = (v: number) =>
          sign > 0 ? Math.min(Math.max(v, 0), target) : Math.max(Math.min(v, 0), target);

        const forwardKeys = dir === 'rtl' ? ['ArrowLeft'] : ['ArrowRight'];
        const backwardKeys = dir === 'rtl' ? ['ArrowRight'] : ['ArrowLeft'];

        if (forwardKeys.includes(e.key)) {
          e.preventDefault();
          const next = clampForward(current + step);
          rawX.set(next);
          setStatus(next !== 0 ? 'dragging' : 'idle');
        } else if (backwardKeys.includes(e.key)) {
          e.preventDefault();
          const next = clampForward(current - step);
          rawX.set(next);
          setStatus(next !== 0 ? 'dragging' : 'idle');
        } else if (e.key === 'Home') {
          e.preventDefault();
          rawX.set(0);
          setStatus('idle');
        } else if (e.key === 'End') {
          e.preventDefault();
          rawX.set(target);
          void runConfirm();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const ratio = maxDrag > 0 ? Math.abs(rawX.get()) / maxDrag : 0;
          if (ratio >= clampedThreshold) {
            void runConfirm();
          } else {
            const next = clampForward(current + step);
            rawX.set(next);
            setStatus(next !== 0 ? 'dragging' : 'idle');
          }
        }
      },
      [disabled, status, maxDrag, dir, sign, target, clampedThreshold, runConfirm, rawX]
    );

    React.useImperativeHandle(
      ref,
      () => ({
        reset: () => resetTo(),
        confirm: () => {
          if (disabled) return;
          rawX.set(target);
          void runConfirm();
        },
      }),
      [resetTo, runConfirm, disabled, target, rawX]
    );

    /* ---- progress for aria ---- */
    const [progressPercent, setProgressPercent] = React.useState(0);
    React.useEffect(() => {
      const unsubscribe = progress.on('change', (p) => {
        const pct = Math.round(p * 100);
        setProgressPercent((prev) => (prev === pct ? prev : pct));
      });
      return unsubscribe;
    }, [progress]);

    const isInteractive = !disabled && status !== 'confirmed' && status !== 'confirming';
    const isDone = status === 'confirmed';
    const defaultArrow = dir === 'rtl' ? '\u2190' : '\u2192';

    return (
      <div className={cn('relative w-full', className)} style={style}>
        <div
          ref={trackRef}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={isDone ? 100 : progressPercent}
          aria-valuetext={isDone ? confirmedLabel : `${progressPercent}% \u2014 ${label}`}
          aria-label={rest['aria-label'] ?? label}
          aria-disabled={disabled || undefined}
          aria-readonly={isDone || undefined}
          dir={dir}
          tabIndex={disabled ? -1 : 0}
          id={id}
          onKeyDown={handleKeyDown}
          className={cn(
            'relative w-full overflow-hidden select-none',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            tokens.track,
            tokens.ring,
            disabled ? 'cursor-not-allowed opacity-50' : isDone ? 'cursor-default' : 'cursor-grab',
            disabled ? 'touch-none' : 'touch-none'
          )}
          style={{ height, borderRadius: height / 2 }}
        >
          {/* fill */}
          <motion.div
            aria-hidden
            className={cn(
              'absolute top-0 bottom-0',
              dir === 'rtl' ? 'right-0' : 'left-0',
              tokens.trackFill
            )}
            style={{ width: fillWidth, borderRadius: height / 2 }}
          />

          {/* label */}
          <motion.div
            aria-hidden
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              'text-sm font-medium tracking-wide text-white',
              'overflow-hidden text-center text-ellipsis whitespace-nowrap',
              'pointer-events-none'
            )}
            style={{
              opacity: isDone ? 0 : labelOpacity,
              paddingInline: thumbSize + 12,
            }}
          >
            {label}
          </motion.div>

          {/* confirmed label */}
          {isDone && (
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : 0.15, duration: 0.2 }}
              className={cn(
                'absolute inset-0 flex items-center justify-center',
                'text-sm font-semibold text-white',
                'overflow-hidden text-center text-ellipsis whitespace-nowrap',
                'pointer-events-none'
              )}
              style={{ paddingInline: thumbSize + 12 }}
            >
              {confirmedLabel}
            </motion.div>
          )}

          {/* thumb */}
          <motion.div
            className={cn(
              'absolute top-0.5',
              dir === 'rtl' ? 'right-0.5' : 'left-0.5',
              'flex items-center justify-center',
              'z-10 shadow-md',
              tokens.thumb,
              thumbClassName
            )}
            drag={isInteractive && maxDrag > 0 ? 'x' : false}
            dragConstraints={
              dir === 'rtl' ? { left: -maxDrag, right: 0 } : { left: 0, right: maxDrag }
            }
            dragElastic={0}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
              x: rawX,
              width: thumbSize - 4,
              height: height - 4,
              borderRadius: (height - 4) / 2,
              cursor: disabled ? 'not-allowed' : isDone ? 'default' : 'grab',
            }}
            whileDrag={reducedMotion ? undefined : { cursor: 'grabbing', scale: 1.04 }}
            animate={
              status === 'confirming' && !reducedMotion ? { scale: [1, 0.92, 1] } : undefined
            }
            transition={
              status === 'confirming'
                ? { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
                : SPRING
            }
          >
            {isDone ? (
              (confirmedThumbContent ?? <Check className="size-5 text-white" />)
            ) : status === 'confirming' ? (
              <Spinner />
            ) : (
              (thumbContent ?? (
                <span aria-hidden className="text-lg text-white">
                  {defaultArrow}
                </span>
              ))
            )}
          </motion.div>
        </div>

        {/* form input */}
        {name && <input type="hidden" name={name} value={isDone ? 'confirmed' : 'idle'} />}

        {/* live region */}
        <span
          aria-live="polite"
          className="absolute h-px w-px overflow-hidden whitespace-nowrap"
          style={{ clipPath: 'inset(50%)' }}
        >
          {status === 'confirming' && 'Confirming\u2026'}
          {status === 'confirmed' && confirmedLabel}
          {status === 'error' && errorMessage}
        </span>
      </div>
    );
  }
);

DragToConfirm.displayName = 'DragToConfirm';

/* ----------------------------------------------------------------------- */
/*  Spinner                                                                 */
/* ----------------------------------------------------------------------- */

function Spinner() {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-white"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    >
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </motion.svg>
  );
}

export default DragToConfirm;
