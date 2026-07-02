import type { DataPoint, ProjectedPoint } from '@/modules/argus/types/projector';

export function exportProjectionCSV(points: DataPoint[], projected: ProjectedPoint[]) {
  const rows = projected.map((p) => {
    const point = points.find((pt) => pt.id === p.id);
    return {
      label: point?.label ?? p.id,
      x: p.x.toFixed(4),
      y: p.y.toFixed(4),
      z: p.z.toFixed(4),
      ...point?.metadata,
    };
  });

  const headers = Object.keys(rows[0] ?? {});
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((h) => JSON.stringify((row as Record<string, unknown>)[h] ?? '')).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'projection.csv';
  a.click();
  URL.revokeObjectURL(url);
}
