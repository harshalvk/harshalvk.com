'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  ZAxis,
  Tooltip,
} from 'recharts';
import type { Point } from '@/modules/theia/types/ml-algorithm';

const CLUSTER_COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#a855f7', '#ec4899', '#ef4444'];

function CentroidCross({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx == null || cy == null) return null;

  const size = 7;
  return (
    <g stroke="var(--foreground)" strokeWidth={2}>
      <line x1={cx - size} y1={cy - size} x2={cx + size} y2={cy + size} />
      <line x1={cx + size} y1={cy - size} x2={cx - size} y2={cy + size} />
    </g>
  );
}

export function RegressionCanvas({
  points,
  slope,
  intercept,
}: {
  points: Point[];
  slope: number;
  intercept: number;
}) {
  const lineData = useMemo(() => {
    const xs = points.map((p) => p.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    return [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept },
    ];
  }, [points, slope, intercept]);

  return (
    <div className="bg-surface inset-ring-border/64 h-80 w-full rounded-xl p-4 inset-ring-1">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis type="number" dataKey="x" className="text-xs" tick={{ fill: 'currentColor' }} />
          <YAxis type="number" dataKey="y" className="text-xs" tick={{ fill: 'currentColor' }} />
          <Tooltip
            contentStyle={{
              background: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Scatter data={points} fill="var(--muted-foreground)" opacity={0.6} />
          <Line
            data={lineData}
            dataKey="y"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            type="linear"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ClusteringCanvas({
  points,
  centroids,
}: {
  points: { x: number; y: number; clusterId: number | null }[];
  centroids: Point[];
}) {
  const grouped = useMemo(() => {
    const groups = new Map<number | string, { x: number; y: number }[]>();
    points.forEach((p) => {
      const key = p.clusterId ?? 'unassigned';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push({ x: p.x, y: p.y });
    });
    return groups;
  }, [points]);

  return (
    <div className="bg-surface inset-ring-border/64 h-80 w-full rounded-xl p-4 inset-ring-1">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis type="number" dataKey="x" className="text-xs" tick={{ fill: 'currentColor' }} />
          <YAxis type="number" dataKey="y" className="text-xs" tick={{ fill: 'currentColor' }} />
          <ZAxis range={[60, 60]} />
          <Tooltip
            contentStyle={{
              background: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          {Array.from(grouped.entries()).map(([key, data]) => (
            <Scatter
              key={key}
              data={data}
              fill={
                key === 'unassigned'
                  ? 'var(--muted-foreground)'
                  : CLUSTER_COLORS[Number(key) % CLUSTER_COLORS.length]
              }
            />
          ))}
          <Scatter data={centroids} shape={CentroidCross} fill="var(--foreground)" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
