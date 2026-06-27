'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { LinkedListArena } from './linked-list-arena';
import { LinkedListBuilder } from './linked-list-builder';
import { LinkedListOperations } from './linked-list-operations';
import {
  buildLinkedList,
  randomLinkedListValues,
  insertAtHeadSteps,
  insertAtTailSteps,
  insertAtIndexSteps,
  deleteByValueSteps,
  deleteByIndexSteps,
  linearSearchSteps,
} from '@/modules/theia/lib/linked-list-engine';
import type { LinkedListNode, LinkedListStep } from '@/modules/theia/types/linked-list';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

function emptyStep(nodes: LinkedListNode[], description: string): LinkedListStep {
  return { nodes, highlights: {}, description };
}

export function LinkedListPlayground() {
  const [nodes, setNodes] = useState<LinkedListNode[]>(() =>
    buildLinkedList(randomLinkedListValues(6))
  );
  const [steps, setSteps] = useState<LinkedListStep[]>(() => [
    emptyStep(nodes, 'Random linked list generated. Try an operation below.'),
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [explainOpen, setExplainOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runSteps = useCallback((newSteps: LinkedListStep[]) => {
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(newSteps.length > 1);
    setNodes(newSteps[newSteps.length - 1].nodes);
  }, []);

  const handleBuildCustom = useCallback(
    (values: number[]) => {
      const list = buildLinkedList(values);
      setNodes(list);
      runSteps([emptyStep(list, `Custom list built with ${values.length} nodes.`)]);
    },
    [runSteps]
  );

  const handleBuildRandom = useCallback(
    (size: number) => {
      const list = buildLinkedList(randomLinkedListValues(size));
      setNodes(list);
      runSteps([emptyStep(list, `Random list of ${size} nodes generated.`)]);
    },
    [runSteps]
  );

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length, currentStep]);

  const step = steps[currentStep];

  return (
    <div className="flex flex-col gap-4">
      <LinkedListBuilder onBuildCustom={handleBuildCustom} onBuildRandom={handleBuildRandom} />

      <LinkedListArena step={step} />

      <Collapsible
        open={explainOpen}
        onOpenChange={setExplainOpen}
        className="bg-surface inset-ring-border/64 rounded-xl inset-ring-1"
      >
        <CollapsibleTrigger className="flex w-full items-start justify-between gap-3 p-4 text-left">
          <p className="flex-1 text-sm leading-relaxed">{step.description}</p>
          <ChevronDownIcon
            className={cn(
              'text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform',
              explainOpen && 'rotate-180'
            )}
          />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="max-h-72 overflow-y-auto border-t">
            {steps.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(idx);
                }}
                className={cn(
                  'flex w-full items-start gap-3 border-b border-dashed px-4 py-2.5 text-left text-sm last:border-b-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30',
                  idx === currentStep && 'bg-zinc-100 dark:bg-zinc-800/60'
                )}
              >
                <span className="text-muted-foreground w-8 shrink-0 font-mono text-xs">
                  {idx + 1}
                </span>
                <span className={cn('flex-1', idx === currentStep && 'font-medium')}>
                  {s.description}
                </span>
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="bg-surface inset-ring-border/64 flex flex-wrap items-center gap-2 rounded-xl p-4 inset-ring-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setIsPlaying(false);
            setCurrentStep((s) => Math.max(0, s - 1));
          }}
          disabled={currentStep === 0}
        >
          <SkipBack />
        </Button>
        <Button size="icon" onClick={() => setIsPlaying((p) => !p)} disabled={steps.length <= 1}>
          {isPlaying ? <Pause /> : <Play />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setIsPlaying(false);
            setCurrentStep((s) => Math.min(steps.length - 1, s + 1));
          }}
          disabled={currentStep >= steps.length - 1}
        >
          <SkipForward />
        </Button>

        <div className="flex flex-1 items-center gap-3 sm:max-w-56">
          <span className="text-muted-foreground w-12 shrink-0 text-xs">Speed</span>
          <Slider value={[speed]} min={1} max={10} step={1} onValueChange={([v]) => setSpeed(v)} />
          <span className="text-muted-foreground w-6 shrink-0 text-right font-mono text-xs">
            {speed}
          </span>
        </div>

        <span className="text-muted-foreground ml-auto font-mono text-xs">
          Step {currentStep + 1} / {steps.length}
        </span>
      </div>

      <LinkedListOperations
        disabled={isPlaying}
        onInsertHead={(value) => runSteps(insertAtHeadSteps(nodes, value))}
        onInsertTail={(value) => runSteps(insertAtTailSteps(nodes, value))}
        onInsertAtIndex={(value, index) => runSteps(insertAtIndexSteps(nodes, value, index))}
        onDeleteValue={(value) => runSteps(deleteByValueSteps(nodes, value))}
        onDeleteIndex={(index) => runSteps(deleteByIndexSteps(nodes, index))}
        onSearch={(value) => runSteps(linearSearchSteps(nodes, value))}
      />
    </div>
  );
}
