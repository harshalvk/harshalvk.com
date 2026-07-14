'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrayBars } from './array-bars';
import { LinkedListArena } from './linked-list-arena';
import { StackCanvas } from './stack-canvas';
import { StepExplanation } from './step-explanation';
import type { ProblemMeta } from '@/modules/theia/types/problem';
import type { ArrayStep } from '@/modules/theia/types/algorithm';
import type { LinkedListStep } from '@/modules/theia/types/linked-list';
import type { StackStep } from '@/modules/theia/types/problem';
import { ProblemsVisualizationGenerator } from '../data/problems';

export function ProblemVisualizer({ problem }: { problem: ProblemMeta }) {
  const visualizer =
    ProblemsVisualizationGenerator[problem.slug as keyof typeof ProblemsVisualizationGenerator];
  const visualization = useMemo(() => visualizer(), [visualizer]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stepCount = visualization.steps.length;

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [problem.slug]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= stepCount - 1) {
      setIsPlaying(false);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= stepCount - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, stepCount, currentStep]);

  const handleStepSelect = useCallback((idx: number) => {
    setIsPlaying(false);
    setCurrentStep(idx);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {visualization.kind === 'array' && (
        <ArrayBars step={(visualization.steps as ArrayStep[])[currentStep]} />
      )}
      {visualization.kind === 'linked-list' && (
        <LinkedListArena step={(visualization.steps as LinkedListStep[])[currentStep]} />
      )}
      {visualization.kind === 'stack' && (
        <StackCanvas
          input={(visualization.steps as StackStep[])[currentStep].input}
          frame={(visualization.steps as StackStep[])[currentStep].frame}
        />
      )}

      {visualization.kind === 'array' && (
        <StepExplanation
          totalSteps={visualization.steps.length}
          steps={visualization.steps as ArrayStep[]}
          currentStep={currentStep}
          onStepSelect={handleStepSelect}
        />
      )}

      {visualization.kind !== 'array' && (
        <div className="bg-surface inset-ring-border/64 rounded-xl p-4 inset-ring-1">
          <p className="text-sm leading-relaxed">
            {(visualization.steps[currentStep] as { description: string }).description}
          </p>
        </div>
      )}

      <div className="bg-surface inset-ring-border/64 flex items-center gap-2 rounded-xl p-3 inset-ring-1">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => {
            setIsPlaying(false);
            setCurrentStep((s) => Math.max(0, s - 1));
          }}
          disabled={currentStep === 0}
        >
          <SkipBack className="size-3.5" />
        </Button>
        <Button
          size="icon"
          className="size-8"
          onClick={() => setIsPlaying((p) => !p)}
          disabled={stepCount <= 1}
        >
          {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => {
            setIsPlaying(false);
            setCurrentStep((s) => Math.min(stepCount - 1, s + 1));
          }}
          disabled={currentStep >= stepCount - 1}
        >
          <SkipForward className="size-3.5" />
        </Button>
        <span className="text-muted-foreground ml-auto font-mono text-xs">
          Step {currentStep + 1} / {stepCount}
        </span>
      </div>
    </div>
  );
}
