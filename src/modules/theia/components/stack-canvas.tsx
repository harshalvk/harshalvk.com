'use client';

import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { StackFrame } from '@/modules/theia/types/problem';

const HIGHLIGHT_CLASS: Record<StackFrame['highlight'], string> = {
  default: 'border-border bg-background',
  push: 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  pop: 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400',
  compare: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

export function StackCanvas({ input, frame }: { input: string; frame: StackFrame }) {
  return (
    <div className="bg-surface inset-ring-border/64 flex h-[340px] flex-col gap-6 rounded-xl p-6 inset-ring-1">
      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-xs">Input</span>
        <div className="flex gap-1 font-mono text-lg">
          {input.split('').map((char, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-md border transition-colors',
                  idx === frame.currentIndex ? 'border-primary bg-primary/10' : 'border-transparent'
                )}
              >
                {char}
              </span>
              {idx === frame.currentIndex && (
                <motion.div layoutId="cursor" className="bg-primary h-0.5 w-5 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-end gap-2">
        <span className="text-muted-foreground text-xs">Stack</span>
        <div className="flex min-h-40 flex-col-reverse items-center gap-1.5">
          <AnimatePresence initial={false}>
            {frame.stack.map((char, idx) => (
              <motion.div
                key={`${idx}-${char}`}
                layout
                initial={{ opacity: 0, y: -12, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                className={cn(
                  'flex h-10 w-16 items-center justify-center rounded-md border-2 font-mono text-base font-medium',
                  idx === frame.stack.length - 1
                    ? HIGHLIGHT_CLASS[frame.highlight]
                    : HIGHLIGHT_CLASS.default
                )}
              >
                {char}
              </motion.div>
            ))}
          </AnimatePresence>
          {frame.stack.length === 0 && (
            <div className="border-border text-muted-foreground flex h-10 w-16 items-center justify-center rounded-md border border-dashed text-xs">
              empty
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
