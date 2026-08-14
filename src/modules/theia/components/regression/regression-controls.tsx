'use client';

import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RegressionDatasetUpload } from './regression-dataset-upload';
import type { RegressionPoint } from '@/modules/theia/types/regression-v2';

export function RegressionControls({
  isPlaying,
  onTogglePlay,
  onStepBack,
  onStepForward,
  currentStep,
  totalSteps,
  speed,
  onSpeedChange,
  learningRate,
  onLearningRateChange,
  onDatasetLoad,
  onDatasetError,
}: {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onSpeedChange: (v: number) => void;
  learningRate: number;
  onLearningRateChange: (v: number) => void;
  onDatasetLoad: (points: RegressionPoint[]) => void;
  onDatasetError: (msg: string) => void;
}) {
  return (
    <div className="bg-surface inset-ring-border/64 flex flex-col gap-3 rounded-xl p-4 inset-ring-1">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon" onClick={onStepBack} disabled={currentStep === 0}>
          <SkipBack className="size-3.5" />
        </Button>
        <Button size="icon" onClick={onTogglePlay}>
          {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onStepForward}
          disabled={currentStep >= totalSteps - 1}
        >
          <SkipForward className="size-3.5" />
        </Button>

        <span className="text-muted-foreground ml-auto font-mono text-xs">
          Step {currentStep + 1} / {totalSteps}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <Label className="text-muted-foreground w-20 shrink-0 text-xs">Speed</Label>
          <Slider
            value={[speed]}
            min={1}
            max={10}
            step={1}
            onValueChange={([v]) => onSpeedChange(v)}
          />
          <span className="text-muted-foreground w-6 text-right font-mono text-xs">{speed}</span>
        </div>

        <div className="flex items-center gap-3">
          <Label className="text-muted-foreground w-20 shrink-0 text-xs">Learn rate</Label>
          <Slider
            value={[learningRate]}
            min={0.0001}
            max={0.002}
            step={0.0001}
            onValueChange={([v]) => onLearningRateChange(v)}
          />
          <span className="text-muted-foreground w-14 text-right font-mono text-xs">
            {learningRate.toFixed(4)}
          </span>
        </div>
      </div>

      <RegressionDatasetUpload onLoad={onDatasetLoad} onError={onDatasetError} />
    </div>
  );
}
