'use client';

import { useState } from 'react';
import { Link2, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export function LinkedListBuilder({
  onBuildCustom,
  onBuildRandom,
}: {
  onBuildCustom: (values: number[]) => void;
  onBuildRandom: (size: number) => void;
}) {
  const [input, setInput] = useState('10, 25, 7, 42, 18');
  const [size, setSize] = useState(6);

  const handleCustomBuild = () => {
    const values = input
      .split(',')
      .map((v) => parseInt(v.trim(), 10))
      .filter((v) => !Number.isNaN(v));

    if (values.length > 0) onBuildCustom(values);
  };

  return (
    <div className="bg-surface inset-ring-border/64 flex flex-col gap-4 rounded-xl p-4 inset-ring-1">
      <div className="flex flex-col gap-2">
        <Label htmlFor="ll-input" className="text-muted-foreground text-xs">
          Build a custom list (comma-separated values)
        </Label>
        <div className="flex gap-2">
          <Input
            id="ll-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 10, 25, 7, 42"
            className="font-mono text-sm"
          />
          <Button onClick={handleCustomBuild} size="sm" className="shrink-0 gap-1.5">
            <Link2 className="size-4" />
            Build
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-muted-foreground w-12 shrink-0 text-xs">Size</span>
        <Slider value={[size]} min={2} max={12} step={1} onValueChange={([v]) => setSize(v)} />
        <span className="text-muted-foreground w-6 shrink-0 text-right font-mono text-xs">
          {size}
        </span>
        <Button
          onClick={() => onBuildRandom(size)}
          size="sm"
          variant="outline"
          className="shrink-0 gap-1.5"
        >
          <Shuffle className="size-4" />
          Random
        </Button>
      </div>
    </div>
  );
}
