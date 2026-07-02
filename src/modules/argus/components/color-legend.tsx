'use client';

import * as d3 from 'd3';
import type { DataPoint } from '@/modules/argus/types/projector';

export function ColorLegend({ points, column }: { points: DataPoint[]; column: string | null }) {
  if (!column) return null;

  const values = points.map((p) => p.metadata[column]);
  const isNumeric = values.every((v) => typeof v === 'number');

  if (isNumeric) {
    const nums = values as number[];
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const scale = d3.scaleSequential(d3.interpolateViridis).domain([min, max]);

    return (
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">{min.toFixed(1)}</span>
        <div
          className="h-2.5 w-24 rounded-full"
          style={{
            background: `linear-gradient(to right, ${scale(min)}, ${scale((min + max) / 2)}, ${scale(max)})`,
          }}
        />
        <span className="text-muted-foreground text-xs">{max.toFixed(1)}</span>
      </div>
    );
  }

  const categories = Array.from(new Set(values.map(String))).slice(0, 10);
  const scale = d3.scaleOrdinal(d3.schemeTableau10).domain(categories);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {categories.map((cat) => (
        <div key={cat} className="flex items-center gap-1.5">
          <span className="size-2.5 shrink-0 rounded-full" style={{ background: scale(cat) }} />
          <span className="text-muted-foreground text-xs">{cat}</span>
        </div>
      ))}
    </div>
  );
}
