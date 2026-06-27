'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { LinkedListStep } from '@/modules/theia/types/linked-list';
import { cn } from '@/lib/utils';

const STATUS_CLASS: Record<string, string> = {
  default: 'border-border bg-background text-foreground',
  active: 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  comparing: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  found: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  new: 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400',
  removing: 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

export function LinkedListArena({ step }: { step: LinkedListStep }) {
  const pointerMap = new Map(step.pointerLabel?.map((p) => [p.nodeId, p.label]) ?? []);

  return (
    <div className="bg-surface inset-ring-border/64 relative flex min-h-64 w-full items-center gap-0 overflow-x-auto rounded-xl p-6 inset-ring-1">
      {step.nodes.length === 0 ? (
        <p className="text-muted-foreground mx-auto text-sm">
          List is empty. Insert a node to get started.
        </p>
      ) : (
        <div className="flex items-center gap-0">
          <AnimatePresence initial={false} mode="popLayout">
            {step.nodes.map((node, idx) => {
              const status = step.highlights[node.id] ?? 'default';
              const isLast = idx === step.nodes.length - 1;
              const pointerLabel = pointerMap.get(node.id);

              return (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  className="flex items-center"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    {pointerLabel && (
                      <span className="text-muted-foreground font-mono text-[10px] tracking-wide uppercase">
                        {pointerLabel}
                      </span>
                    )}

                    <div
                      className={cn(
                        'flex h-14 w-16 shrink-0 items-center justify-center rounded-lg border-2 font-mono text-base font-medium shadow-sm transition-colors duration-200',
                        STATUS_CLASS[status]
                      )}
                    >
                      {node.value}
                    </div>

                    <span className="text-muted-foreground font-mono text-[10px]">
                      {idx === 0 ? 'head' : isLast ? 'tail' : idx}
                    </span>
                  </div>

                  {!isLast && (
                    <svg
                      width="40"
                      height="20"
                      viewBox="0 0 40 20"
                      className="text-muted-foreground mx-1 shrink-0"
                    >
                      <line
                        x1="0"
                        y1="10"
                        x2="32"
                        y2="10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <polygon points="32,5 40,10 32,15" fill="currentColor" />
                    </svg>
                  )}

                  {isLast && (
                    <span className="text-muted-foreground ml-2 font-mono text-xs">→ null</span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
