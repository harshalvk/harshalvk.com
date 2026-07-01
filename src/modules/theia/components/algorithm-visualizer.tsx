'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AlgorithmMeta } from '@/modules/theia/types/algorithm';
import { generators } from '@/modules/theia/lib/sorting-algorithms';
import { ALGORITHM_CODE, type CodeLang } from '@/modules/theia/data/algorithm-code';
import { ArrayBars } from './array-bars';
import { VisualizerControls } from './visualizer-controls';
import { StepExplanation } from './step-explanation';
import { CodeBlock } from './code-block';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

function randomArray(size: number) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

const LANGUAGES: { value: CodeLang; label: string }[] = [
  { value: 'ts', label: 'TypeScript' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
];

export function AlgorithmVisualizer({ algorithm }: { algorithm: AlgorithmMeta }) {
  const [arraySize, setArraySize] = useState(15);
  const [baseArray, setBaseArray] = useState<number[]>(() => randomArray(15));
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [lang, setLang] = useState<CodeLang>('ts');

  const generator = generators[algorithm.slug as keyof typeof generators];
  const steps = useMemo(() => generator(baseArray), [baseArray, generator]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const codeForAlgo = ALGORITHM_CODE[algorithm.slug];

  const handleShuffle = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    setBaseArray(randomArray(arraySize));
  }, [arraySize]);

  const handleArraySizeChange = useCallback((size: number) => {
    setArraySize(size);
    setIsPlaying(false);
    setCurrentStep(0);
    setBaseArray(randomArray(size));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const handleStepSelect = useCallback((index: number) => {
    setIsPlaying(false);
    setCurrentStep(index);
  }, []);

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

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [algorithm.slug]);

  const step = steps[currentStep];

  return (
    <div className="flex flex-col gap-4">
      <ArrayBars step={step} />

      <StepExplanation
        steps={steps}
        currentStep={currentStep}
        onStepSelect={handleStepSelect}
        totalSteps={steps.length}
      />
      <div className="flex flex-col gap-4 md:flex-row">
        <VisualizerControls
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          onStepBack={() => setCurrentStep((s) => Math.max(0, s - 1))}
          onStepForward={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
          onReset={handleReset}
          onShuffle={handleShuffle}
          speed={speed}
          onSpeedChange={setSpeed}
          arraySize={arraySize}
          onArraySizeChange={handleArraySizeChange}
          currentStep={currentStep}
          totalSteps={steps.length}
        />
        {codeForAlgo ? (
          <div className="flex flex-1 flex-col gap-2">
            <Tabs value={lang} onValueChange={(v) => setLang(v as CodeLang)}>
              <TabsList>
                {LANGUAGES.map((l) => (
                  <TabsTrigger key={l.value} value={l.value} className="font-mono text-xs">
                    {l.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <CodeBlock code={codeForAlgo[lang]} lang={lang} activeLine={step.line} />
          </div>
        ) : (
          <div className="bg-surface inset-ring-border/64 flex h-72 items-center justify-center rounded-xl text-sm inset-ring-1">
            <p className="text-muted-foreground">
              Code walkthrough coming soon for this algorithm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
