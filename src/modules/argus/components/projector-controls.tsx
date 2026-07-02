// src/modules/lab/components/projector-controls.tsx — additions to existing file
'use client';

import { useState } from 'react';
import {
  ChevronsUpDownIcon,
  SearchIcon,
  DownloadIcon,
  Maximize2Icon,
  Minimize2Icon,
  RotateCwIcon,
  Grid3x3Icon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { DataPoint } from '@/modules/argus/types/projector';

export function ProjectorControls({
  points,
  metadataColumns,
  colorByColumn,
  onColorByChange,
  onSearchSelect,
  totalCount,
  downsampled,
  pointSize,
  onPointSizeChange,
  autoRotate,
  onAutoRotateChange,
  showGrid,
  onShowGridChange,
  isFullscreen,
  onToggleFullscreen,
  onExport,
  explainedVariance,
}: {
  points: DataPoint[];
  metadataColumns: string[];
  colorByColumn: string | null;
  onColorByChange: (col: string | null) => void;
  onSearchSelect: (id: string) => void;
  totalCount: number;
  downsampled: boolean;
  pointSize: number;
  onPointSizeChange: (v: number) => void;
  autoRotate: boolean;
  onAutoRotateChange: (v: boolean) => void;
  showGrid: boolean;
  onShowGridChange: (v: boolean) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onExport: () => void;
  explainedVariance: number[];
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const totalVariance = explainedVariance.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-surface inset-ring-border/64 flex flex-wrap items-center gap-3 rounded-xl p-3 inset-ring-1">
      <div className="flex items-center gap-2">
        <Label className="text-muted-foreground text-xs whitespace-nowrap">Color by</Label>
        <Select
          value={colorByColumn ?? '__none__'}
          onValueChange={(v) => onColorByChange(v === '__none__' ? null : v)}
        >
          <SelectTrigger size="sm" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">None</SelectItem>
            {metadataColumns.map((col) => (
              <SelectItem key={col} value={col}>
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Popover open={searchOpen} onOpenChange={setSearchOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-52 justify-between gap-2 font-normal">
            <span className="text-muted-foreground flex items-center gap-2">
              <SearchIcon className="size-3.5" />
              Search points…
            </span>
            <ChevronsUpDownIcon className="text-muted-foreground size-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search by label…" />
            <CommandList>
              <CommandEmpty>No matches.</CommandEmpty>
              <CommandGroup>
                {points.slice(0, 200).map((p) => (
                  <CommandItem
                    key={p.id}
                    value={p.label}
                    onSelect={() => {
                      onSearchSelect(p.id);
                      setSearchOpen(false);
                    }}
                  >
                    {p.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
        <Label className="text-muted-foreground text-xs whitespace-nowrap">Point size</Label>
        <Slider
          value={[pointSize]}
          min={0.05}
          max={0.5}
          step={0.01}
          onValueChange={([v]) => onPointSizeChange(v)}
          className="w-24"
        />
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={autoRotate}
            onPressedChange={onAutoRotateChange}
            size="sm"
            aria-label="Auto-rotate"
          >
            <RotateCwIcon className="size-3.5" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>Auto-rotate</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={showGrid}
            onPressedChange={onShowGridChange}
            size="sm"
            aria-label="Toggle grid"
          >
            <Grid3x3Icon className="size-3.5" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>Toggle grid</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" className="size-8" onClick={onExport}>
            <DownloadIcon className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Export projected coordinates (CSV)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" className="size-8" onClick={onToggleFullscreen}>
            {isFullscreen ? (
              <Minimize2Icon className="size-3.5" />
            ) : (
              <Maximize2Icon className="size-3.5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</TooltipContent>
      </Tooltip>

      <div className="ml-auto flex items-center gap-2">
        {explainedVariance.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="cursor-default text-xs">
                {(totalVariance * 100).toFixed(0)}% variance explained
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              PC1: {(explainedVariance[0] * 100).toFixed(1)}% · PC2:{' '}
              {((explainedVariance[1] ?? 0) * 100).toFixed(1)}% · PC3:{' '}
              {((explainedVariance[2] ?? 0) * 100).toFixed(1)}%
            </TooltipContent>
          </Tooltip>
        )}
        {downsampled && (
          <Badge variant="outline" className="text-xs">
            Downsampled to {totalCount.toLocaleString()}
          </Badge>
        )}
        <span className="text-muted-foreground font-mono text-xs">
          {totalCount.toLocaleString()} points
        </span>
      </div>
    </div>
  );
}
