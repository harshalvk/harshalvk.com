'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RegressionCanvas, ClusteringCanvas } from './scatter-canvas';
import {
  mlGeneratorEngines,
  type MLAlgorithmMeta,
  type MLAlgoSlug,
} from '@/modules/theia/data/ml-algorithms';
import type { RegressionStep, ClusteringStep } from '@/modules/theia/types/ml-algorithm';

export function MLAlgorithmPlayer({ algorithm }: { algorithm: MLAlgorithmMeta }) {
  const algo = mlGeneratorEngines[algorithm.slug as MLAlgoSlug];

  const [data, setData] = useState(() => algo?.generateData());
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = useMemo(() => (algo ? algo.generateSteps(data) : []), [algo, data]);

  const handleShuffle = useCallback(() => {
    if (!algo) return;
    setIsPlaying(false);
    setCurrentStep(0);
    setData(algo.generateData());
  }, [algo]);

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [algorithm.slug]);

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;
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

  if (!algo || steps.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Visualization for this algorithm is not available.
      </p>
    );
  }

  const step = steps[currentStep] as RegressionStep | ClusteringStep;

  return (
    <div className="flex flex-col gap-4">
      {algorithm.kind === 'regression' ? (
        <RegressionCanvas
          points={(step as RegressionStep).points}
          slope={(step as RegressionStep).slope}
          intercept={(step as RegressionStep).intercept}
        />
      ) : (
        <ClusteringCanvas
          points={(step as ClusteringStep).points}
          centroids={(step as ClusteringStep).centroids}
        />
      )}

      <div className="bg-surface inset-ring-border/64 rounded-xl p-4 inset-ring-1">
        <p className="text-sm leading-relaxed">{step.description}</p>

        {algorithm.kind === 'regression' && (
          <div className="text-muted-foreground mt-3 flex gap-4 font-mono text-xs">
            <span>Slope: {(step as RegressionStep).slope.toFixed(3)}</span>
            <span>Intercept: {(step as RegressionStep).intercept.toFixed(2)}</span>
            <span>Loss: {(step as RegressionStep).loss.toFixed(2)}</span>
          </div>
        )}
      </div>

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
        <Button size="icon" onClick={() => setIsPlaying((p) => !p)}>
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
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setIsPlaying(false);
            setCurrentStep(0);
          }}
        >
          <RotateCcw />
        </Button>
        <Button variant="outline" size="icon" onClick={handleShuffle}>
          <Shuffle />
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
    </div>
  );
}
