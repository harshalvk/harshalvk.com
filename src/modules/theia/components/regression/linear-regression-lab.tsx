// src/modules/theia/components/regression/linear-regression-lab.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RegressionCanvas } from './regression-canvas';
import { RegressionControls } from './regression-controls';
import {
  gradientDescentDetailedSteps,
  randomRegressionPoints,
} from '@/modules/theia/lib/regression-engine-v2';
import type { RegressionPoint } from '@/modules/theia/types/regression-v2';

export function LinearRegressionLab() {
  const [points, setPoints] = useState<RegressionPoint[]>(() => randomRegressionPoints());
  const [learningRate, setLearningRate] = useState(0.0006);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = useMemo(
    () => gradientDescentDetailedSteps(points, learningRate),
    [points, learningRate]
  );

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [points, learningRate]);

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
    }, 1400 / speed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length, currentStep]);

  const handleDatasetLoad = useCallback((pts: RegressionPoint[]) => {
    setError(null);
    setPoints(pts);
  }, []);

  const step = steps[currentStep];

  return (
    <div className="flex flex-col gap-4">
      <RegressionCanvas step={step} />

      {error && <p className="text-destructive text-sm">{error}</p>}

      <RegressionControls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onStepBack={() => {
          setIsPlaying(false);
          setCurrentStep((s) => Math.max(0, s - 1));
        }}
        onStepForward={() => {
          setIsPlaying(false);
          setCurrentStep((s) => Math.min(steps.length - 1, s + 1));
        }}
        currentStep={currentStep}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
        learningRate={learningRate}
        onLearningRateChange={setLearningRate}
        onDatasetLoad={handleDatasetLoad}
        onDatasetError={setError}
      />
    </div>
  );
}
