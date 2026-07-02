import * as d3 from 'd3';
import type { DataPoint } from '@/modules/argus/types/projector';

export function buildColorScale(points: DataPoint[], column: string | null) {
  if (!column) return () => '#6366f1';

  const values = points.map((p) => p.metadata[column]);
  const isNumeric = values.every((v) => typeof v === 'number');

  if (isNumeric) {
    const nums = values as number[];
    const scale = d3
      .scaleSequential(d3.interpolateViridis)
      .domain([Math.min(...nums), Math.max(...nums)]);
    return (p: DataPoint) => scale(p.metadata[column] as number);
  }

  const categories = Array.from(new Set(values.map(String)));
  const scale = d3.scaleOrdinal(d3.schemeTableau10).domain(categories);
  return (p: DataPoint) => scale(String(p.metadata[column]));
}
