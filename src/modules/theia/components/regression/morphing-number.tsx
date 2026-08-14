'use client';

import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

function formatValue(value: number, decimals: number): string {
  return value.toFixed(decimals);
}

/**
 * Renders a number as individually-morphing characters — each digit
 * slides out/in independently when it changes, like an odometer,
 * rather than the whole string fading as one block.
 */
export function MorphingNumber({
  value,
  decimals = 3,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const formatted = formatValue(value, decimals);
  const chars = formatted.split('');

  return (
    <motion.span layout className={cn('inline-flex tabular-nums', className)}>
      {chars.map((char, i) => (
        <span key={i} className="relative inline-block h-[1.2em] overflow-hidden">
          {/* Invisible sizer keeps column width stable so siblings don't jitter */}
          <span className="invisible">{char === '-' ? '−' : char === '.' ? '.' : '0'}</span>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={char}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {char === '-' ? '−' : char}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </motion.span>
  );
}
