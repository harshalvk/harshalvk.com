'use client';

import { Pause, Play, RotateCcw, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export function VisualizerControls({
  isPlaying,
  onTogglePlay,
  onStepBack,
  onStepForward,
  onReset,
  onShuffle,
  speed,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  currentStep,
  totalSteps,
}: {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onShuffle: () => void;
  speed: number;
  onSpeedChange: (v: number) => void;
  arraySize: number;
  onArraySizeChange: (v: number) => void;
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="bg-surface inset-ring-border/64 flex h-fit flex-col gap-4 rounded-xl p-4 inset-ring-1 md:w-fit">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onStepBack}
          disabled={currentStep === 0}
          aria-label="Previous step"
        >
          <SkipBack />
        </Button>

        <Button size="icon" onClick={onTogglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause /> : <Play />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onStepForward}
          disabled={currentStep >= totalSteps - 1}
          aria-label="Next step"
        >
          <SkipForward />
        </Button>

        <Button variant="outline" size="icon" onClick={onReset} aria-label="Reset">
          <RotateCcw />
        </Button>

        <Button variant="outline" size="icon" onClick={onShuffle} aria-label="New random array">
          <Shuffle />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground w-12 shrink-0 text-xs">Speed</span>
          <Slider
            value={[speed]}
            min={1}
            max={10}
            step={1}
            onValueChange={([v]) => onSpeedChange(v)}
          />
          <span className="text-muted-foreground w-6 shrink-0 text-right font-mono text-xs">
            {speed}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-muted-foreground w-12 shrink-0 text-xs">Size</span>
          <Slider
            value={[arraySize]}
            min={5}
            max={40}
            step={1}
            onValueChange={([v]) => onArraySizeChange(v)}
            disabled={isPlaying}
          />
          <span className="text-muted-foreground w-6 shrink-0 text-right font-mono text-xs">
            {arraySize}
          </span>
        </div>
      </div>
    </div>
  );
}
