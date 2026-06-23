'use client';

import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { ArrayStep } from '@/modules/theia/types/algorithm';

export function StepExplanation({
  steps,
  currentStep,
  onStepSelect,
  totalSteps,
}: {
  steps: ArrayStep[];
  currentStep: number;
  onStepSelect: (index: number) => void;
  totalSteps: number;
}) {
  const [open, setOpen] = useState(false);
  const step = steps[currentStep];

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="bg-surface inset-ring-border/64 rounded-xl inset-ring-1"
    >
      <CollapsibleTrigger className="flex w-full items-start justify-between gap-3 p-4 text-left">
        <div className="flex-1">
          <p className="text-sm leading-relaxed">{step.description}</p>

          {(step.comparisons !== undefined || step.swaps !== undefined) && (
            <div className="text-muted-foreground mt-3 flex gap-4 font-mono text-xs">
              {step.comparisons !== undefined && <span>Comparisons: {step.comparisons}</span>}
              {step.swaps !== undefined && <span>Swaps: {step.swaps}</span>}
            </div>
          )}
        </div>
        <span className="text-muted-foreground ml-auto font-mono text-xs">
          Step {currentStep + 1} / {totalSteps}
        </span>

        <ChevronDownIcon
          className={cn(
            'text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform',
            open && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="max-h-80 overflow-y-auto border-t">
          {steps.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onStepSelect(idx)}
              className={cn(
                'border-border hover:bg-muted/50 flex w-full items-start gap-3 border-b border-dashed px-4 py-2 text-left text-sm transition-all duration-200 last:border-b-0',
                idx === currentStep && 'bg-primary/10 text-primary'
              )}
            >
              <span
                className={cn(
                  'text-muted-foreground w-8 shrink-0 font-mono text-xs',
                  idx === currentStep && 'text-primary font-medium'
                )}
              >
                {idx + 1}
              </span>

              <span
                className={cn(
                  'text-muted-foreground flex-1',
                  idx === currentStep && 'text-foreground font-medium'
                )}
              >
                {s.description}
              </span>
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
